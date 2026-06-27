from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ReportStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"


class ReportCreate(BaseModel):
    category: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=10, max_length=2000)
    photo_url: Optional[str] = Field(default=None, max_length=500)
    latitude: Optional[str] = None
    longitude: Optional[str] = None


class ReportOut(ReportCreate):
    id: int
    status: str

    class Config:
        from_attributes = True


class ReportStatusUpdate(BaseModel):
    status: ReportStatus


class ReportListResponse(BaseModel):
    items: list[ReportOut]
    total: int
    limit: int
    offset: int
