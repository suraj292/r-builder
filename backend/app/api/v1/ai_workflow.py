from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, Any
import io
import pypdf

from app.api.deps import get_current_user
from app.models.user import User
from app.services.ai_workflow import ResumeAIWorkflowService

router = APIRouter()

class AnalyzeRequest(BaseModel):
    resume_data: dict
    job_description: Optional[str] = ""
    target_profession: Optional[str] = ""

class OptimizeRequest(BaseModel):
    resume_data: dict
    job_description: Optional[str] = ""
    target_profession: Optional[str] = ""
    ats_analysis: dict

@router.post("/parse-resume")
async def parse_resume_upload(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Extracts text from an uploaded PDF/DOCX and uses AI to map it to the ResumeSchema.
    """
    if not file.filename.endswith(('.pdf', '.txt')):
        raise HTTPException(400, "Only PDF and TXT files are currently supported for parsing.")
    
    text = ""
    try:
        content = await file.read()
        
        if file.filename.endswith('.pdf'):
            pdf_reader = pypdf.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        else:
            text = content.decode('utf-8')
            
        if not text.strip():
            raise ValueError("Could not extract any text from the file.")
            
        parsed_data = await ResumeAIWorkflowService.parse_resume_text(text)
        return {"parsed_resume": parsed_data}
        
    except Exception as e:
        raise HTTPException(500, f"Error parsing resume: {str(e)}")


@router.post("/analyze-ats")
async def analyze_resume_ats(
    req: AnalyzeRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Analyzes the resume schema against an optional job description.
    """
    try:
        analysis = await ResumeAIWorkflowService.analyze_ats(
            resume_data=req.resume_data,
            job_description=req.job_description,
            target_profession=req.target_profession
        )
        return analysis
    except Exception as e:
        raise HTTPException(500, f"Error analyzing ATS: {str(e)}")


@router.post("/optimize-resume")
async def optimize_resume_content(
    req: OptimizeRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Rewrites the resume schema to improve ATS score and job alignment.
    """
    try:
        optimized = await ResumeAIWorkflowService.optimize_resume(
            resume_data=req.resume_data,
            ats_analysis=req.ats_analysis,
            job_description=req.job_description,
            target_profession=req.target_profession
        )
        return {"optimized_resume": optimized}
    except Exception as e:
        raise HTTPException(500, f"Error optimizing resume: {str(e)}")
