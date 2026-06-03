from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from pydantic import BaseModel
from typing import Optional, Any
import io
import json
from datetime import datetime, time as dtime, timedelta

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False


from app.api.deps import get_current_user, get_db, get_current_user_optional, check_feature_access
from app.models.user import User
from app.models.guest_log import GuestScanLog
from app.models.resume import Resume
from app.schemas.guest_log import GuestAnalyzeRequest
from app.services.ai_workflow import ResumeAIWorkflowService
from app.core.limiter import limiter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

router = APIRouter()

class AnalyzeRequest(BaseModel):
    resume_data: dict
    job_description: Optional[str] = ""
    target_profession: Optional[str] = ""
    device_info: Optional[str] = None

class OptimizeRequest(BaseModel):
    resume_data: dict
    job_description: Optional[str] = ""
    target_profession: Optional[str] = ""
    ats_analysis: Optional[dict] = {}

@router.post("/parse-resume")
async def parse_resume_upload(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional)
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
            if not PYPDF_AVAILABLE:
                raise HTTPException(
                    status_code=500, 
                    detail="PDF parsing is currently unavailable due to missing dependency (pypdf). Please upload a TXT file instead."
                )
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
@limiter.limit("10/minute")
async def analyze_resume_ats(
    req: AnalyzeRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_feature_access("ats_scan"))
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
        
        # Increment usage
        current_user.ats_scans_used += 1
        db.add(current_user)

        # Log the scan
        new_log = GuestScanLog(
            user_id=current_user.id,
            ip_address=request.client.host if request and request.client else None,
            user_agent=request.headers.get("user-agent") if request else None,
            device_info=req.device_info,
            resume_text=json.dumps(req.resume_data),
            analysis_result=analysis
        )
        db.add(new_log)
        await db.commit()
        
        return analysis
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(500, f"Error analyzing ATS: {str(e)}")


@router.post("/optimize-resume")
async def optimize_resume_content(
    req: OptimizeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_feature_access("ai_generation"))
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
        
        # Increment usage
        current_user.ai_credits_used += 1
        db.add(current_user)

        # If resume_id is provided, auto-save the optimization
        resume_id = req.ats_analysis.get("resume_id") # We can pass this from frontend
        if resume_id:
            stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
            result = await db.execute(stmt)
            db_resume = result.scalars().first()
            if db_resume:
                db_resume.data = optimized
                db_resume.title = optimized.get("metadata", {}).get("title", db_resume.title)
                await db.commit()

        return {"optimized_resume": optimized}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(500, f"Error optimizing resume: {str(e)}")

@router.post("/guest-analyze-ats")
@limiter.limit("5/day")
async def guest_analyze_ats(
    req: GuestAnalyzeRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Public ATS analysis for guests. Limited to 1 per IP per day.
    """
    client_ip = request.client.host
    
    # Check for existing scans today from this IP
    today_start = datetime.combine(datetime.now(), dtime.min)
    stmt = select(func.count(GuestScanLog.id)).where(
        GuestScanLog.ip_address == client_ip,
        GuestScanLog.created_at >= today_start
    )
    result = await db.execute(stmt)
    count = result.scalar()
    
    if count >= 1:
        raise HTTPException(
            status_code=429, 
            detail="Guest limit reached. Please log in to perform unlimited scans."
        )
    
    # Run analysis
    try:
        # Prepare data for analysis
        resume_data = req.resume_data or {"blocks": {"text-1": {"type": "text", "data": {"content": req.resume_text or ""}}}}
        
        analysis = await ResumeAIWorkflowService.analyze_ats(
            resume_data=resume_data,
            target_profession=req.target_profession
        )
        
        # Log the scan
        new_log = GuestScanLog(
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent"),
            device_info=req.device_info,
            resume_text=json.dumps(resume_data),
            analysis_result=analysis
        )
        db.add(new_log)
        await db.commit()
        
        return analysis
    except Exception as e:
        raise HTTPException(500, f"Analysis failed: {str(e)}")
