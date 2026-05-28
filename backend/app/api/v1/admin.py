from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.schemas.user import UserOut
from app.models.resume import Resume
from app.config import settings

from app.schemas.subscription import PlanCreate, PlanUpdate, PlanOut, CreditAdjustment
from app.models.subscription import Plan

from app.schemas.ai import AIPromptCreate, AIPromptUpdate, AIPromptOut, AIConfigUpdate, AIHealthStatus, AITestRequest, AITestResponse
from app.models.ai import AIPrompt
from app.services.ai_health import AIHealthService
from app.services.ai_service import AIService

from app.schemas.template import TemplateSettingsUpdate, TemplateSettingsOut
from app.models.template import TemplateSettings

router = APIRouter()

# --- AI PROMPT MANAGEMENT ---

@router.get("/prompts", response_model=List[AIPromptOut])
async def list_prompts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    List all AI prompt templates.
    """
    stmt = select(AIPrompt)
    result = await db.execute(stmt)
    prompts = result.scalars().all()
    
    if not prompts:
        # Seed initial prompts if table is empty
        initial = [
            AIPrompt(
                slug="summary_gen", 
                name="Summary Generation", 
                system_prompt="You are a professional resume writer.", 
                user_prompt_template="Write a summary for: {data}",
                description="Used for generating resume summaries."
            ),
            AIPrompt(
                slug="exp_opt", 
                name="Experience Optimization", 
                system_prompt="You are an ATS expert.", 
                user_prompt_template="Optimize this job description: {data}",
                description="Used for optimizing experience bullets."
            ),
            AIPrompt(
                slug="ats_calc", 
                name="ATS Score Calculation", 
                system_prompt="You are a recruiter.", 
                user_prompt_template="Score this resume: {data}",
                description="Used for calculating ATS scores."
            )
        ]
        for p in initial:
            db.add(p)
        await db.commit()
        return initial
        
    return prompts

@router.patch("/prompts/{prompt_id}", response_model=AIPromptOut)
async def update_prompt(
    prompt_id: int,
    prompt_in: AIPromptUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """
    Update an AI prompt template. Super Admin only.
    """
    stmt = select(AIPrompt).where(AIPrompt.id == prompt_id)
    result = await db.execute(stmt)
    prompt = result.scalars().first()
    if not prompt:
        raise HTTPException(404, "Prompt not found")
        
    update_data = prompt_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(prompt, field, value)
        
    await db.commit()
    await db.refresh(prompt)
    return prompt

# --- PLAN MANAGEMENT ---

@router.get("/plans", response_model=List[PlanOut])
async def list_plans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    List all subscription plans.
    """
    stmt = select(Plan)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/plans", response_model=PlanOut)
async def create_plan(
    plan_in: PlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """
    Create a new subscription plan.
    """
    db_plan = Plan(**plan_in.model_dump())
    db.add(db_plan)
    await db.commit()
    await db.refresh(db_plan)
    return db_plan

@router.patch("/plans/{plan_id}", response_model=PlanOut)
async def update_plan(
    plan_id: int,
    plan_in: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """
    Update an existing subscription plan.
    """
    stmt = select(Plan).where(Plan.id == plan_id)
    result = await db.execute(stmt)
    plan = result.scalars().first()
    if not plan:
        raise HTTPException(404, "Plan not found")
    
    update_data = plan_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(plan, field, value)
    
    await db.commit()
    await db.refresh(plan)
    return plan

# --- USER USAGE & QUOTA MANAGEMENT ---

@router.post("/users/{user_id}/adjust-credits", response_model=UserOut)
async def adjust_user_credits(
    user_id: int,
    adjustment: CreditAdjustment,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Manually add or remove AI credits for a specific user.
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        raise HTTPException(404, "User not found")
    
    # Negative adjustment means adding credits (reducing credits_used)
    user.ai_credits_used = max(0, user.ai_credits_used - adjustment.amount)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/users/{user_id}/reset-quotas", response_model=UserOut)
async def reset_user_quotas(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Reset a user's AI and ATS usage quotas to zero.
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        raise HTTPException(404, "User not found")
    
    user.ai_credits_used = 0
    user.ats_scans_used = 0
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/users/{user_id}/toggle-status", response_model=UserOut)
async def toggle_user_status(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Toggle a user's active status (ban/unban).
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        raise HTTPException(404, "User not found")
    
    user.is_active = not user.is_active
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/test-ai", response_model=AITestResponse)
async def test_ai_endpoint(
    test_in: AITestRequest,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Execute a live AI prompt for testing purposes.
    """
    try:
        return await AIService.generate_response(
            provider=test_in.provider,
            model=test_in.model,
            prompt=test_in.prompt,
            system_prompt=test_in.system_prompt
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/ai-health", response_model=AIHealthStatus)
async def get_ai_health(
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Check the health of configured AI providers.
    """
    openai_health = await AIHealthService.check_openai_health()
    gemini_health = await AIHealthService.check_gemini_health()
    
    return {
        "openai": openai_health,
        "gemini": gemini_health
    }

@router.post("/ai-config")
async def update_ai_config(
    config_in: AIConfigUpdate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """
    Update current AI configuration. Changes are in-memory until server restart.
    """
    if config_in.ai_provider:
        settings.AI_PROVIDER = config_in.ai_provider
    if config_in.openai_model:
        settings.OPENAI_MODEL = config_in.openai_model
    if config_in.gemini_model:
        settings.GEMINI_MODEL = config_in.gemini_model
        
    return {
        "message": "AI Configuration updated successfully for this session.",
        "config": {
            "ai_provider": settings.AI_PROVIDER,
            "openai_model": settings.OPENAI_MODEL,
            "gemini_model": settings.GEMINI_MODEL
        }
    }

@router.get("/ai-config")
async def get_ai_config(
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get current AI configuration.
    """
    return {
        "ai_provider": settings.AI_PROVIDER,
        "openai_model": settings.OPENAI_MODEL,
        "gemini_model": settings.GEMINI_MODEL,
        "openai_key_configured": bool(settings.OPENAI_API_KEY),
        "gemini_key_configured": bool(settings.GEMINI_API_KEY)
    }

@router.get("/settings")
async def get_system_settings(
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get global system settings.
    """
    return {
        "project_name": settings.PROJECT_NAME,
        "maintenance_mode": False,
        "allow_new_registrations": True,
        "contact_email": "support@resumeai.com"
    }

@router.get("/users", response_model=List[UserOut])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get all registered users. Admin only.
    """
    stmt = select(User)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/users/{user_id}", response_model=UserOut)
async def get_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get a specific user's details. Admin only.
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        raise HTTPException(404, "User not found")
    return user

@router.get("/resumes")
async def get_all_resumes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT]))
):
    """
    Get all resumes with user information.
    """
    stmt = select(Resume).join(User)
    result = await db.execute(stmt)
    resumes = result.scalars().all()
    
    return [
        {
            "id": r.id,
            "title": r.title,
            "user_email": r.user.email,
            "template_id": r.template_id,
            "created_at": r.created_at,
            "updated_at": r.updated_at
        }
        for r in resumes
    ]

@router.get("/stats")
async def get_system_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT]))
):
    """
    Get high-level system statistics.
    """
    # Count total users
    user_count_stmt = select(func.count(User.id))
    user_result = await db.execute(user_count_stmt)
    total_users = user_result.scalar() or 0
    
    # Count total resumes
    resume_count_stmt = select(func.count(Resume.id))
    resume_result = await db.execute(resume_count_stmt)
    total_resumes = resume_result.scalar() or 0
    
    # Count premium users
    premium_count_stmt = select(func.count(User.id)).where(User.is_premium == True)
    premium_result = await db.execute(premium_count_stmt)
    total_premium = premium_result.scalar() or 0
    
    return {
        "total_users": total_users,
        "active_subscriptions": total_premium,
        "resumes_created": total_resumes,
        "ai_usage_today": 0
    }

@router.patch("/users/{user_id}/role", response_model=UserOut)
async def update_user_role(
    user_id: int,
    new_role: UserRole,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """
    Update a user's role. Super Admin only.
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = new_role
    await db.commit()
    await db.refresh(user)
    return user

# --- TEMPLATE MANAGEMENT ---

@router.get("/templates/settings")
async def get_template_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get all template settings overrides.
    """
    stmt = select(TemplateSettings)
    result = await db.execute(stmt)
    settings_list = result.scalars().all()
    
    # Return as a dictionary mapping template_id to its settings for easy frontend consumption
    return {s.template_id: {"isActive": s.is_active, "requiredTier": s.required_tier} for s in settings_list}

@router.patch("/templates/{template_id}/settings")
async def update_template_settings(
    template_id: str,
    settings_in: TemplateSettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Update or create settings for a specific template.
    """
    stmt = select(TemplateSettings).where(TemplateSettings.template_id == template_id)
    result = await db.execute(stmt)
    db_setting = result.scalars().first()
    
    if not db_setting:
        db_setting = TemplateSettings(template_id=template_id)
        db.add(db_setting)
        
    if settings_in.is_active is not None:
        db_setting.is_active = settings_in.is_active
    if settings_in.required_tier is not None:
        db_setting.required_tier = settings_in.required_tier
        
    await db.commit()
    await db.refresh(db_setting)
    
    return {"isActive": db_setting.is_active, "requiredTier": db_setting.required_tier}
