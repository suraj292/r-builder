from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.db.base import Base

class SEOConfig(Base):
    __tablename__ = "seo_configs"

    id = Column(Integer, primary_key=True, index=True)
    # The relative path/route (e.g., '/', '/about', '/blog/how-to-build-resume')
    path = Column(String(500), unique=True, index=True, nullable=False)
    
    # Meta Tags
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    keywords = Column(String(500), nullable=True)
    canonical_url = Column(String(500), nullable=True)
    
    # Indexing
    is_indexed = Column(Boolean, default=True)
    is_followed = Column(Boolean, default=True)
    
    # Open Graph & Social
    og_title = Column(String(255), nullable=True)
    og_description = Column(Text, nullable=True)
    og_image = Column(String(500), nullable=True)
    twitter_card = Column(String(50), default="summary_large_image")
    
    # Structured Data
    # List of FAQs: [{"question": "...", "answer": "..."}]
    faqs = Column(JSON, nullable=True)
    # Custom JSON-LD Schema
    custom_schema = Column(JSON, nullable=True)
    
    # Sitemap Logic
    include_in_sitemap = Column(Boolean, default=True)
    sitemap_priority = Column(String(10), default="0.5")
    sitemap_changefreq = Column(String(20), default="monthly")
    
    # Metadata
    last_updated_by = Column(Integer, nullable=True) # User ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
