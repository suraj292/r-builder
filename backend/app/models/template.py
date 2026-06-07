from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class TemplateSettings(Base):
    __tablename__ = "template_settings"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String(100), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    required_tier = Column(String(50), nullable=True) # e.g., 'free', 'pro', 'career_plus'
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
