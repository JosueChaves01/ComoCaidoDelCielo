from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.shared.database import get_db
from src.auth.dependencies import get_current_admin
from src.reservaciones import service
from src.reservaciones.schemas import DashboardStats

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    return service.get_dashboard_stats(db)
