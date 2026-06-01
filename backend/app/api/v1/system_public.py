from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api.deps import get_db
from app.models.system import SystemSettings
from app.schemas.system import SystemSettingsOut

router = APIRouter()

@router.get("/settings", response_model=SystemSettingsOut)
async def get_public_system_settings(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get public system settings for the frontend.
    """
    result = await db.execute(select(SystemSettings).limit(1))
    settings = result.scalars().first()
    
    if not settings:
        settings = SystemSettings()
        # Not committing here to avoid writes on GET, but returning defaults
        
    return settings
