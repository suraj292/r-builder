from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.models.seo import SEOConfig
from app.schemas.seo import SEOConfigCreate, SEOConfigUpdate, SEOConfigOut, SEOOptimizeRequest

from app.models.blog import BlogPost, PostStatus

router = APIRouter()

@router.post("/optimize")
async def optimize_seo(
    request: SEOOptimizeRequest,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    from app.services.blog_ai import BlogAIService
    try:
        suggestion = await BlogAIService.optimize_page_seo(request.path, request.context)
        return {"suggestion": suggestion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/discover-pages")
async def discover_pages(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Returns a list of all targetable paths on the platform.
    """
    # 1. Static Core Pages
    static_pages = [
        {"path": "/", "label": "Home Page", "type": "static"},
        {"path": "/about", "label": "About Us", "type": "static"},
        {"path": "/ats-checker", "label": "ATS Resume Checker", "type": "static"},
        {"path": "/pricing", "label": "Pricing & Plans", "type": "static"},
        {"path": "/faq", "label": "FAQ", "type": "static"},
        {"path": "/contact", "label": "Contact Us", "type": "static"},
        {"path": "/blog", "label": "Blog Listing", "type": "static"},
        {"path": "/builder", "label": "Resume Builder", "type": "static"},
    ]
    
    # 2. Dynamic Blog Posts
    result = await db.execute(select(BlogPost).where(BlogPost.status == PostStatus.PUBLISHED))
    blogs = result.scalars().all()
    blog_pages = [{"path": f"/blog/{b.slug}", "label": f"Blog: {b.title}", "type": "blog"} for b in blogs]
    
    return static_pages + blog_pages

@router.get("/", response_model=List[SEOConfigOut])
async def list_seo_configs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
) -> Any:
    result = await db.execute(select(SEOConfig).order_by(SEOConfig.path))
    return result.scalars().all()

@router.post("/", response_model=SEOConfigOut)
async def create_seo_config(
    *,
    db: AsyncSession = Depends(get_db),
    config_in: SEOConfigCreate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
) -> Any:
    # Check if path already exists
    res = await db.execute(select(SEOConfig).where(SEOConfig.path == config_in.path))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="SEO configuration for this path already exists.")
    
    config = SEOConfig(**config_in.model_dump())
    config.last_updated_by = current_user.id
    db.add(config)
    await db.commit()
    await db.refresh(config)
    return config

@router.put("/{config_id}", response_model=SEOConfigOut)
async def update_seo_config(
    *,
    db: AsyncSession = Depends(get_db),
    config_id: int,
    config_in: SEOConfigUpdate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
) -> Any:
    res = await db.execute(select(SEOConfig).where(SEOConfig.id == config_id))
    config = res.scalars().first()
    if not config:
        raise HTTPException(status_code=404, detail="SEO config not found")
        
    update_data = config_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(config, field, value)
    
    config.last_updated_by = current_user.id
    await db.commit()
    await db.refresh(config)
    return config

@router.delete("/{config_id}")
async def delete_seo_config(
    *,
    db: AsyncSession = Depends(get_db),
    config_id: int,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
) -> Any:
    res = await db.execute(select(SEOConfig).where(SEOConfig.id == config_id))
    config = res.scalars().first()
    if not config:
        raise HTTPException(status_code=404, detail="SEO config not found")
        
    await db.delete(config)
    await db.commit()
    return {"success": True}
