from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from api.db import get_db
from api.services.file_service import save_file_metadata
import io

router = APIRouter()


@router.post("/upload")
def upload(
    file: UploadFile = File(...),
    is_public: str = Form("false"),
    db: Session = Depends(get_db)
):
    # read file binary
    content = file.file.read()
    content_io = io.BytesIO(content)

    # 문자열 값을 Boolean으로 변환
    is_public_bool = is_public.lower() in ["true", "1", "yes"]  # "true", "1", "yes" → True

    result = save_file_metadata(db, file.filename, content_io.getvalue(), is_public_bool)
    return result
