from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class AIPrompt(Base):
    __tablename__ = "ai_prompts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, index=True, nullable=False) # e.g. 'summary_gen'
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    system_prompt = Column(Text, nullable=False)
    user_prompt_template = Column(Text, nullable=False)
    model_override = Column(String(100), nullable=True)
    temperature = Column(Integer, default=7) # Stored as int (7 = 0.7)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
