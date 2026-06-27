from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.crud.notification import create_notification
from app.crud.report import (
    create_report as create_report_record,
    get_report,
    list_reports as list_report_records,
    update_report_status,
)
from app.crud.report_comment import create_comment, list_comments
from app.core.config import settings
from app.schemas.report import (
    ReportCreate,
    ReportListResponse,
    ReportOut,
    ReportStatusUpdate,
)
from app.schemas.report_comment import ReportCommentCreate, ReportCommentOut

router = APIRouter()


@router.post("/", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def create_report(
    category: str = Form(...),
    description: str = Form(...),
    latitude: str | None = Form(None),
    longitude: str | None = Form(None),
    photo: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    if not category.strip():
        raise HTTPException(status_code=422, detail="Category is required")
    if len(description.strip()) < 10:
        raise HTTPException(
            status_code=422, detail="Description must be at least 10 characters"
        )
    if latitude:
        try:
            lat_val = float(latitude)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail="Invalid latitude") from exc
        if lat_val < -90 or lat_val > 90:
            raise HTTPException(status_code=422, detail="Latitude out of range")
    if longitude:
        try:
            lng_val = float(longitude)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail="Invalid longitude") from exc
        if lng_val < -180 or lng_val > 180:
            raise HTTPException(status_code=422, detail="Longitude out of range")

    photo_url = None
    if photo and photo.filename:
        allowed_types = {
            item.strip()
            for item in settings.report_allowed_mime_types.split(",")
            if item.strip()
        }
        if photo.content_type not in allowed_types:
            raise HTTPException(status_code=415, detail="Unsupported image type")
        raw = photo.file.read()
        if len(raw) > settings.report_max_upload_bytes:
            raise HTTPException(status_code=413, detail="Image too large")

        suffix = Path(photo.filename).suffix
        filename = f"{uuid4().hex}{suffix}"
        upload_dir = Path(settings.report_upload_dir)
        upload_dir.mkdir(parents=True, exist_ok=True)
        file_path = upload_dir / filename
        with file_path.open("wb") as target:
            target.write(raw)
        photo_url = f"/uploads/{filename}"

    payload = ReportCreate(
        category=category,
        description=description,
        photo_url=photo_url,
        latitude=latitude,
        longitude=longitude,
    )
    report = create_report_record(db, payload)
    create_notification(
        db,
        message=f"Nouveau signalement: {report.category}",
        report_id=report.id,
        target_role="admin",
    )
    return report


@router.get("/", response_model=ReportListResponse)
def list_reports(
    status: str | None = None,
    category: str | None = None,
    q: str | None = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    items, total = list_report_records(
        db, status=status, category=category, query=q, limit=limit, offset=offset
    )
    return {"items": items, "total": total, "limit": limit, "offset": offset}


@router.patch("/{report_id}/status", response_model=ReportOut)
def set_report_status(
    report_id: int,
    payload: ReportStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    report = get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    updated = update_report_status(db, report, payload.status)
    create_notification(
        db,
        message=f"Statut mis a jour: {updated.category} -> {updated.status}",
        report_id=updated.id,
        target_role="admin",
    )
    return updated


@router.get("/{report_id}/comments", response_model=list[ReportCommentOut])
def get_comments(
    report_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    report = get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return list_comments(db, report_id)


@router.post("/{report_id}/comments", response_model=ReportCommentOut)
def add_comment(
    report_id: int,
    payload: ReportCommentCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    report = get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    comment = create_comment(db, report_id, admin.email, payload.comment)
    create_notification(
        db,
        message=f"Nouveau commentaire sur {report.category}",
        report_id=report.id,
        target_role="admin",
    )
    return comment
