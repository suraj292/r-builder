from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api.deps import get_current_user, get_db
from app.models.user import User, SubscriptionTier
from app.models.subscription import Plan, Subscription, SubscriptionStatus
from app.config import settings
import hmac
import hashlib

from app.schemas.coupon import CouponValidate
from app.models.coupon import Coupon
from datetime import datetime, timezone

router = APIRouter()

@router.get("/validate-coupon", response_model=CouponValidate)
async def validate_coupon(
    code: str,
    plan_tier: Optional[str] = None,
    amount: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Validate a coupon code with advanced restrictions.
    """
    stmt = select(Coupon).where(Coupon.code == code, Coupon.is_active == True)
    result = await db.execute(stmt)
    coupon = result.scalars().first()
    
    if not coupon:
        return CouponValidate(code=code, discount_percent=0, valid=False, message="Invalid or inactive coupon code.")
        
    # 1. Global Expiry Check
    if coupon.valid_until and coupon.valid_until < datetime.now(timezone.utc):
        return CouponValidate(code=code, discount_percent=0, valid=False, message="This coupon has expired.")
        
    # 2. Global Usage Limit Check
    if coupon.max_uses_total and coupon.used_count_total >= coupon.max_uses_total:
        return CouponValidate(code=code, discount_percent=0, valid=False, message="This coupon has reached its total usage limit.")
        
    # 3. Per-User Limit Check
    from app.models.coupon import UserCouponUsage
    usage_stmt = select(UserCouponUsage).where(
        UserCouponUsage.user_id == current_user.id,
        UserCouponUsage.coupon_id == coupon.id
    )
    usage_res = await db.execute(usage_stmt)
    user_usage = usage_res.scalars().first()
    
    if user_usage and user_usage.usage_count >= coupon.per_user_limit:
        return CouponValidate(code=code, discount_percent=0, valid=False, message=f"You have already used this coupon {coupon.per_user_limit} time(s).")
        
    # 4. Plan Restriction Check
    if coupon.restricted_to_plan and plan_tier and coupon.restricted_to_plan != plan_tier:
        return CouponValidate(code=code, discount_percent=0, valid=False, message=f"This coupon is only valid for the {coupon.restricted_to_plan} plan.")
        
    # 5. Minimum Purchase Check
    if coupon.min_purchase_amount and amount and amount < coupon.min_purchase_amount:
        return CouponValidate(code=code, discount_percent=0, valid=False, message=f"Minimum purchase of {(coupon.min_purchase_amount/100):.2f} required.")
        
    return CouponValidate(
        code=coupon.code,
        discount_percent=coupon.discount_percent,
        valid=True,
        message=f"Coupon applied! {coupon.discount_percent}% discount."
    )

# Note: In production, use the official razorpay SDK.
# import razorpay
# client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.get("/plans")
async def get_plans(db: AsyncSession = Depends(get_db)):
    """
    Get all active subscription plans.
    """
    stmt = select(Plan).where(Plan.is_active == True)
    result = await db.execute(stmt)
    plans = result.scalars().all()
    
    if not plans:
        # Fallback hardcoded plans if DB is empty for initial run
        return [
            {"tier_code": "free", "name": "Free", "price_monthly": 0, "features": {"ai_credits": 10, "ats_scans": 3, "premium_templates": False}},
            {"tier_code": "pro", "name": "Pro", "price_monthly": 900, "features": {"ai_credits": 500, "ats_scans": -1, "premium_templates": True}},
            {"tier_code": "career_plus", "name": "Career+", "price_monthly": 1900, "features": {"ai_credits": -1, "ats_scans": -1, "premium_templates": True}},
        ]
        
    return plans

@router.post("/checkout")
async def create_checkout_session(
    plan_tier: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate a Razorpay order/subscription ID for checkout.
    """
    # 1. Fetch Plan from DB
    stmt = select(Plan).where(Plan.tier_code == plan_tier)
    result = await db.execute(stmt)
    plan = result.scalars().first()
    
    if not plan and plan_tier != "free":
        # Temporary mock for frontend development
        mock_sub_id = f"sub_mock_{plan_tier}_{current_user.id}"
        return {"subscription_id": mock_sub_id, "key": settings.RAZORPAY_KEY_ID}
    
    if plan_tier == "free":
        # Downgrade to free instantly
        current_user.tier = SubscriptionTier.FREE
        current_user.is_premium = False
        await db.commit()
        return {"status": "success", "message": "Downgraded to free"}
        
    # In real world:
    # razorpay_sub = client.subscription.create({"plan_id": plan.razorpay_plan_id_monthly, "customer_notify": 1, "total_count": 12})
    # return {"subscription_id": razorpay_sub['id'], "key": settings.RAZORPAY_KEY_ID}
    
    return {"error": "Razorpay not fully initialized."}

@router.post("/mock-upgrade")
async def mock_upgrade(
    tier: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Instantly upgrades a user for local testing purposes.
    """
    if tier not in [t.value for t in SubscriptionTier]:
        raise HTTPException(400, "Invalid tier")
        
    current_user.tier = SubscriptionTier(tier)
    current_user.is_premium = tier != "free"
    # Reset quotas on upgrade
    current_user.ai_credits_used = 0
    current_user.ats_scans_used = 0
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.post("/webhook")
async def razorpay_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Receive webhook events from Razorpay (e.g. subscription.charged)
    """
    payload = await request.body()
    signature = request.headers.get("x-razorpay-signature", "")
    
    # Verify signature
    # expected_signature = hmac.new(
    #    bytes(settings.RAZORPAY_WEBHOOK_SECRET, 'utf-8'),
    #    msg=payload,
    #    digestmod=hashlib.sha256
    # ).hexdigest()
    # if not hmac.compare_digest(expected_signature, signature):
    #    raise HTTPException(status_code=400, detail="Invalid signature")

    data = await request.json()
    event = data.get("event")
    
    if event == "subscription.charged":
        sub_id = data["payload"]["subscription"]["entity"]["id"]
        # 1. Find Subscription in DB
        # 2. Update status
        # 3. Update User.tier and User.is_premium
        pass
        
    return {"status": "ok"}
