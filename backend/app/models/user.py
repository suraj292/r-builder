import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from app.db.base import Base

class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    CAREER_PLUS = "career_plus"

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
    job_title = Column(String(255), nullable=True)
    phone_number = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE, nullable=False)
    ai_credits_used = Column(Integer, default=0, nullable=False)
    ats_scans_used = Column(Integer, default=0, nullable=False)
    quota_reset_date = Column(DateTime(timezone=True), nullable=True)
    registration_source = Column(Enum(RegistrationSource), default=RegistrationSource.EMAIL, nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)
    last_password_reset = Column(DateTime(timezone=True), nullable=True)
    
    # Email Verification
    is_email_verified = Column(Boolean, default=False, nullable=False)
    email_verification_token = Column(String(255), nullable=True)
    email_verification_expires = Column(DateTime(timezone=True), nullable=True)
    email_verified_at = Column(DateTime(timezone=True), nullable=True)
    
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    stripe_customer_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
