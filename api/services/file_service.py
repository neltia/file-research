import hashlib
import os
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import text
from models import FileMetadata
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS


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
                exif_data[tag_name] = value

            # 위치 정보 추출 (위도, 경도)
            gps_info = info.get(34853)  # GPSInfo 태그
            if gps_info:
                latitude = gps_info.get(2)
                longitude = gps_info.get(4)

                if latitude and longitude:
                    exif_data["latitude"] = latitude[0] + latitude[1] / 60 + latitude[2] / 3600
                    exif_data["longitude"] = longitude[0] + longitude[1] / 60 + longitude[2] / 3600
    except Exception as e:
        print(e)
    return exif_data


# 파일 메타데이터를 DB에 저장
async def save_file_metadata(db: AsyncSession, filename: str, content: bytes):
    file_hash = calculate_hash(content)
    file_extension = get_file_extension(filename)
    file_size = get_file_size(content)
    exif_data = extract_exif_data(content)

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
        file_metadata=json.dumps(exif_data),
    )
    db.add(new_file)
    await db.commit()

    return {"message": "File uploaded successfully", "sha256": file_hash["sha256"]}


# SHA256을 기준으로 파일 정보 조회
async def get_file_by_sha256(db: AsyncSession, sha256: str):
    result = await db.execute(select(FileMetadata).where(FileMetadata.sha256 == sha256))
    file = result.scalars().first()
    return file
