from fastapi import FastAPI
from api.routes import health, file, file_info

from contextlib import asynccontextmanager
from api.db import engine, init_db


# Lifespan 이벤트 핸들러 정의
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("FastAPI Server Start")

    # 데이터베이스 초기화
    init_db()
    print("DB conn connected")

    yield  # FastAPI 실행

    print("FastAPI Server terminated")
    engine.dispose()
    print("DB conn closed")


# fastapi app
app = FastAPI(
    lifespan=lifespan,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# 라우트 등록
app.include_router(health.router, prefix="/api")
app.include_router(file.router, prefix="/api")
app.include_router(file_info.router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)
