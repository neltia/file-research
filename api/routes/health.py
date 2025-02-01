from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from api.db import get_db

router = APIRouter()


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1"))
        return {"status": "connected", "result": result.scalar()}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
