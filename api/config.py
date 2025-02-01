import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 환경 변수 가져오기
DATABASE_NAME = os.getenv("POSTGRES_DATABASE", "neondb")
DATABASE_HOST = os.getenv("POSTGRES_HOST")
DATABASE_USER = os.getenv("POSTGRES_USER")
DATABASE_PASSWORD = os.getenv("POSTGRES_PASSWORD")

# 비동기 PostgreSQL URL 생성 (asyncpg 사용)
DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE_NAME}"
