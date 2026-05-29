from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class UserActivityLog(Base):
    __tablename__ = "user_activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    action = Column(String(255), nullable=False) # e.g., 'login', 'ai_credit_adjustment', 'quota_reset'
    details = Column(String(1000), nullable=True) # e.g., 'Admin reset quotas'
    ip_address = Column(String(50), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="activity_logs")
