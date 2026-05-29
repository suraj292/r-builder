from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.schemas.user import UserOut
from app.models.resume import Resume
from app.config import settings

from app.schemas.subscription import PlanCreate, PlanUpdate, PlanOut, CreditAdjustment
from app.models.subscription import Plan, Subscription

from app.schemas.ai import AIPromptCreate, AIPromptUpdate, AIPromptOut, AIConfigUpdate, AIHealthStatus, AITestRequest, AITestResponse
from app.models.ai import AIPrompt
from app.services.ai_health import AIHealthService
from app.services.ai_service import AIService

from app.schemas.template import TemplateSettingsUpdate, TemplateSettingsOut
from app.models.template import TemplateSettings

from app.schemas.activity import ActivityLogOut
from app.models.activity import UserActivityLog
from app.models.payment import Transaction, PaymentStatus

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

@router.get("/transactions")
async def get_all_transactions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Fetch all payment transactions.
    """
    stmt = select(Transaction).options(
        selectinload(Transaction.user),
        selectinload(Transaction.plan)
    ).order_by(Transaction.created_at.desc())
    result = await db.execute(stmt)
    transactions = result.scalars().all()
    
    return [
        {
            "id": t.id,
            "user_email": t.user.email if t.user else "Deleted User",
            "plan_name": t.plan.name if t.plan else "Unknown Plan",
            "amount": t.amount,
            "currency": t.currency,
            "status": t.status,
            "order_id": t.razorpay_order_id,
            "payment_id": t.razorpay_payment_id,
            "country": t.country,
            "device": t.device,
            "created_at": t.created_at
        }
        for t in transactions
    ]

@router.get("/subscriptions")
async def get_all_active_subscriptions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Fetch all user subscriptions.
    """
    stmt = select(Subscription).options(
        selectinload(Subscription.user),
        selectinload(Subscription.plan)
    ).order_by(Subscription.current_period_end.desc())
    result = await db.execute(stmt)
    subs = result.scalars().all()
    
    return [
        {
            "id": s.id,
            "user_id": s.user_id,
            "user_email": s.user.email if s.user else "Deleted User",
            "plan_name": s.plan.name if s.plan else "Unknown Plan",
            "status": s.status,
            "start_date": s.current_period_start,
            "end_date": s.current_period_end,
            "is_expired": s.current_period_end < datetime.now(s.current_period_end.tzinfo) if s.current_period_end else False
        }
        for s in subs
    ]

@router.get("/users/{user_id}/subscription-detail")
async def get_user_subscription_detail(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get detailed subscription info for a specific USER.
    """
    stmt = select(Subscription).options(
        selectinload(Subscription.user),
        selectinload(Subscription.plan)
    ).where(Subscription.user_id == user_id)
    result = await db.execute(stmt)
    sub = result.scalars().first()
    
    if not sub:
        # If no subscription found, still return user info so admin can create one or see they are free
        u_stmt = select(User).where(User.id == user_id)
        u_res = await db.execute(u_stmt)
        user = u_res.scalars().first()
        if not user: raise HTTPException(404, "User not found")
        return { "user": user, "subscription": None, "plan": None, "transactions": [] }
        
    # Fetch recent transactions for this user
    t_stmt = select(Transaction).options(selectinload(Transaction.plan)).where(Transaction.user_id == user_id).order_by(Transaction.created_at.desc()).limit(10)
    t_result = await db.execute(t_stmt)
    transactions = t_result.scalars().all()
    
    return {
        "subscription": {
            "id": sub.id,
            "status": sub.status,
            "start_date": sub.current_period_start,
            "end_date": sub.current_period_end,
            "is_expired": sub.current_period_end < datetime.now(sub.current_period_end.tzinfo) if sub.current_period_end else False,
            "cancel_at_period_end": sub.cancel_at_period_end,
            "razorpay_id": sub.razorpay_subscription_id
        },
        "user": sub.user,
        "plan": sub.plan,
        "transactions": [
            {
                "id": t.id,
                "amount": t.amount,
                "currency": t.currency,
                "status": t.status,
                "order_id": t.razorpay_order_id,
                "created_at": t.created_at,
                "plan_name": t.plan.name if t.plan else "Unknown"
            }
            for t in transactions
        ]
    }

@router.get("/subscriptions/{subscription_id}")
async def get_subscription_detail(
    subscription_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Get detailed subscription info including user and payment history.
    """
    stmt = select(Subscription).options(
        selectinload(Subscription.user),
        selectinload(Subscription.plan)
    ).where(Subscription.id == subscription_id)
    result = await db.execute(stmt)
    sub = result.scalars().first()
    
    if not sub:
        raise HTTPException(404, "Subscription not found")
        
    # Fetch recent transactions for this user
    t_stmt = select(Transaction).options(selectinload(Transaction.plan)).where(Transaction.user_id == sub.user_id).order_by(Transaction.created_at.desc()).limit(10)
    t_result = await db.execute(t_stmt)
    transactions = t_result.scalars().all()
    
    return {
        "subscription": {
            "id": sub.id,
            "status": sub.status,
            "start_date": sub.current_period_start,
            "end_date": sub.current_period_end,
            "is_expired": sub.current_period_end < datetime.now(sub.current_period_end.tzinfo) if sub.current_period_end else False,
            "cancel_at_period_end": sub.cancel_at_period_end,
            "razorpay_id": sub.razorpay_subscription_id
        },
        "user": sub.user, # UserOut should handle this
        "plan": sub.plan,
        "transactions": [
            {
                "id": t.id,
                "amount": t.amount,
                "currency": t.currency,
                "status": t.status,
                "order_id": t.razorpay_order_id,
                "created_at": t.created_at,
                "plan_name": t.plan.name if t.plan else "Unknown"
            }
            for t in transactions
        ]
    }

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

    # Calculate total revenue from completed transactions
    revenue_stmt = select(func.sum(Transaction.amount)).where(Transaction.status == PaymentStatus.COMPLETED)
    revenue_result = await db.execute(revenue_stmt)
    total_revenue = (revenue_result.scalar() or 0) / 100 # Convert to currency units
    
    return {
        "total_users": total_users,
        "active_subscriptions": total_premium,
        "resumes_created": total_resumes,
        "ai_usage_today": 0,
        "total_revenue": total_revenue
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

# --- ADVANCED SUBSCRIPTION & USER MANAGEMENT ---

@router.patch("/subscriptions/{subscription_id}/validity")
async def update_subscription_validity(
    subscription_id: int,
    payload: dict, # Expects {"end_date": "YYYY-MM-DD"}
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Manually update a user's subscription end date.
    """
    stmt = select(Subscription).where(Subscription.id == subscription_id)
    result = await db.execute(stmt)
    sub = result.scalars().first()
    
    if not sub:
        raise HTTPException(404, "Subscription not found")
        
    try:
        new_date = datetime.strptime(payload["end_date"], "%Y-%m-%d")
        sub.current_period_end = new_date
    except Exception:
        raise HTTPException(400, "Invalid date format. Use YYYY-MM-DD")
        
    await log_activity(db, sub.user_id, "admin_subscription_override", f"Admin {current_user.email} updated validity to {payload['end_date']}")
    await db.commit()
    return {"message": "Subscription updated"}

@router.post("/users/send-email")
async def send_admin_user_email(
    payload: dict, # Expects {"email": str, "subject": str, "message": str}
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT]))
):
    """
    Send a direct email from Admin to a user.
    """
    email = payload.get("email")
    subject = payload.get("subject")
    message = payload.get("message")
    
    if not all([email, subject, message]):
        raise HTTPException(400, "Missing email, subject, or message")
        
    EmailService.send_admin_email(email, subject, message)
    
    # Log the action
    # Find user ID for logging
    stmt = select(User.id).where(User.email == email)
    res = await db.execute(stmt)
    uid = res.scalar()
    if uid:
        await log_activity(db, uid, "admin_email_sent", f"Subject: {subject}")
        await db.commit()
        
    return {"message": "Email sent successfully"}

@router.get("/transactions/{transaction_id}/invoice")
async def get_transaction_invoice_html(
    transaction_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    """
    Generate a simple HTML invoice for a transaction.
    """
    stmt = select(Transaction).options(selectinload(Transaction.user), selectinload(Transaction.plan)).where(Transaction.id == transaction_id)
    result = await db.execute(stmt)
    t = result.scalars().first()
    
    if not t:
        raise HTTPException(404, "Transaction not found")
        
    # Return basic HTML that can be printed as PDF by the browser
    invoice_html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: sans-serif; padding: 40px; color: #1e293b; }}
            .header {{ display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }}
            .details {{ margin-top: 40px; }}
            .table {{ width: 100%; margin-top: 40px; border-collapse: collapse; }}
            .table th, .table td {{ padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }}
            .footer {{ margin-top: 60px; font-size: 12px; color: #64748b; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="header">
            <div><h1>INVOICE</h1><p>#INV-{t.razorpay_order_id[-8:]}</p></div>
            <div style="text-align: right;"><strong>ResumeAI</strong><br/>contact@resumeai.com</div>
        </div>
        <div class="details">
            <p><strong>Billed To:</strong><br/>{t.user.email}<br/>{t.country or ""}</p>
            <p><strong>Date:</strong> {t.created_at.strftime("%B %d, %Y")}</p>
        </div>
        <table class="table">
            <thead><tr><th>Description</th><th>Period</th><th>Amount</th></tr></thead>
            <tbody>
                <tr>
                    <td>{t.plan.name} Subscription</td>
                    <td>{t.created_at.strftime("%m/%Y")}</td>
                    <td>{t.currency} {(t.amount / 100):.2f}</td>
                </tr>
            </tbody>
        </table>
        <div style="text-align: right; margin-top: 20px;">
            <h3>Total: {t.currency} {(t.amount / 100):.2f}</h3>
        </div>
        <div class="footer">
            <p>Thank you for choosing ResumeAI.</p>
        </div>
    </body>
    </html>
    """
    from fastapi.responses import HTMLResponse
    return HTMLResponse(content=invoice_html)
