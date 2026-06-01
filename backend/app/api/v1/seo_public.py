from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api.deps import get_db
from app.models.seo import SEOConfig
from app.schemas.seo import SEOConfigOut

router = APIRouter()

@router.get("/config", response_model=Optional[SEOConfigOut])
async def get_seo_config(
    path: str = Query(...),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Fetch SEO configuration for a specific path.
    """
    result = await db.execute(select(SEOConfig).where(SEOConfig.path == path))
    config = result.scalars().first()
    return config

@router.get("/sitemap.xml")
async def generate_sitemap(
    db: AsyncSession = Depends(get_db)
):
    """
    Dynamically generate XML sitemap based on SEO configurations.
    """
    result = await db.execute(select(SEOConfig).where(SEOConfig.include_in_sitemap == True))
    configs = result.scalars().all()
    
    # Simple XML generation logic (can be expanded)
    xml = '<?xml version="1.0" encoding="UTF-8"?>'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    
    # Base URL should come from settings
    base_url = "https://resumeai.com" # Example
    
    for config in configs:
        xml += '<url>'
        xml += f'<loc>{base_url}{config.path}</loc>'
        xml += f'<priority>{config.sitemap_priority}</priority>'
        xml += f'<changefreq>{config.sitemap_changefreq}</changefreq>'
        xml += '</url>'
        
    xml += '</urlset>'
    return xml # Note: In production use Response(content=xml, media_type="application/xml")
