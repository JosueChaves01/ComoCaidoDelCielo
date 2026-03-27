from sqlalchemy.orm import Session
from src.terrazas.models import Terraza


def get_all(db: Session) -> list[Terraza]:
    return db.query(Terraza).filter(Terraza.activa == True).all()


def get_by_id(db: Session, terraza_id: int) -> Terraza | None:
    return db.query(Terraza).filter(Terraza.id == terraza_id, Terraza.activa == True).first()
