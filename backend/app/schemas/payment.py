from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.payment import PaymentStatus

class TransactionBase(BaseModel):
    amount: int
    currency: str
    status: PaymentStatus
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    country: Optional[str] = None
    device: Optional[str] = None
    coupon_code: Optional[str] = None

class TransactionOut(TransactionBase):
    id: int
    user_email: str
    plan_name: str
    created_at: datetime

    class Config:
        from_attributes = True
