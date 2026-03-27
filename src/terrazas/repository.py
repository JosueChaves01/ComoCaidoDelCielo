from sqlalchemy.orm import Session
from src.terrazas.models import Terraza
from src.terrazas.schemas import TerrazaCreate, TerrazaUpdate


def get_all(db: Session) -> list[Terraza]:
    return db.query(Terraza).filter(Terraza.activa == True).all()


def get_all_admin(db: Session) -> list[Terraza]:
    return db.query(Terraza).order_by(Terraza.id).all()


def get_by_id(db: Session, terraza_id: int) -> Terraza | None:
    return db.query(Terraza).filter(Terraza.id == terraza_id, Terraza.activa == True).first()


def get_by_id_admin(db: Session, terraza_id: int) -> Terraza | None:
    return db.query(Terraza).filter(Terraza.id == terraza_id).first()


def create(db: Session, data: TerrazaCreate) -> Terraza:
    terraza = Terraza(**data.model_dump())
    db.add(terraza)
    db.commit()
    db.refresh(terraza)
    return terraza


def update(db: Session, terraza_id: int, data: TerrazaUpdate) -> Terraza | None:
    terraza = get_by_id_admin(db, terraza_id)
    if not terraza:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(terraza, field, value)
    db.commit()
    db.refresh(terraza)
    return terraza
