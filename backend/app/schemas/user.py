from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None

class UserOut(UserBase):
    id: int
    is_active: bool
    is_premium: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: str | None = None
