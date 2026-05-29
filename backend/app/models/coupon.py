from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_percent = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    
    max_uses_total = Column(Integer, nullable=True) # Overall global limit
    used_count_total = Column(Integer, default=0)
    
    per_user_limit = Column(Integer, default=1) # Limit per unique user
    min_purchase_amount = Column(Integer, nullable=True) # In paise/cents
    restricted_to_plan = Column(String(50), nullable=True) # e.g., 'career_plus' only
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class UserCouponUsage(Base):
    __tablename__ = "user_coupon_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id", ondelete="CASCADE"), index=True)
    usage_count = Column(Integer, default=0)
    last_used = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="coupon_usages")
    coupon = relationship("Coupon", backref="user_usages")
