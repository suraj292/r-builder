from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.security import OAuth2PasswordRequestForm
from app.api.deps import get_db
from app.schemas.auth import UserCreate, Token, UserLogin, ForgotPasswordRequest, ResetPasswordRequest, ResendVerificationRequest
from app.schemas.user import UserOut
from app.models.user import User, RegistrationSource
from app.core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    create_password_reset_token, 
    verify_password_reset_token,
    create_email_verification_token,
    verify_email_verification_token
)
from app.services.email_service import EmailService
from app.config import settings
from authlib.integrations.starlette_client import OAuth

router = APIRouter()

# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='github',
    client_id=settings.GITHUB_CLIENT_ID,
    client_secret=settings.GITHUB_CLIENT_SECRET,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

oauth.register(
    name='linkedin',
    client_id=settings.LINKEDIN_CLIENT_ID,
    client_secret=settings.LINKEDIN_CLIENT_SECRET,
    access_token_url='https://www.linkedin.com/oauth/v2/accessToken',
    authorize_url='https://www.linkedin.com/oauth/v2/authorization',
    api_base_url='https://api.linkedin.com/v2/',
    client_kwargs={'scope': 'openid profile email'},
)

@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    stmt = select(User).where(User.email == user_in.email)
    result = await db.execute(stmt)
    if result.scalars().first():
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )
    
    # Generate verification token
    verification_token = create_email_verification_token(user_in.email)
    verification_expiry = datetime.now(timezone.utc) + timedelta(hours=24)
    
    # Create user
    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        registration_source=RegistrationSource.EMAIL,
        is_active=True,
        is_email_verified=False,
        email_verification_token=verification_token,
        email_verification_expires=verification_expiry
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    # Send verification email
    await EmailService.send_verification_email(db_user.email, db_user.full_name or "", verification_token)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Find user
    stmt = select(User).where(User.email == form_data.username)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # Check email verification
    if user.registration_source == RegistrationSource.EMAIL and not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "EMAIL_NOT_VERIFIED",
                "message": "Please verify your email address before logging in.",
                "email": user.email
            }
        )
    
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    await db.commit()
    
    return {
        "access_token": create_access_token(user.email),
        "token_type": "bearer",
    }

# SOCIAL LOGIN ENDPOINTS

@router.get("/{provider}/login")
async def social_login(provider: str, request: Request):
    if provider not in ['google', 'github', 'linkedin']:
        raise HTTPException(status_code=400, detail="Invalid provider")
    
    redirect_uri = ""
    if provider == 'google': redirect_uri = settings.GOOGLE_REDIRECT_URI
    elif provider == 'github': redirect_uri = settings.GITHUB_REDIRECT_URI
    elif provider == 'linkedin': redirect_uri = settings.LINKEDIN_REDIRECT_URI
    
    if not redirect_uri:
        # Fallback to default if not configured in settings
        redirect_uri = f"http://localhost:8000/api/v1/auth/{provider}/callback"
        
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)

@router.get("/{provider}/callback")
async def social_callback(provider: str, request: Request, db: AsyncSession = Depends(get_db)):
    if provider not in ['google', 'github', 'linkedin']:
        raise HTTPException(status_code=400, detail="Invalid provider")
    
    client = oauth.create_client(provider)
    try:
        token = await client.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to authorize: {str(e)}")
    
    user_info = None
    if provider == 'google':
        user_info = token.get('userinfo')
    elif provider == 'github':
        resp = await client.get('user', token=token)
        user_info = resp.json()
        if not user_info.get('email'):
            email_resp = await client.get('user/emails', token=token)
            emails = email_resp.json()
            user_info['email'] = next((e['email'] for e in emails if e['primary']), emails[0]['email'])
    elif provider == 'linkedin':
        user_info = token.get('userinfo')
        
    if not user_info or not user_info.get('email'):
        raise HTTPException(status_code=400, detail="Failed to retrieve user info from provider")
    
    email = user_info.get('email')
    name = user_info.get('name') or user_info.get('full_name') or user_info.get('login')
    
    # Find or create user
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        user = User(
            email=email,
            full_name=name,
            registration_source=RegistrationSource(provider),
            is_active=True,
            is_email_verified=True,
            email_verified_at=datetime.now(timezone.utc)
        )
        db.add(user)
        EmailService.send_welcome_email(user.email, user.full_name or "")
    
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(user)
    
    access_token = create_access_token(user.email)
    
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback?token={access_token}")


@router.post("/forgot-password")
async def forgot_password(
    request_data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)
):
    # Find user
    stmt = select(User).where(User.email == request_data.email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address."
        )
    
    # Generate password reset token
    reset_token = create_password_reset_token(user.email)
    
    # Construct reset link pointing to the React frontend route
    reset_link = f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"
    
    # Send email
    EmailService.send_password_reset_email(user.email, reset_link)
    
    return {"message": "Password reset link has been sent to your email."}


@router.post("/reset-password")
async def reset_password(
    request_data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)
):
    # Verify the reset token
    email = verify_password_reset_token(request_data.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )
    
    # Fetch user
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    
    # Hash and update password
    user.hashed_password = get_password_hash(request_data.new_password)
    user.last_password_reset = datetime.now(timezone.utc)
    
    await db.commit()
    
    return {"message": "Your password has been reset successfully."}


@router.get("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    try:
        # Verify token
        email = verify_email_verification_token(token)
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification token."
            )
        
        # Find user
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalars().first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.is_email_verified:
            return {"message": "Email already verified"}
        
        # Verify token matching
        if user.email_verification_token != token:
            raise HTTPException(status_code=400, detail="Invalid token")
            
        # Check expiry
        now = datetime.now(timezone.utc)
        expires = user.email_verification_expires
        if expires:
            if expires.tzinfo is None:
                expires = expires.replace(tzinfo=timezone.utc)
            if expires < now:
                raise HTTPException(status_code=400, detail="Verification token has expired")

        # Capture data before commit to avoid DetachedInstanceError
        user_email = user.email
        user_full_name = user.full_name or ""

        # Update user
        user.is_email_verified = True
        user.email_verified_at = now
        user.email_verification_token = None
        user.email_verification_expires = None
        
        await db.commit()
        
        # Send welcome email now
        EmailService.send_welcome_email(user_email, user_full_name)
        
        return {"message": "Email verified successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL ERROR in verify_email: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/resend-verification")
async def resend_verification(request_data: ResendVerificationRequest, db: AsyncSession = Depends(get_db)):
    # Find user
    stmt = select(User).where(User.email == request_data.email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        # For security, don't reveal if user exists or not
        return {"message": "If an account exists with this email, a new verification link has been sent."}
    
    if user.registration_source != RegistrationSource.EMAIL:
        raise HTTPException(status_code=400, detail="Social login users do not require email verification")
        
    if user.is_email_verified:
        return {"message": "Email is already verified"}
        
    # Capture data before commit
    user_email = user.email
    user_full_name = user.full_name or ""
        
    # Generate new token
    verification_token = create_email_verification_token(user_email)
    user.email_verification_token = verification_token
    user.email_verification_expires = datetime.now(timezone.utc) + timedelta(hours=24)
    
    await db.commit()
    
    # Send email
    await EmailService.send_verification_email(user_email, user_full_name, verification_token)
    
    return {"message": "Verification email has been resent"}

