from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CouponBase(BaseModel):
    code: str
    discount_percent: float
    is_active: Optional[bool] = True
    valid_until: Optional[datetime] = None
    max_uses_total: Optional[int] = None
    per_user_limit: Optional[int] = 1
    min_purchase_amount: Optional[int] = None
    restricted_to_plan: Optional[str] = None

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    is_active: Optional[bool] = None
    valid_until: Optional[datetime] = None
    max_uses_total: Optional[int] = None
    per_user_limit: Optional[int] = None

class CouponOut(CouponBase):
    id: int
    used_count_total: Optional[int] = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CouponValidate(BaseModel):
    code: str
    discount_percent: float
    valid: bool
    message: str
