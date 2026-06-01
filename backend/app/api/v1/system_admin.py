from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.models.system import SystemSettings
from app.schemas.system import SystemSettingsUpdate, SystemSettingsOut

router = APIRouter()

@router.get("/", response_model=SystemSettingsOut)
async def get_system_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
) -> Any:
    """
    Get global system settings.
    """
    result = await db.execute(select(SystemSettings).limit(1))
    settings = result.scalars().first()
    
    if not settings:
        # Initialize default settings if not exists
        settings = SystemSettings()
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
        
    return settings

@router.put("/", response_model=SystemSettingsOut)
async def update_system_settings(
    *,
    db: AsyncSession = Depends(get_db),
    settings_in: SystemSettingsUpdate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
) -> Any:
    """
    Update global system settings.
    """
    result = await db.execute(select(SystemSettings).limit(1))
    settings = result.scalars().first()
    
    if not settings:
        settings = SystemSettings()
        db.add(settings)
        
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
        
    await db.commit()
    await db.refresh(settings)
    return settings
