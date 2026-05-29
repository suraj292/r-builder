from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(255), default="ResumeAI")
    maintenance_mode = Column(Boolean, default=False)
    allow_new_registrations = Column(Boolean, default=True)
    contact_email = Column(String(255), default="support@resumeai.com")

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
