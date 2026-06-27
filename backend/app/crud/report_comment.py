from sqlalchemy.orm import Session

from app.models.report_comment import ReportComment


def create_comment(
    db: Session, report_id: int, author_email: str, comment: str
) -> ReportComment:
    record = ReportComment(
        report_id=report_id, author_email=author_email, comment=comment
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_comments(db: Session, report_id: int) -> list[ReportComment]:
    return (
        db.query(ReportComment)
        .filter(ReportComment.report_id == report_id)
        .order_by(ReportComment.created_at.desc())
        .all()
    )
