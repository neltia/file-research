from fastapi import APIRouter, UploadFile, HTTPException
from fastapi import File, Form, Depends, Query
from sqlalchemy.orm import Session
from api.db import get_db
from api.services.file_service import save_file_metadata, search_files_service
import io
from typing import Optional, List
import mimetypes

router = APIRouter()
ALLOWED_IMAGE_MIME_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/gif"}


# 파일 업로드
@router.post("/upload")
def upload(
    file: UploadFile = File(...),
    is_public: str = Form("false"),
    db: Session = Depends(get_db)
):
    # 이미지 파일만 업로드 가능하도록 제한
    mime_type, _ = mimetypes.guess_type(file.filename)

    if mime_type not in ALLOWED_IMAGE_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed.")

    # read file binary
    content = file.file.read()
    content_io = io.BytesIO(content)

    # 문자열 값을 Boolean으로 변환
    is_public_bool = is_public.lower() in ["true", "1", "yes"]  # "true", "1", "yes" → True

    result = save_file_metadata(db, file.filename, content_io.getvalue(), is_public_bool)
    return result


# 업로드된 파일을 검색하는 API
@router.get("/search", response_model=List[dict])
def search_files(
    filename: Optional[str] = Query(None, min_length=1, max_length=255, description="파일 이름"),
    sha256: Optional[str] = Query(None, min_length=64, max_length=64, description="SHA256 해시"),
    md5: Optional[str] = Query(None, min_length=32, max_length=32, description="MD5 해시"),
    sha1: Optional[str] = Query(None, min_length=40, max_length=40, description="SHA1 해시"),
    extension: Optional[str] = Query(None, min_length=1, max_length=10, description="파일 확장자"),
    db: Session = Depends(get_db)
):
    if filename:
        filename = filename.replace("*", "%")

    results = search_files_service(db, filename, sha256, md5, sha1, extension, True)

    if not results:
        raise HTTPException(status_code=404, detail="No matching files found.")

    return results
