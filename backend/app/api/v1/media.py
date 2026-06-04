import os
import uuid
import shutil
from pathlib import Path
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api.deps import get_db, get_current_user, require_role
from app.models.user import User, UserRole
from app.models.media import MediaLibrary
from app.schemas.blog import MediaOut

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

if not UPLOAD_DIR.exists():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/", response_model=List[MediaOut])
async def list_media(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    result = await db.execute(select(MediaLibrary).order_by(MediaLibrary.created_at.desc()))
    return result.scalars().all()

@router.post("/upload", response_model=MediaOut)
async def upload_media(
    *,
    db: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
    alt_text: str = Form(None),
    caption: str = Form(None),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Save to DB
    media = MediaLibrary(
        file_path=f"/uploads/{unique_filename}",
        file_name=file.filename,
        alt_text=alt_text,
        caption=caption,
        mime_type=file.content_type,
        size_bytes=os.path.getsize(file_path),
        uploaded_by=current_user.id
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)
    
    return media

@router.delete("/{media_id}")
async def delete_media(
    *,
    db: AsyncSession = Depends(get_db),
    media_id: int,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
) -> Any:
    res = await db.execute(select(MediaLibrary).where(MediaLibrary.id == media_id))
    media = res.scalars().first()
    
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Delete file from disk (simple check)
    filename = media.file_path.replace("/uploads/", "")
    local_path = UPLOAD_DIR / filename
    if local_path.exists():
        local_path.unlink()
        
    await db.delete(media)
    await db.commit()
    
    return {"success": True}
