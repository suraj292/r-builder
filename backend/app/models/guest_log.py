from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.db.base import Base

class GuestScanLog(Base):
    __tablename__ = "guest_scan_logs"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(50), nullable=False, index=True)
    user_agent = Column(String(500), nullable=True)
    device_info = Column(String(255), nullable=True)
    
    resume_text = Column(Text, nullable=True) # The raw text of the resume
    analysis_result = Column(JSON, nullable=True) # The resulting ATS analysis JSON
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
