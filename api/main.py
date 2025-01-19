from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import health, file, file_info

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "https://analysis-file-neltias-projects.vercel.app",
        "https://dev-bloguide.vercel.app",
        "https://bloguide.vercel.app"
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
