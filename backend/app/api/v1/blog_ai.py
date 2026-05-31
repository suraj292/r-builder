from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import require_role
from app.models.user import User, UserRole
from app.schemas.blog_ai import BlogOutlineRequest, TitleOptimizationRequest, SEOSuggestionsRequest, AISuggestionOut
from app.services.blog_ai import BlogAIService

router = APIRouter()

@router.post("/generate-outline", response_model=AISuggestionOut)
async def generate_outline(
    request: BlogOutlineRequest,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
):
    try:
        suggestion = await BlogAIService.generate_outline(
            title=request.title,
            target_audience=request.target_audience,
            tone=request.tone
        )
        return AISuggestionOut(suggestion=suggestion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimize-title", response_model=AISuggestionOut)
async def optimize_title(
    request: TitleOptimizationRequest,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
):
    try:
        suggestion = await BlogAIService.optimize_title(
            current_title=request.current_title,
            focus_keyword=request.focus_keyword
        )
        return AISuggestionOut(suggestion=suggestion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seo-suggestions", response_model=AISuggestionOut)
async def get_seo_suggestions(
    request: SEOSuggestionsRequest,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MANAGER]))
):
    try:
        suggestion = await BlogAIService.get_seo_suggestions(
            title=request.title,
            excerpt=request.excerpt,
            content_preview=request.content_preview
        )
        return AISuggestionOut(suggestion=suggestion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
