from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime

class ResumeBase(BaseModel):
    title: str
    data: Dict[str, Any]
    template_id: str | None = "modern"

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(ResumeBase):
    title: str | None = None
    data: Dict[str, Any] | None = None

class ResumeOut(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True
