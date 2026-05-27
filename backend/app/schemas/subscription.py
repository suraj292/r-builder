from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime
from app.models.subscription import SubscriptionTier

class PlanBase(BaseModel):
    tier_code: SubscriptionTier
    name: str
    price_monthly: int
    price_yearly: int
    features: Dict[str, Any]
    is_active: bool = True

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    price_monthly: Optional[int] = None
    price_yearly: Optional[int] = None
    features: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class PlanOut(PlanBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CreditAdjustment(BaseModel):
    amount: int
    reason: Optional[str] = None
