from datetime import date, time
from sqlalchemy.orm import Session
from src.reservaciones.models import Reservacion
from src.reservaciones.schemas import ReservacionCreate


def find_conflicts(
    db: Session,
    terraza_id: int,
    fecha: date,
    hora_inicio: time,
    hora_fin: time,
    exclude_id: int | None = None,
) -> list[Reservacion]:
    query = (
        db.query(Reservacion)
        .filter(
            Reservacion.terraza_id == terraza_id,
            Reservacion.fecha == fecha,
            Reservacion.estado.notin_(["cancelada"]),
            Reservacion.hora_inicio < hora_fin,
            Reservacion.hora_fin > hora_inicio,
        )
    )
    if exclude_id is not None:
        query = query.filter(Reservacion.id != exclude_id)
    return query.all()


def create(db: Session, data: ReservacionCreate, codigo: str) -> Reservacion:
    reservacion = Reservacion(
        codigo=codigo,
        nombre_cliente=data.nombre_cliente,
        email_cliente=data.email_cliente,
        terraza_id=data.terraza_id,
        fecha=data.fecha,
        hora_inicio=data.hora_inicio,
        hora_fin=data.hora_fin,
        num_personas=data.num_personas,
        estado="confirmada",
        notas=data.notas,
    )
    db.add(reservacion)
    db.commit()
    db.refresh(reservacion)
    return reservacion


def cancel(db: Session, codigo: str) -> Reservacion | None:
    reservacion = db.query(Reservacion).filter(Reservacion.codigo == codigo).first()
    if not reservacion:
        return None
    reservacion.estado = "cancelada"
    db.commit()
    db.refresh(reservacion)
    return reservacion


def list_all(db: Session, skip: int = 0, limit: int = 100) -> list[Reservacion]:
    return db.query(Reservacion).offset(skip).limit(limit).all()


def get_by_codigo(db: Session, codigo: str) -> Reservacion | None:
    return db.query(Reservacion).filter(Reservacion.codigo == codigo).first()


def get_last_id(db: Session) -> int:
    result = db.query(Reservacion.id).order_by(Reservacion.id.desc()).first()
    return result[0] if result else 0
