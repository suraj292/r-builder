from pydantic import BaseModel

class ATSCheckRequest(BaseModel):
    resume_text: str
    job_description: str

class ATSCheckResponse(BaseModel):
    score: int
    feedback: str
    missing_keywords: list[str]

class SummaryRequest(BaseModel):
    experience_text: str

class SummaryResponse(BaseModel):
    summary: str
