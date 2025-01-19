from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_db
from services import file_service

router = APIRouter()


@router.get("/file/list")
async def get_file_list(
    include_private: bool = Query(False, description="Set to true to include private files"),
    db: AsyncSession = Depends(get_db)
):
    files = await file_service.get_file_list(db, include_private)
    return files


@router.get("/file/{sha256}")
async def get_file_info(sha256: str, db: AsyncSession = Depends(get_db)):
    file = await file_service.get_file_by_sha256(db, sha256)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return {
        "filename": file.filename,
        "filesize": file.filesize,
        "extension": file.extension,
        "sha256": file.sha256,
        "md5": file.md5,
        "sha1": file.sha1,
        "latitude": file.latitude,
        "longitude": file.longitude,
        "file_metadata": file.file_metadata,
        "created_at": file.created_at,
    }
