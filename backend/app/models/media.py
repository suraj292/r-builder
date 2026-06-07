from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class MediaLibrary(Base):
    __tablename__ = "media_library"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String(500), nullable=False) # R2/S3 key or local path
    file_name = Column(String(255), nullable=False)
    alt_text = Column(String(255), nullable=True)
    caption = Column(String(500), nullable=True)
    mime_type = Column(String(100), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    
    uploaded_by = Column(Integer, ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    uploader = relationship("User")
