import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    CAREER_PLUS = "career_plus"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    TRIALING = "trialing"

class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    tier_code = Column(Enum(SubscriptionTier), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    price_monthly = Column(Integer, nullable=False) # In cents/paise
    price_yearly = Column(Integer, nullable=False) # In cents/paise
    razorpay_plan_id_monthly = Column(String(255), nullable=True)
    razorpay_plan_id_yearly = Column(String(255), nullable=True)
    regional_prices = Column(JSON, nullable=True) # e.g. {"INR": {"monthly": 49900, "yearly": 499000}}
    features = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    plan_id = Column(Integer, ForeignKey("plans.id"))
    razorpay_subscription_id = Column(String(255), unique=True, index=True, nullable=True)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE)
    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="subscription")
    plan = relationship("Plan")
