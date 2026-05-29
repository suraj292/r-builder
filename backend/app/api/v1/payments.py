from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
from typing import Optional

from app.api.deps import get_current_user, get_db
from app.models.user import User, SubscriptionTier
from app.models.subscription import Plan, Subscription, SubscriptionStatus
from app.models.payment import Transaction, PaymentStatus
from app.services.payment_service import RazorpayService

router = APIRouter()
razorpay_service = RazorpayService()

@router.post("/create-order")
async def create_payment_order(
    plan_tier: str,
    period: str, # 'monthly' or 'yearly'
    currency: str = "INR",
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
    amount = 0
    if currency == "INR":
        # Check regional prices
        if plan.regional_prices and "INR" in plan.regional_prices:
            amount = plan.regional_prices["INR"]["yearly" if period == "yearly" else "monthly"]
        else:
            # Fallback (though ideally we should have regional prices set)
            amount = plan.price_yearly if period == "yearly" else plan.price_monthly
    else:
        # Default to base price (assuming base is USD)
        amount = plan.price_yearly if period == "yearly" else plan.price_monthly

    # Create Razorpay Order
    try:
        order = razorpay_service.create_order(amount=amount, currency=currency)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay error: {str(e)}")
    
    # Create pending transaction
    transaction = Transaction(
        user_id=current_user.id,
        plan_id=plan.id,
        razorpay_order_id=order["id"],
        amount=amount,
        currency=currency,
        status=PaymentStatus.PENDING
    )
    db.add(transaction)
    await db.commit()
    
    return {
        "order_id": order["id"],
        "amount": amount,
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
