from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class FAQItem(BaseModel):
    question: str
    answer: str

class SEOConfigBase(BaseModel):
    path: str
    title: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    is_indexed: bool = True
    is_followed: bool = True
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    twitter_card: str = "summary_large_image"
    faqs: Optional[List[FAQItem]] = None
    custom_schema: Optional[Dict[str, Any]] = None
    include_in_sitemap: bool = True
    sitemap_priority: str = "0.5"
    sitemap_changefreq: str = "monthly"

class SEOConfigCreate(SEOConfigBase):
    pass

class SEOConfigUpdate(BaseModel):
    path: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    is_indexed: Optional[bool] = None
    is_followed: Optional[bool] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    twitter_card: Optional[str] = None
    faqs: Optional[List[FAQItem]] = None
    custom_schema: Optional[Dict[str, Any]] = None
    include_in_sitemap: Optional[bool] = None
    sitemap_priority: Optional[str] = None
    sitemap_changefreq: Optional[str] = None

class SEOConfigOut(SEOConfigBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SEOOptimizeRequest(BaseModel):
    path: str
    context: Optional[str] = ""
