from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityLogCreate(BaseModel):
    action: str
    details: Optional[str] = None
    ip_address: Optional[str] = None

class ActivityLogOut(BaseModel):
    id: int
    user_id: int
    action: str
    details: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
