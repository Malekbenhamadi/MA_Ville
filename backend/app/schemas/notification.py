from datetime import datetime

from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: int
    message: str
    target_role: str
    report_id: int | None = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
