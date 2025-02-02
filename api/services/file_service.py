from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.sql import text
from api.models import FileMetadata
from typing import Optional, List

import io
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
        image = Image.open(io.BytesIO(file_content))
        info = image._getexif()

        if info:
            for tag, value in info.items():
                tag_name = TAGS.get(tag, tag)

                if isinstance(value, bytes):
                    try:
                        value = value.decode("utf-8", "ignore")
                    except UnicodeDecodeError:
                        value = base64.b64encode(value).decode("utf-8")

                exif_data[tag_name] = value

            gps_info = info.get(34853)
            if gps_info:
                latitude = gps_info.get(2)
                longitude = gps_info.get(4)

                if latitude and longitude:
                    exif_data["latitude"] = latitude[0] + latitude[1] / 60 + latitude[2] / 3600
                    exif_data["longitude"] = longitude[0] + longitude[1] / 60 + longitude[2] / 3600
    except Exception as e:
        print(f"EXIF 추출 실패: {e}")
    return exif_data


# 파일 메타데이터를 DB에 저장
def save_file_metadata(db: Session, filename: str, content: bytes, is_public: bool):
    file_hash = calculate_hash(content)
    file_extension = get_file_extension(filename)
    file_size = get_file_size(content)
    exif_data = extract_exif_data(content)
    exif_json = json.dumps(exif_data, default=str)

    result = db.execute(text("SELECT 1 FROM file_metadata WHERE sha256 = :sha"), {"sha": file_hash["sha256"]})
    if result.first():
        return {"message": "File already exists", "sha256": file_hash["sha256"]}

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
    db.commit()

    return {"message": "File uploaded successfully", "sha256": file_hash["sha256"]}


# 파일 전체 리스트: 공개된 파일 목록만 반환
def get_file_list(db: Session, include_private: bool = False):
    query = select(FileMetadata).order_by(FileMetadata.created_at.desc()).limit(20)
    if not include_private:
        query = query.where(FileMetadata.is_public == True)

    result = db.execute(query)
    files = result.scalars().all()
    return [{"filename": f.filename, "sha256": f.sha256, "filesize": f.filesize} for f in files]


# 파일 업로드 결과 검색
def search_files_service(
    db: Session,
    filename: Optional[str],
    sha256: Optional[str],
    md5: Optional[str],
    sha1: Optional[str],
    extension: Optional[str],
    is_public: Optional[bool]
) -> List[dict]:
    query = db.query(FileMetadata)

    if filename:
        query = query.filter(FileMetadata.filename.ilike(filename))
    if sha256:
        query = query.filter(FileMetadata.sha256 == sha256)
    if md5:
        query = query.filter(FileMetadata.md5 == md5)
    if sha1:
        query = query.filter(FileMetadata.sha1 == sha1)
    if extension:
        query = query.filter(FileMetadata.extension == extension)
    if is_public is not None:
        query = query.filter(FileMetadata.is_public == is_public)

    results = query.all()

    return [
        {
            "filename": file.filename,
            "filesize": file.filesize,
            "extension": file.extension,
            "sha256": file.sha256,
            "md5": file.md5,
            "sha1": file.sha1,
            "latitude": file.latitude,
            "longitude": file.longitude,
            "is_public": file.is_public,
            "created_at": file.created_at
        }
        for file in results
    ]


# SHA256을 기준으로 파일 정보 조회
def get_file_by_sha256(db: Session, sha256: str):
    result = db.execute(select(FileMetadata).where(FileMetadata.sha256 == sha256))
    file = result.scalars().first()
    return file
