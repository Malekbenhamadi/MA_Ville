from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.report import Report
from app.schemas.report import ReportCreate, ReportStatus


def create_report(db: Session, payload: ReportCreate) -> Report:
    report = Report(
        category=payload.category,
        description=payload.description,
        photo_url=payload.photo_url,
        latitude=payload.latitude,
        longitude=payload.longitude,
        status=ReportStatus.PENDING.value,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_report(db: Session, report_id: int) -> Report | None:
    return db.query(Report).filter(Report.id == report_id).first()


def list_reports(
    db: Session,
    status: str | None = None,
    category: str | None = None,
    query: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[Report], int]:
    request = db.query(Report)
    if status:
        request = request.filter(Report.status == status)
    if category:
        request = request.filter(Report.category == category)
    if query:
        pattern = f"%{query}%"
        request = request.filter(
            or_(Report.description.ilike(pattern), Report.category.ilike(pattern))
        )
    total = request.count()
    items = (
        request.order_by(Report.created_at.desc()).offset(offset).limit(limit).all()
    )
    return items, total


def update_report_status(
    db: Session, report: Report, status_value: ReportStatus
) -> Report:
    report.status = status_value.value
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
