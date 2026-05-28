from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AIPromptBase(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None
    system_prompt: str
    user_prompt_template: str
    model_override: Optional[str] = None
    temperature: int = 7
    is_active: bool = True

class AIPromptCreate(AIPromptBase):
    pass

class AIPromptUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    user_prompt_template: Optional[str] = None
    model_override: Optional[str] = None
    temperature: Optional[int] = None
    is_active: Optional[bool] = None

class AIPromptOut(AIPromptBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ATSCheckRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None


class ATSCheckResponse(BaseModel):
    score: int
    feedback: str
    missing_keywords: list[str] = []


class AIConfigUpdate(BaseModel):
    ai_provider: Optional[str] = None
    openai_model: Optional[str] = None
    gemini_model: Optional[str] = None


class AIHealthStatus(BaseModel):
    openai: dict
    gemini: dict


class AITestRequest(BaseModel):
    provider: str
    model: str
    prompt: str
    system_prompt: Optional[str] = "You are a helpful assistant."


class AITestResponse(BaseModel):
    response: str
    latency: float
