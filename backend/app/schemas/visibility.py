from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Visibility Config Schemas
class VisibilityConfigBase(BaseModel):
    business_info: Optional[Dict[str, Any]] = None
    social_links: Optional[Dict[str, Any]] = None
    google_settings: Optional[Dict[str, Any]] = None
    ai_discovery: Optional[Dict[str, Any]] = None
    trust_center: Optional[Dict[str, Any]] = None
    branding_settings: Optional[Dict[str, Any]] = None

class VisibilityConfigCreate(VisibilityConfigBase):
    pass

class VisibilityConfigUpdate(VisibilityConfigBase):
    pass

class VisibilityConfigOut(VisibilityConfigBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Site Audit Schemas
class SiteAuditBase(BaseModel):
    overall_score: int = 0
    seo_score: int = 0
    ai_score: int = 0
    perf_score: int = 0
    accessibility_score: int = 0
    issues: Optional[List[Dict[str, Any]]] = None
    summary: Optional[Dict[str, Any]] = None

class SiteAuditCreate(SiteAuditBase):
    pass

class SiteAuditOut(SiteAuditBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Dashboard Overview
class VisibilityExecutiveSummary(BaseModel):
    visibility_config: VisibilityConfigOut
    latest_audit: Optional[SiteAuditOut] = None
    scores: Dict[str, int]
    alerts: List[Dict[str, Any]]
