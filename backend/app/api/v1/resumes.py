from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeOut, ResumeUpdate

router = APIRouter()

@router.get("", response_model=List[ResumeOut])
async def list_resumes(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Fetch all resumes for the current authenticated user.
    """
    stmt = select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.updated_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("", response_model=ResumeOut)
async def create_resume(resume_in: ResumeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new resume for the current user.
    """
    db_resume = Resume(
        **resume_in.model_dump(),
        user_id=current_user.id
    )
    db.add(db_resume)
    await db.commit()
    await db.refresh(db_resume)
    return db_resume

@router.patch("/{resume_id}", response_model=ResumeOut)
async def update_resume(
    resume_id: int, 
    resume_in: ResumeUpdate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing resume.
    """
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    result = await db.execute(stmt)
    db_resume = result.scalars().first()
    
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    update_data = resume_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_resume, field, value)
    
    await db.commit()
    await db.refresh(db_resume)
    return db_resume

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Delete a resume belonging to the current user.
    """
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    result = await db.execute(stmt)
    db_resume = result.scalars().first()
    
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    await db.delete(db_resume)
    await db.commit()
    return {"message": "Resume deleted"}

