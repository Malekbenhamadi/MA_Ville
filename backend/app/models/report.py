from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.models.base import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    photo_url = Column(String(500))
    status = Column(String(50), default="PENDING", nullable=False)
    latitude = Column(String(50))
    longitude = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
