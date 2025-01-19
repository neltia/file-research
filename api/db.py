import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from config import ASYNC_DATABASE_URL
from models import Base

# SQLAlchemy 비동기 엔진 생성
async_engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)

# 비동기 세션 생성
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)


# DB 세션 종속성
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# 테이블 생성 함수
async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database initialized")


if __name__ == "__main__":
    asyncio.run(init_db())
