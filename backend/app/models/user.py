import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from app.db.base import Base

class UserRole(str, enum.Enum):
    USER = "user"
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    CONTENT_MANAGER = "content_manager"
    SUPPORT = "support"

class RegistrationSource(str, enum.Enum):
    EMAIL = "email"
    GOOGLE = "google"
    LINKEDIN = "linkedin"
    GITHUB = "github"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True) # Null for OAuth users
    full_name = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    registration_source = Column(Enum(RegistrationSource), default=RegistrationSource.EMAIL, nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)
    last_password_reset = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    stripe_customer_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
