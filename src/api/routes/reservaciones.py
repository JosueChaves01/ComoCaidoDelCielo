from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.shared.database import get_db
from src.reservaciones import service
from src.reservaciones.schemas import ReservacionResponse

router = APIRouter(prefix="/reservaciones", tags=["reservaciones"])


@router.get("", response_model=list[ReservacionResponse])
def list_reservaciones(db: Session = Depends(get_db)):
    return service.list_all(db)


@router.delete("/{codigo}", response_model=ReservacionResponse)
def cancel_reservacion(codigo: str, db: Session = Depends(get_db)):
    try:
        return service.cancel(db, codigo.upper())
    except service.NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
