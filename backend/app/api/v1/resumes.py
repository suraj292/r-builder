from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.resume import ResumeCreate, ResumeOut, ResumeUpdate

router = APIRouter()

@router.get("/", response_model=List[ResumeOut])
async def list_resumes(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # TODO: Fetch user's resumes
    return []

@router.post("/", response_model=ResumeOut)
async def create_resume(resume_in: ResumeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # TODO: Create resume
    raise HTTPException(status_code=501, detail="Not implemented yet")
