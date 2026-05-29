from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    plan_id = Column(Integer, ForeignKey("plans.id"))
    
    razorpay_order_id = Column(String(255), unique=True, index=True)
    razorpay_payment_id = Column(String(255), unique=True, index=True, nullable=True)
    razorpay_signature = Column(String(500), nullable=True)
    
    amount = Column(Integer, nullable=False) # In cents/paise
    currency = Column(String(10), default="INR")
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    
    # Metadata requested by user
    country = Column(String(100), nullable=True)
    device = Column(String(255), nullable=True)
    ip_address = Column(String(50), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="transactions")
    plan = relationship("Plan")
