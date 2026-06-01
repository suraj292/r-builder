from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class SystemSettingsBase(BaseModel):
    project_name: str = "ResumeAI"
    site_domain: str = "resumeai.com"
    site_logo: Optional[str] = None
    site_icon: Optional[str] = None
    contact_email: str = "support@resumeai.com"
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    social_links: Optional[Dict[str, str]] = {
        "facebook": "",
        "twitter": "",
        "linkedin": "",
        "instagram": ""
    }
    maintenance_mode: bool = False
    allow_new_registrations: bool = True

class SystemSettingsUpdate(BaseModel):
    project_name: Optional[str] = None
    site_domain: Optional[str] = None
    site_logo: Optional[str] = None
    site_icon: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    maintenance_mode: Optional[bool] = None
    allow_new_registrations: Optional[bool] = None

class SystemSettingsOut(SystemSettingsBase):
    updated_at: datetime

    class Config:
        from_attributes = True
