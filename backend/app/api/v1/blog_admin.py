from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete
from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.models.blog import BlogPost, BlogCategory, BlogTag, post_tags
from app.schemas.blog import BlogPostCreate, BlogPostUpdate, BlogPostOut, CategoryCreate, CategoryOut, TagCreate, TagOut

router = APIRouter()

# -----------------
# CATEGORY ENDPOINTS
# -----------------

@router.get("/categories", response_model=List[CategoryOut])
async def list_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    result = await db.execute(select(BlogCategory).order_by(BlogCategory.name))
    return result.scalars().all()

@router.post("/categories", response_model=CategoryOut)
async def create_category(
    *,
    db: AsyncSession = Depends(get_db),
    cat_in: CategoryCreate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    # Check if slug exists
    res = await db.execute(select(BlogCategory).where(BlogCategory.slug == cat_in.slug))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Category with this slug already exists.")
    
    cat = BlogCategory(**cat_in.model_dump())
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat

# -----------------
# TAG ENDPOINTS
# -----------------

@router.get("/tags", response_model=List[TagOut])
async def list_tags(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    result = await db.execute(select(BlogTag).order_by(BlogTag.name))
    return result.scalars().all()

@router.post("/tags", response_model=TagOut)
async def create_tag(
    *,
    db: AsyncSession = Depends(get_db),
    tag_in: TagCreate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    res = await db.execute(select(BlogTag).where(BlogTag.slug == tag_in.slug))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Tag with this slug already exists.")
    
    tag = BlogTag(**tag_in.model_dump())
    db.add(tag)
    await db.commit()
    await db.refresh(tag)
    return tag

# -----------------
# POST ENDPOINTS
# -----------------

@router.get("/posts", response_model=List[BlogPostOut])
async def list_posts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    stmt = select(BlogPost).options(
        selectinload(BlogPost.category),
        selectinload(BlogPost.tags)
    ).order_by(BlogPost.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/posts", response_model=BlogPostOut)
async def create_post(
    *,
    db: AsyncSession = Depends(get_db),
    post_in: BlogPostCreate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    res = await db.execute(select(BlogPost).where(BlogPost.slug == post_in.slug))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Post with this slug already exists.")

    data = post_in.model_dump(exclude={"tag_ids"})
    data["author_id"] = current_user.id
    
    post = BlogPost(**data)
    
    # Handle tags
    if post_in.tag_ids:
        tag_res = await db.execute(select(BlogTag).where(BlogTag.id.in_(post_in.tag_ids)))
        post.tags = tag_res.scalars().all()

    db.add(post)
    await db.commit()
    
    # Refetch to load relationships
    stmt = select(BlogPost).options(
        selectinload(BlogPost.category),
        selectinload(BlogPost.tags)
    ).where(BlogPost.id == post.id)
    res = await db.execute(stmt)
    return res.scalars().first()

@router.put("/posts/{post_id}", response_model=BlogPostOut)
async def update_post(
    *,
    db: AsyncSession = Depends(get_db),
    post_id: int,
    post_in: BlogPostUpdate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    stmt = select(BlogPost).options(
        selectinload(BlogPost.tags)
    ).where(BlogPost.id == post_id)
    res = await db.execute(stmt)
    post = res.scalars().first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    update_data = post_in.model_dump(exclude_unset=True, exclude={"tag_ids"})
    for field, value in update_data.items():
        setattr(post, field, value)
        
    if post_in.tag_ids is not None:
        tag_res = await db.execute(select(BlogTag).where(BlogTag.id.in_(post_in.tag_ids)))
        post.tags = tag_res.scalars().all()
        
    await db.commit()
    
    # Refetch
    stmt = select(BlogPost).options(
        selectinload(BlogPost.category),
        selectinload(BlogPost.tags)
    ).where(BlogPost.id == post_id)
    res = await db.execute(stmt)
    return res.scalars().first()

@router.delete("/posts/{post_id}")
async def delete_post(
    *,
    db: AsyncSession = Depends(get_db),
    post_id: int,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    res = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    post = res.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    await db.delete(post)
    await db.commit()
    return {"success": True}
