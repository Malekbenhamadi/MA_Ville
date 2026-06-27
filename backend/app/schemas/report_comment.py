from datetime import datetime

from pydantic import BaseModel, Field


class ReportCommentCreate(BaseModel):
    comment: str = Field(min_length=2, max_length=2000)


class ReportCommentOut(BaseModel):
    id: int
    report_id: int
    author_email: str
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
