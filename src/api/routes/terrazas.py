from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.shared.database import get_db
from src.auth.dependencies import get_current_admin
from src.terrazas import service
from src.terrazas.schemas import TerrazaCreate, TerrazaUpdate, TerrazaResponse

router = APIRouter(prefix="/terrazas", tags=["terrazas"])


@router.get("", response_model=list[TerrazaResponse])
def list_terrazas(db: Session = Depends(get_db)):
    return service.list_all_public(db)


@router.get("/admin", response_model=list[TerrazaResponse])
def list_terrazas_admin(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    return service.list_all_admin(db)


@router.post("", response_model=TerrazaResponse, status_code=201)
def create_terraza(
    data: TerrazaCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    return service.create(db, data)


@router.put("/{terraza_id}", response_model=TerrazaResponse)
def update_terraza(
    terraza_id: int,
    data: TerrazaUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    try:
        return service.update(db, terraza_id, data)
    except service.NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
