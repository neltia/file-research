from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from api.config import DATABASE_URL
from api.models import Base

# SQLAlchemy 동기 엔진 생성
engine = create_engine(DATABASE_URL, echo=True)

# 동기 세션 생성
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


# DB 세션 종속성
def get_db():
    with SessionLocal() as session:
        yield session


# 데이터베이스 테이블이 존재하는지 확인하는 함수
def is_db_initialized():
    with engine.connect() as conn:
        table_names = _check_tables_sync(conn)
        return bool(table_names)


# sync_conn에 대해 inspector 사용
def _check_tables_sync(sync_conn):
    inspector = inspect(sync_conn)
    return inspector.get_table_names()


# 테이블 생성 함수
def init_db():
    if not is_db_initialized():
        with engine.begin() as conn:
            Base.metadata.create_all(conn)
    print("Database initialized")


if __name__ == "__main__":
    init_db()
