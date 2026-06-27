from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(
    db: Session, message: str, report_id: int | None = None, target_role: str = "admin"
) -> Notification:
    notification = Notification(
        message=message, report_id=report_id, target_role=target_role
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def list_notifications(
    db: Session, target_role: str = "admin", limit: int = 20
) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.target_role == target_role)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )


def mark_notification_read(db: Session, notification: Notification) -> Notification:
    notification.is_read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
