from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserOut)
async def update_user_me(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update current user's profile information.
    """
    obj_data = current_user.__dict__
    update_data = user_in.model_dump(exclude_unset=True)
    
    for field in obj_data:
        if field in update_data:
            setattr(current_user, field, update_data[field])
            
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
