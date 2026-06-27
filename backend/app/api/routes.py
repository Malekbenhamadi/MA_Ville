from fastapi import APIRouter

from app.api import auth, health, notifications, reports

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(
	notifications.router, prefix="/notifications", tags=["notifications"]
)
