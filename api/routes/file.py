from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_db
from services.file_service import save_file_metadata

router = APIRouter()


@router.post("/upload")
async def upload(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    content = await file.read()
    result = await save_file_metadata(db, file.filename, content)
    return result
