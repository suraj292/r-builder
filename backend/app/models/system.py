from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.db.base import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(255), default="ResumeAI")
    site_domain = Column(String(255), default="resumeai.com")
    
    # Appearance
    site_logo = Column(String(500), nullable=True) # URL to logo
    site_icon = Column(String(500), nullable=True) # URL to favicon
    
    # Contact Details
    contact_email = Column(String(255), default="support@resumeai.com")
    contact_phone = Column(String(50), nullable=True)
    contact_address = Column(Text, nullable=True)
    
    # Social Media (JSON)
    # { "facebook": "", "twitter": "", "linkedin": "", "instagram": "" }
    social_links = Column(JSON, nullable=True)

    maintenance_mode = Column(Boolean, default=False)
    allow_new_registrations = Column(Boolean, default=True)

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
