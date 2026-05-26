from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    CONTENT_MANAGER = "content_manager"
    SUPPORT = "support"

class RegistrationSource(str, Enum):
    EMAIL = "email"
    GOOGLE = "google"
    LINKEDIN = "linkedin"
    GITHUB = "github"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None

class UserOut(UserBase):
    id: int
    role: UserRole
    registration_source: RegistrationSource
    last_login: datetime | None = None
    last_password_reset: datetime | None = None
    is_active: bool
    is_premium: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: str | None = None
