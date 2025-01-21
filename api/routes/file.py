from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.db import get_db
from api.services.file_service import save_file_metadata

router = APIRouter()


@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    is_public: str = Form("false"),
    db: AsyncSession = Depends(get_db)
):
    # read file binary
    content = await file.read()

    # 문자열 값을 Boolean으로 변환
    is_public_bool = is_public.lower() in ["true", "1", "yes"]  # "true", "1", "yes" → True

    result = await save_file_metadata(db, file.filename, content, is_public_bool)
    return result
