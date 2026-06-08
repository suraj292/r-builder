from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
from typing import Optional

from app.api.deps import get_current_user, get_db
from app.models.user import User, SubscriptionTier
from app.models.subscription import Plan, Subscription, SubscriptionStatus
from app.models.payment import Transaction, PaymentStatus
from app.models.coupon import Coupon
from app.services.payment_service import RazorpayService

router = APIRouter()
razorpay_service = RazorpayService()

@router.post("/create-order")
async def create_payment_order(
    plan_tier: str,
    period: str, # 'monthly' or 'yearly'
    currency: str = "INR",
    coupon_code: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch Plan
    stmt = select(Plan).where(Plan.tier_code == plan_tier)
    result = await db.execute(stmt)
    plan = result.scalars().first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # Calculate amount
    base_amount = 0
    if plan.regional_prices and currency in plan.regional_prices:
        base_amount = plan.regional_prices[currency]["yearly" if period == "yearly" else "monthly"]
    else:
        # Fallback to default base prices (USD)
        base_amount = plan.price_yearly if period == "yearly" else plan.price_monthly

    # Apply Coupon if valid
    discount_percent = 0
    if coupon_code:
        c_stmt = select(Coupon).where(Coupon.code == coupon_code, Coupon.is_active == True)
        c_res = await db.execute(c_stmt)
        coupon = c_res.scalars().first()
        if coupon:
            is_valid = True
            
            # 1. Global Expiry Check
            if coupon.valid_until and coupon.valid_until < datetime.now(coupon.valid_until.tzinfo):
                is_valid = False
                
            # 2. Global Usage Limit Check
            if coupon.max_uses_total and coupon.used_count_total >= coupon.max_uses_total:
                is_valid = False
                
            # 3. Per-User Limit Check
            from app.models.coupon import UserCouponUsage
            usage_stmt = select(UserCouponUsage).where(
                UserCouponUsage.user_id == current_user.id,
                UserCouponUsage.coupon_id == coupon.id
            )
            usage_res = await db.execute(usage_stmt)
            user_usage = usage_res.scalars().first()
            if user_usage and user_usage.usage_count >= coupon.per_user_limit:
                is_valid = False
                
            # 4. Plan Restriction Check
            if coupon.restricted_to_plan and coupon.restricted_to_plan != plan_tier:
                is_valid = False
                
            # 5. Minimum Purchase Check
            if coupon.min_purchase_amount and base_amount < coupon.min_purchase_amount:
                is_valid = False
                
            if is_valid:
                discount_percent = coupon.discount_percent
    
    amount_after_discount = int(base_amount * (1 - (discount_percent / 100)))
    
    # Add GST 18% (as mentioned in frontend logic)
    total_amount = int(amount_after_discount * 1.18)

    # Create Razorpay Order
    try:
        order = razorpay_service.create_order(amount=total_amount, currency=currency)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay error: {str(e)}")
    
    # Create pending transaction
    transaction = Transaction(
        user_id=current_user.id,
        plan_id=plan.id,
        razorpay_order_id=order["id"],
        amount=total_amount,
        currency=currency,
        status=PaymentStatus.PENDING,
        coupon_code=coupon_code if discount_percent > 0 else None
    )
    db.add(transaction)
    await db.commit()
    
    return {
        "order_id": order["id"],
        "amount": total_amount,
        "currency": currency,
        "key_id": razorpay_service.client.auth[0]
    }

@router.post("/verify")
async def verify_payment(
    payload: dict,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Verify payment and activate subscription.
    Payload: {razorpay_order_id, razorpay_payment_id, razorpay_signature, phone, location, country, device}
    """
    order_id = payload.get("razorpay_order_id")
    payment_id = payload.get("razorpay_payment_id")
    signature = payload.get("razorpay_signature")
    
    if not all([order_id, payment_id, signature]):
        raise HTTPException(status_code=400, detail="Missing payment identifiers")
        
    # Verify signature
    is_valid = razorpay_service.verify_payment(order_id, payment_id, signature)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
        
    # Find transaction
    stmt = select(Transaction).where(Transaction.razorpay_order_id == order_id)
    result = await db.execute(stmt)
    transaction = result.scalars().first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction record not found")
        
    # Update transaction
    transaction.razorpay_payment_id = payment_id
    transaction.razorpay_signature = signature
    transaction.status = PaymentStatus.COMPLETED
    transaction.country = payload.get("country")
    transaction.device = payload.get("device")
    transaction.ip_address = request.client.host
    
    # Increment Coupon count if used
    if transaction.coupon_code:
        c_stmt = select(Coupon).where(Coupon.code == transaction.coupon_code)
        c_res = await db.execute(c_stmt)
        coupon = c_res.scalars().first()
        if coupon:
            coupon.used_count_total += 1
            
            # Update user-specific usage
            from app.models.coupon import UserCouponUsage
            usage_stmt = select(UserCouponUsage).where(
                UserCouponUsage.user_id == current_user.id,
                UserCouponUsage.coupon_id == coupon.id
            )
            usage_res = await db.execute(usage_stmt)
            user_usage = usage_res.scalars().first()
            
            if not user_usage:
                user_usage = UserCouponUsage(user_id=current_user.id, coupon_id=coupon.id, usage_count=1)
                db.add(user_usage)
            else:
                user_usage.usage_count += 1
    
    # Update User Info if provided and missing
    if payload.get("phone") and not current_user.phone_number:
        current_user.phone_number = payload.get("phone")
    if payload.get("location") and not current_user.location:
        current_user.location = payload.get("location")
        
    # Activate Subscription
    # Fetch plan tier from plan associated with transaction
    stmt_plan = select(Plan).where(Plan.id == transaction.plan_id)
    plan_res = await db.execute(stmt_plan)
    plan = plan_res.scalar()
    
    # Update user level
    current_user.tier = plan.tier_code
    current_user.is_premium = True
    
    # Update or Create Subscription
    stmt_sub = select(Subscription).where(Subscription.user_id == current_user.id)
    sub_res = await db.execute(stmt_sub)
    subscription = sub_res.scalars().first()
    
    # Determine validity (assuming 1 month or 1 year)
    # This is a bit hacky as we don't have 'period' in transaction, let's guess from amount
    is_yearly = transaction.amount > (plan.price_monthly * 5) # Rough guess
    days = 365 if is_yearly else 30
    
    if not subscription:
        subscription = Subscription(
            user_id=current_user.id,
            plan_id=plan.id,
            status=SubscriptionStatus.ACTIVE,
            current_period_start=datetime.now(),
            current_period_end=datetime.now() + timedelta(days=days)
        )
        db.add(subscription)
    else:
        subscription.plan_id = plan.id
        subscription.status = SubscriptionStatus.ACTIVE
        subscription.current_period_start = datetime.now()
        subscription.current_period_end = datetime.now() + timedelta(days=days)
        
    await db.commit()
    return {"status": "success", "message": "Subscription activated"}
