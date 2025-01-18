from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 앱의 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(file: UploadFile = File(None), query: str = Form(None)):
    if file:
        content = await file.read()
        # 파일 처리 로직
        return {"filename": file.filename, "content_length": len(content)}
    elif query:
        # 쿼리 처리 로직
        return {"query": query}
    else:
        return {"error": "No file or query provided"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

