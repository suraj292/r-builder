from fastapi import APIRouter, Depends, Request
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/checkout-session")
async def create_checkout_session(current_user: User = Depends(get_current_user)):
    # TODO: Initialize Stripe checkout
    return {"url": "https://stripe.com/checkout"}

@router.post("/webhook")
async def stripe_webhook(request: Request):
    # TODO: Handle Stripe events
    return {"status": "success"}
