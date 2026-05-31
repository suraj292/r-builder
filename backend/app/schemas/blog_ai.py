from typing import List, Optional
from pydantic import BaseModel

class BlogOutlineRequest(BaseModel):
    title: str
    target_audience: Optional[str] = "Professionals and Job Seekers"
    tone: Optional[str] = "Professional and Helpful"

class TitleOptimizationRequest(BaseModel):
    current_title: str
    focus_keyword: Optional[str] = None

class SEOSuggestionsRequest(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content_preview: str

class AISuggestionOut(BaseModel):
    suggestion: str
    raw_response: Optional[str] = None
