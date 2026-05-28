from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TemplateSettingsBase(BaseModel):
    is_active: Optional[bool] = None
    required_tier: Optional[str] = None

class TemplateSettingsUpdate(TemplateSettingsBase):
    pass

class TemplateSettingsOut(TemplateSettingsBase):
    id: int
    template_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
