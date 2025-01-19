import uuid
from sqlalchemy import Column, String, Integer, Float, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class FileMetadata(Base):
    __tablename__ = "file_metadata"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sha256 = Column(String, unique=True, index=True, nullable=False)
    md5 = Column(String, nullable=False)
    sha1 = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    filesize = Column(Integer, nullable=False)
    extension = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    file_metadata = Column(JSONB, nullable=True)  # EXIF 메타데이터 저장
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
