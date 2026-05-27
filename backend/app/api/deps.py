from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import jwt, JWTError
from app.db.session import SessionLocal
from app.config import settings
from app.models.user import User, UserRole
from app.schemas.auth import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login")

async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session

async def get_current_user(db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    stmt = select(User).where(User.email == token_data.email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if user is None:
        raise credentials_exception
    return user

def require_role(allowed_roles: List[UserRole]):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user
    return role_checker

# Feature gating logic
# In production, this would be fetched from the `plans` table in the database
PLAN_LIMITS = {
    "free": {"ai_credits": 10, "ats_scans": 3, "premium_templates": False},
    "pro": {"ai_credits": 500, "ats_scans": -1, "premium_templates": True},
    "career_plus": {"ai_credits": -1, "ats_scans": -1, "premium_templates": True},
}

def check_feature_access(feature: str, cost: int = 1):
    async def _checker(user: User = Depends(get_current_user)):
        # Fallback to free if tier is somehow not set
        tier = user.tier.value if hasattr(user.tier, 'value') else (user.tier or 'free')
        limits = PLAN_LIMITS.get(tier, PLAN_LIMITS["free"])
        
        if feature == "premium_templates":
            if not limits.get("premium_templates"):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Upgrade to Pro or Career+ to access premium templates."
                )
                
        elif feature == "ai_generation":
            limit = limits.get("ai_credits")
            if limit != -1 and (user.ai_credits_used + cost) > limit:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="AI Credit limit reached. Please upgrade your plan."
                )
                
        elif feature == "ats_scan":
            limit = limits.get("ats_scans")
            if limit != -1 and (user.ats_scans_used + cost) > limit:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="ATS Scan limit reached. Please upgrade your plan."
                )
                
        return True
    return _checker
