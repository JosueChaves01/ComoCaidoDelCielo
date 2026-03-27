from sqlalchemy.orm import Session
from src.terrazas import repository
from src.terrazas.schemas import TerrazaCreate, TerrazaUpdate, TerrazaResponse


class NotFoundError(Exception):
    pass


def list_all_public(db: Session) -> list[TerrazaResponse]:
    return [TerrazaResponse.model_validate(t) for t in repository.get_all(db)]


def list_all_admin(db: Session) -> list[TerrazaResponse]:
    return [TerrazaResponse.model_validate(t) for t in repository.get_all_admin(db)]


def create(db: Session, data: TerrazaCreate) -> TerrazaResponse:
    terraza = repository.create(db, data)
    return TerrazaResponse.model_validate(terraza)


def update(db: Session, terraza_id: int, data: TerrazaUpdate) -> TerrazaResponse:
    terraza = repository.update(db, terraza_id, data)
    if not terraza:
        raise NotFoundError(f"Terraza {terraza_id} no encontrada.")
    return TerrazaResponse.model_validate(terraza)
