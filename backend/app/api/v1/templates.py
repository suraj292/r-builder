from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, Any

from app.api.deps import get_db
from app.models.template import TemplateSettings

router = APIRouter()

@router.get("/settings")
async def get_public_template_settings(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get all public template settings overrides (for the builder to know which are active/locked).
    """
    stmt = select(TemplateSettings)
    result = await db.execute(stmt)
    settings_list = result.scalars().all()
    
    return {s.template_id: {"isActive": s.is_active, "requiredTier": s.required_tier} for s in settings_list}
