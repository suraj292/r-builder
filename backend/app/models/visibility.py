from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.db.base import Base

class VisibilityConfig(Base):
    __tablename__ = "visibility_configs"

    id = Column(Integer, primary_key=True, index=True)
    
    # Module 1: Business & Visibility Settings
    # { "business_name": "", "brand_name": "", "website_url": "", "logo": "", "description": "", 
    #   "primary_keywords": [], "secondary_keywords": [], "email": "", "phone": "", 
    #   "address": "", "city": "", "state": "", "country": "", "support_email": "", "sales_email": "" }
    business_info = Column(JSON, nullable=True)
    
    # Module 6: Social Media
    # { "facebook": "", "instagram": "", "linkedin": "", "twitter": "", "youtube": "", 
    #   "github": "", "pinterest": "", "threads": "", "tiktok": "", "og_image": "" }
    social_links = Column(JSON, nullable=True)
    
    # Module 5: Google Management
    # { "ga4_measurement_id": "", "search_console_tag": "", "google_business_url": "", "google_maps_url": "" }
    google_settings = Column(JSON, nullable=True)
    
    # Module 3 & 4: AI Discovery & Schema Defaults
    # { "ai_readiness_score": 0, "target_schemas": [], "faq_defaults": [] }
    ai_discovery = Column(JSON, nullable=True)
    
    # Module 11: Trust Center Defaults
    # { "trust_badges": [], "review_platforms": [] }
    trust_center = Column(JSON, nullable=True)
    
    # Module 13 & 14: Branding & Performance
    # { "site_logo": "", "site_icon": "", "header_cta": {}, "footer_text": "", "analytics_scripts": "" }
    branding_settings = Column(JSON, nullable=True)

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class SiteAudit(Base):
    __tablename__ = "site_audits"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    overall_score = Column(Integer, default=0)
    seo_score = Column(Integer, default=0)
    ai_score = Column(Integer, default=0)
    perf_score = Column(Integer, default=0)
    accessibility_score = Column(Integer, default=0)
    
    # Detailed findings: [{ "module": "seo", "issue": "Missing Title", "severity": "high", "path": "/" }]
    issues = Column(JSON, nullable=True)
    
    # Summary of stats
    summary = Column(JSON, nullable=True)
