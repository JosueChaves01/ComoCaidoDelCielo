from datetime import date, time
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.shared.database import get_db
from src.reservaciones import service
from src.reservaciones.schemas import AvailabilityResponse

router = APIRouter(prefix="/disponibilidad", tags=["disponibilidad"])


@router.get("", response_model=AvailabilityResponse)
def check_disponibilidad(
    terraza_id: int = Query(...),
    fecha: date = Query(...),
    hora_inicio: time = Query(...),
    hora_fin: time = Query(...),
    db: Session = Depends(get_db),
):
    return service.check_availability(db, terraza_id, fecha, hora_inicio, hora_fin)
