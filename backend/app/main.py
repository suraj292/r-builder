from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, users, resumes, payments, ai
from app.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="ResumeAI Backend API",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(resumes.router, prefix="/api/v1/resumes", tags=["resumes"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
