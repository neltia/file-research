from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import text
from models import FileMetadata

from PIL import Image
from PIL.ExifTags import TAGS
import hashlib
import os
import json
import base64


# 해시값 계산 함수
def calculate_hash(file_content):
    return {
        "sha256": hashlib.sha256(file_content).hexdigest(),
        "md5": hashlib.md5(file_content).hexdigest(),
        "sha1": hashlib.sha1(file_content).hexdigest(),
    }


# 파일 확장자 분석
def get_file_extension(filename):
    return os.path.splitext(filename)[-1].lower()


# 파일 크기 분석
def get_file_size(file_content):
    return len(file_content)


# EXIF 데이터 추출
def extract_exif_data(file_content):
    exif_data = {}
    try:
        image = Image.open(file_content)
        info = image._getexif()

        if info:
            for tag, value in info.items():
                tag_name = TAGS.get(tag, tag)

                # 바이너리 데이터 처리 (EXIF 정보에 binary 포함될 수 있음)
                if isinstance(value, bytes):
                    try:
                        value = value.decode("utf-8", "ignore")  # UTF-8 변환 시도, 실패 시 무시
                    except UnicodeDecodeError:
                        value = base64.b64encode(value).decode("utf-8")  # Base64 변환

                exif_data[tag_name] = value

            # GPS 정보 변환
            gps_info = info.get(34853)  # GPSInfo 태그
            if gps_info:
                latitude = gps_info.get(2)
                longitude = gps_info.get(4)

                if latitude and longitude:
                    exif_data["latitude"] = latitude[0] + latitude[1] / 60 + latitude[2] / 3600
                    exif_data["longitude"] = longitude[0] + longitude[1] / 60 + longitude[2] / 3600
    except Exception as e:
        print(f"EXIF 추출 실패: {e}")  # 오류 발생 시 출력
    return exif_data


# 파일 메타데이터를 DB에 저장
async def save_file_metadata(db: AsyncSession, filename: str, content: bytes, is_public: bool):
    file_hash = calculate_hash(content)
    file_extension = get_file_extension(filename)
    file_size = get_file_size(content)
    exif_data = extract_exif_data(content)
    # JSON 직렬화 오류 방지 (바이너리 데이터 포함될 경우 문자열로 변환)
    exif_json = json.dumps(exif_data, default=str)

    # 중복 확인
    result = await db.execute(text("SELECT 1 FROM file_metadata WHERE sha256 = :sha"), {"sha": file_hash["sha256"]})
    if result.first():
        return {"message": "File already exists", "sha256": file_hash["sha256"]}

    # DB 저장
    new_file = FileMetadata(
        sha256=file_hash["sha256"],
        md5=file_hash["md5"],
        sha1=file_hash["sha1"],
        filename=filename,
        filesize=file_size,
        extension=file_extension,
        latitude=exif_data.get("latitude"),
        longitude=exif_data.get("longitude"),
        file_metadata=exif_json,
        is_public=is_public
    )
    db.add(new_file)
    await db.commit()

    return {"message": "File uploaded successfully", "sha256": file_hash["sha256"]}


# 파일 전체 리스트: 공개된 파일 목록만 반환
async def get_file_list(db: AsyncSession, include_private: bool = False):
    if include_private:
        # 관리자용: 전체 파일 조회 (관리자 인증 추가 가능)
        result = await db.execute(select(FileMetadata))
    else:
        # 일반 사용자용: 공개 파일만 조회
        result = await db.execute(select(FileMetadata).where(FileMetadata.is_public == True))

    files = result.scalars().all()
    return [{"filename": f.filename, "sha256": f.sha256, "filesize": f.filesize} for f in files]


# SHA256을 기준으로 파일 정보 조회
async def get_file_by_sha256(db: AsyncSession, sha256: str):
    result = await db.execute(select(FileMetadata).where(FileMetadata.sha256 == sha256))
    file = result.scalars().first()

    if file is None or file.is_public:
        return None
    return file
