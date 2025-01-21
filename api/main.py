from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import health, file, file_info

from contextlib import asynccontextmanager
from api.db import async_engine, init_db


# ✅ Lifespan 이벤트 핸들러 정의
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("FastAPI Server Start")

    # 데이터베이스 초기화
    await init_db()
    print("DB conn connected")

    yield  # 👈 FastAPI 실행

    print("FastAPI Server terminated")
    await async_engine.dispose()
    print("DB conn closed")


# fastapi app
app = FastAPI(lifespan=lifespan, docs_url="/api/docs", openapi_url="/api/openapi.json")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1",
        "http://localhost",
        "https://analysis-file-neltias-projects.vercel.app",
        "https://dev-bloguide.vercel.app",
        "https://bloguide.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 라우트 등록
app.include_router(health.router, prefix="/api")
app.include_router(file.router, prefix="/api")
app.include_router(file_info.router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
