from typing import Any, List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.models.visibility import VisibilityConfig, SiteAudit
from app.schemas.visibility import (
    VisibilityConfigOut, VisibilityConfigUpdate, 
    SiteAuditOut, VisibilityExecutiveSummary
)

router = APIRouter()

@router.get("/summary", response_model=VisibilityExecutiveSummary)
async def get_visibility_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    # 1. Get config (initialize if missing)
    result = await db.execute(select(VisibilityConfig).limit(1))
    config = result.scalars().first()
    if not config:
        config = VisibilityConfig(
            business_info={}, social_links={}, google_settings={},
            ai_discovery={}, trust_center={}, branding_settings={}
        )
        db.add(config)
        await db.commit()
        await db.refresh(config)

    # 2. Get latest audit
    audit_res = await db.execute(select(SiteAudit).order_by(SiteAudit.timestamp.desc()).limit(1))
    latest_audit = audit_res.scalars().first()

    # 3. Check SEO Configs count
    from app.models.seo import SEOConfig
    seo_count_res = await db.execute(select(func.count(SEOConfig.id)))
    seo_count = seo_count_res.scalar() or 0

    # 4. Generate dynamic alerts
    alerts = []
    if not config.business_info or not config.business_info.get("business_name"):
        alerts.append({"module": "settings", "issue": "Missing Business Info", "severity": "high"})
    if not config.google_settings or not config.google_settings.get("ga4_measurement_id"):
        alerts.append({"module": "google", "issue": "Google Analytics not connected", "severity": "medium"})
    if not latest_audit:
        alerts.append({"module": "audit", "issue": "No site audit performed", "severity": "high"})
    if seo_count == 0:
        alerts.append({"module": "seo", "issue": "No custom SEO rules defined", "severity": "medium"})

    return {
        "visibility_config": config,
        "latest_audit": latest_audit,
        "scores": {
            "overall": latest_audit.overall_score if latest_audit else 0,
            "seo": latest_audit.seo_score if latest_audit else 0,
            "ai": latest_audit.ai_score if latest_audit else 0,
            "perf": latest_audit.perf_score if latest_audit else 0
        },
        "alerts": alerts,
        "seo_count": seo_count # We can add this to the schema if needed or just use it for logic
    }

@router.get("/config", response_model=VisibilityConfigOut)
async def get_visibility_config(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    result = await db.execute(select(VisibilityConfig).limit(1))
    config = result.scalars().first()
    if not config:
        config = VisibilityConfig(
            business_info={}, social_links={}, google_settings={},
            ai_discovery={}, trust_center={}, branding_settings={}
        )
        db.add(config)
        await db.commit()
        await db.refresh(config)
    return config

@router.put("/config", response_model=VisibilityConfigOut)
async def update_visibility_config(
    config_in: VisibilityConfigUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    result = await db.execute(select(VisibilityConfig).limit(1))
    config = result.scalars().first()
    
    if not config:
        config = VisibilityConfig()
        db.add(config)
    
    update_data = config_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(config, field, value)
    
    await db.commit()
    await db.refresh(config)
    return config

@router.get("/audits", response_model=List[SiteAuditOut])
async def list_site_audits(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    result = await db.execute(select(SiteAudit).order_by(SiteAudit.timestamp.desc()).limit(10))
    return result.scalars().all()

@router.post("/audits/run")
async def run_site_audit(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    # In production, this would trigger an actual crawler/lighthouse process.
    # For local dev, we generate randomized but consistent sub-scores.
    import random
    
    seo = random.randint(75, 98)
    ai = random.randint(60, 92)
    perf = random.randint(70, 95)
    access = random.randint(70, 95)
    
    # Calculate overall as average for logical consistency
    overall = int((seo + ai + perf + access) / 4)
    
    audit = SiteAudit(
        overall_score=overall,
        seo_score=seo,
        ai_score=ai,
        perf_score=perf,
        accessibility_score=access,
        issues=[
            {"module": "seo", "issue": "Meta titles are slightly long", "severity": "medium"},
            {"module": "ai", "issue": "Missing Organization schema on about page", "severity": "high"},
            {"module": "perf", "issue": "Images could be further optimized", "severity": "low"}
        ],
        summary={"total_pages": 15, "errors": 1, "warnings": 4}
    )
    db.add(audit)
    await db.commit()
    await db.refresh(audit)
    return audit
import os

@router.get("/robots.txt")
async def get_robots_txt():
    try:
        # Assuming robots.txt is in the frontend public folder or backend root
        # In a real setup, we'd manage this via a file or database
        path = os.path.join(os.getcwd(), "robots.txt")
        if os.path.exists(path):
            with open(path, "r") as f:
                return {"content": f.read()}
        return {"content": "User-agent: *\nAllow: /"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/robots.txt")
async def update_robots_txt(
    data: Dict[str, str],
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    try:
        content = data.get("content", "User-agent: *\nAllow: /")
        path = os.path.join(os.getcwd(), "robots.txt")
        with open(path, "w") as f:
            f.write(content)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
