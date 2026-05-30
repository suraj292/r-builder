from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import jwt, JWTError
from app.db.session import SessionLocal
from app.config import settings
from app.models.user import User, UserRole, SubscriptionTier
from app.schemas.auth import TokenData
from app.models.subscription import Plan, Subscription
from app.models.resume import Resume
from sqlalchemy import func

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login", auto_error=False)

async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session

async def get_current_user(db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
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

async def get_current_user_optional(db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        token_data = TokenData(email=email)
        stmt = select(User).where(User.email == token_data.email)
        result = await db.execute(stmt)
        return result.scalars().first()
    except JWTError:
        return None

def require_role(allowed_roles: List[UserRole]):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user
    return role_checker

def check_feature_access(feature: str, cost: int = 1):
    async def _checker(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
        # 1. Fetch the user's current plan features
        stmt = select(Plan).join(Subscription).where(
            Subscription.user_id == user.id,
            Subscription.status == "active"
        )
        result = await db.execute(stmt)
        plan = result.scalars().first()
        
        # Fallback to hardcoded free limits if no active subscription record found
        if not plan:
            # We can also query for the 'free' tier plan specifically
            stmt_free = select(Plan).where(Plan.tier_code == SubscriptionTier.FREE)
            res_free = await db.execute(stmt_free)
            plan = res_free.scalars().first()
            
        if not plan:
            # Last resort hardcoded fallback if DB is empty
            features = {"ai_credits": 10, "ats_scans": 3, "resume_limit": 3, "premium_templates": False}
        else:
            features = plan.features

        if feature == "premium_templates":
            if not features.get("premium_templates"):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Upgrade to Pro or Career+ to access premium templates."
                )
                
        elif feature == "ai_generation":
            limit = features.get("ai_credits", 0)
            if limit != -1 and (user.ai_credits_used + cost) > limit:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="AI Credit limit reached. Please upgrade your plan."
                )
                
        elif feature == "ats_scan":
            limit = features.get("ats_scans", 0)
            if limit != -1 and (user.ats_scans_used + cost) > limit:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="ATS Scan limit reached. Please upgrade your plan."
                )
        
        elif feature == "resume_creation":
            limit = features.get("resume_limit", 0)
            if limit != -1:
                # Count current resumes
                stmt_count = select(func.count(Resume.id)).where(Resume.user_id == user.id)
                res_count = await db.execute(stmt_count)
                count = res_count.scalar()
                if count >= limit:
                    raise HTTPException(
                        status_code=status.HTTP_402_PAYMENT_REQUIRED,
                        detail=f"You have reached your limit of {limit} resumes. Please upgrade or delete old resumes."
                    )
                
        return user
    return _checker
