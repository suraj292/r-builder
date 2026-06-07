import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, Table, Text, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class PostStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    SCHEDULED = "scheduled"
    ARCHIVED = "archived"

# Association table for Blog Posts and Tags
post_tags = Table(
    'blog_post_tags', Base.metadata,
    Column('post_id', Integer, ForeignKey('blog_posts.id', ondelete="CASCADE"), primary_key=True),
    Column('tag_id', Integer, ForeignKey('blog_tags.id', ondelete="CASCADE"), primary_key=True)
)

class BlogCategory(Base):
    __tablename__ = "blog_categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey('blog_categories.id', ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parent = relationship("BlogCategory", remote_side=[id], backref="children")
    posts = relationship("BlogPost", back_populates="category")


class BlogTag(Base):
    __tablename__ = "blog_tags"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    posts = relationship("BlogPost", secondary=post_tags, back_populates="tags")


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    excerpt = Column(Text, nullable=True)
    
    # Store the blocks for the drag-and-drop editor
    content_blocks = Column(JSON, nullable=False)
    
    status = Column(Enum(PostStatus), default=PostStatus.DRAFT, nullable=False)
    
    author_id = Column(Integer, ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    category_id = Column(Integer, ForeignKey('blog_categories.id', ondelete="SET NULL"), nullable=True)
    
    # Can be a URL or ID linking to media library
    featured_image = Column(String(500), nullable=True)
    
    # SEO Metadata
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    seo_keywords = Column(String(500), nullable=True)
    canonical_url = Column(String(500), nullable=True)
    focus_keyword = Column(String(255), nullable=True)
    
    is_featured = Column(Boolean, default=False)
    is_sticky = Column(Boolean, default=False)
    
    views_count = Column(Integer, default=0)
    
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author = relationship("User")
    category = relationship("BlogCategory", back_populates="posts")
    tags = relationship("BlogTag", secondary=post_tags, back_populates="posts")
    revisions = relationship("BlogPostRevision", back_populates="post", cascade="all, delete-orphan")


class BlogPostRevision(Base):
    __tablename__ = "blog_post_revisions"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey('blog_posts.id', ondelete="CASCADE"), nullable=False)
    content_blocks = Column(JSON, nullable=False)
    author_id = Column(Integer, ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    post = relationship("BlogPost", back_populates="revisions")
    author = relationship("User")
