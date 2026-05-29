from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class GuestAnalyzeRequest(BaseModel):
    resume_data: Optional[Dict[str, Any]] = None
    resume_text: Optional[str] = None
    target_profession: Optional[str] = "Professional"
    device_info: Optional[str] = None

class GuestScanLogOut(BaseModel):
    id: int
    ip_address: str
    created_at: datetime
    
    class Config:
        from_attributes = True
