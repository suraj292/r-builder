from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.schemas.user import UserOut
from app.models.resume import Resume
from app.config import settings

router = APIRouter()

@router.get("/ai-config")
async def get_ai_config(
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get current AI configuration.
    """
    return {
        "ai_provider": settings.AI_PROVIDER,
        "openai_model": settings.OPENAI_MODEL,
        "gemini_model": settings.GEMINI_MODEL,
        "openai_key_configured": bool(settings.OPENAI_API_KEY),
        "gemini_key_configured": bool(settings.GEMINI_API_KEY)
    }

@router.get("/settings")
async def get_system_settings(
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get global system settings.
    """
    return {
        "project_name": settings.PROJECT_NAME,
        "maintenance_mode": False,
        "allow_new_registrations": True,
        "contact_email": "support@resumeai.com"
    }

@router.get("/users", response_model=List[UserOut])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get all registered users. Admin only.
    """
    stmt = select(User)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/resumes")
async def get_all_resumes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT]))
):
    """
    Get all resumes with user information.
    """
    stmt = select(Resume).join(User)
    result = await db.execute(stmt)
    resumes = result.scalars().all()
    
    return [
        {
            "id": r.id,
            "title": r.title,
            "user_email": r.user.email,
            "template_id": r.template_id,
            "created_at": r.created_at,
            "updated_at": r.updated_at
        }
        for r in resumes
    ]

@router.get("/stats")
async def get_system_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT]))
):
    """
    Get high-level system statistics.
    """
    # Count total users
    user_count_stmt = select(func.count(User.id))
    user_result = await db.execute(user_count_stmt)
    total_users = user_result.scalar() or 0
    
    # Count total resumes
    resume_count_stmt = select(func.count(Resume.id))
    resume_result = await db.execute(resume_count_stmt)
    total_resumes = resume_result.scalar() or 0
    
    # Count premium users
    premium_count_stmt = select(func.count(User.id)).where(User.is_premium == True)
    premium_result = await db.execute(premium_count_stmt)
    total_premium = premium_result.scalar() or 0
    
    return {
        "total_users": total_users,
        "active_subscriptions": total_premium,
        "resumes_created": total_resumes,
        "ai_usage_today": 0
    }

@router.patch("/users/{user_id}/role", response_model=UserOut)
async def update_user_role(
    user_id: int,
    new_role: UserRole,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """
    Update a user's role. Super Admin only.
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = new_role
    await db.commit()
    await db.refresh(user)
    return user
