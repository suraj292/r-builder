from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
from redis import asyncio as aioredis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from pathlib import Path

from app.api.v1 import auth, users, resumes, payments, ai_workflow, admin, subscriptions, location, templates, blog_admin, media, blog_ai, seo_admin, seo_public, system_admin, system_public, visibility_admin, visibility_public
from app.config import settings
from app.core.limiter import limiter

# Define absolute path for uploads
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

if not UPLOAD_DIR.exists():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Redis Cache
    redis = aioredis.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="ResumeAI Backend API",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Middleware
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(location.router, prefix="/api/v1/location", tags=["location"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(resumes.router, prefix="/api/v1/resumes", tags=["resumes"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["subscriptions"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(ai_workflow.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(templates.router, prefix="/api/v1/templates", tags=["templates"])
app.include_router(blog_admin.router, prefix="/api/v1/admin/blog", tags=["blog_admin"])
app.include_router(blog_ai.router, prefix="/api/v1/admin/blog/ai", tags=["blog_ai"])
app.include_router(media.router, prefix="/api/v1/admin/media", tags=["media"])
app.include_router(seo_admin.router, prefix="/api/v1/admin/seo", tags=["seo_admin"])
app.include_router(seo_public.router, prefix="/api/v1/seo", tags=["seo_public"])
app.include_router(system_admin.router, prefix="/api/v1/admin/system", tags=["system_admin"])
app.include_router(system_public.router, prefix="/api/v1/system", tags=["system_public"])
app.include_router(visibility_admin.router, prefix="/api/v1/admin/visibility", tags=["visibility_admin"])
app.include_router(visibility_public.router, prefix="/api/v1/visibility", tags=["visibility_public"])

# Static Files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
