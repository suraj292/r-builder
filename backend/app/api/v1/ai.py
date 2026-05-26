from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ai import ATSCheckRequest, ATSCheckResponse

router = APIRouter()

@router.post("/ats-check", response_model=ATSCheckResponse)
async def check_ats_score(req: ATSCheckRequest, current_user: User = Depends(get_current_user)):
    # TODO: Call OpenAI wrapper
    return ATSCheckResponse(score=85, feedback="Good resume", missing_keywords=["Python"])
