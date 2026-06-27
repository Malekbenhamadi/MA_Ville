from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.crud.notification import list_notifications, mark_notification_read
from app.models.notification import Notification
from app.schemas.notification import NotificationOut

router = APIRouter()


@router.get("/", response_model=list[NotificationOut])
def get_notifications(
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return list_notifications(db)


@router.patch("/{notification_id}/read", response_model=NotificationOut)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    record = db.query(Notification).filter(Notification.id == notification_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Notification not found")
    return mark_notification_read(db, record)
