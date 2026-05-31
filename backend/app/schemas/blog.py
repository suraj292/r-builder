from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.blog import PostStatus

# Media Schemas
class MediaBase(BaseModel):
    file_name: str
    alt_text: Optional[str] = None
    caption: Optional[str] = None

class MediaCreate(MediaBase):
    file_path: str
    mime_type: str
    size_bytes: int

class MediaOut(MediaBase):
    id: int
    file_path: str
    mime_type: str
    size_bytes: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Tag Schemas
class TagBase(BaseModel):
    name: str
    slug: str

class TagCreate(TagBase):
    pass

class TagOut(TagBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Blog Post Schemas
class BlogPostBase(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content_blocks: List[Dict[str, Any]] = Field(default_factory=list)
    status: PostStatus = PostStatus.DRAFT
    category_id: Optional[int] = None
    featured_image: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    focus_keyword: Optional[str] = None
    is_featured: bool = False
    is_sticky: bool = False

class BlogPostCreate(BlogPostBase):
    tag_ids: Optional[List[int]] = None
    published_at: Optional[datetime] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content_blocks: Optional[List[Dict[str, Any]]] = None
    status: Optional[PostStatus] = None
    category_id: Optional[int] = None
    featured_image: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    focus_keyword: Optional[str] = None
    is_featured: Optional[bool] = None
    is_sticky: Optional[bool] = None
    tag_ids: Optional[List[int]] = None
    published_at: Optional[datetime] = None

class BlogPostOut(BlogPostBase):
    id: int
    author_id: Optional[int] = None
    views_count: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[CategoryOut] = None
    tags: List[TagOut] = []

    class Config:
        from_attributes = True
