from datetime import date, time, datetime, timezone, timedelta
from decimal import Decimal
from sqlalchemy import func
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


def stats_hoy(db: Session) -> int:
    hoy = datetime.now(timezone.utc).date()
    return (
        db.query(func.count(Reservacion.id))
        .filter(Reservacion.fecha == hoy, Reservacion.estado != "cancelada")
        .scalar() or 0
    )


def stats_semana(db: Session) -> int:
    hoy = datetime.now(timezone.utc).date()
    lunes = hoy - timedelta(days=hoy.weekday())
    domingo = lunes + timedelta(days=6)
    return (
        db.query(func.count(Reservacion.id))
        .filter(
            Reservacion.fecha >= lunes,
            Reservacion.fecha <= domingo,
            Reservacion.estado != "cancelada",
        )
        .scalar() or 0
    )


def ingresos_estimados(db: Session) -> Decimal:
    from src.terrazas.models import Terraza
    from sqlalchemy import cast, Numeric

    hoy = datetime.now(timezone.utc).date()
    lunes = hoy - timedelta(days=hoy.weekday())
    domingo = lunes + timedelta(days=6)

    rows = (
        db.query(Reservacion.hora_inicio, Reservacion.hora_fin, Terraza.precio_hora)
        .join(Terraza, Reservacion.terraza_id == Terraza.id)
        .filter(
            Reservacion.fecha >= lunes,
            Reservacion.fecha <= domingo,
            Reservacion.estado == "confirmada",
        )
        .all()
    )

    total = Decimal("0")
    for hora_inicio, hora_fin, precio_hora in rows:
        inicio = datetime.combine(date.today(), hora_inicio)
        fin = datetime.combine(date.today(), hora_fin)
        horas = Decimal(str((fin - inicio).total_seconds() / 3600))
        total += horas * Decimal(str(precio_hora))
    return total


def get_pendientes_recordatorio(db: Session) -> list[Reservacion]:
    manana = (datetime.now(timezone.utc) + timedelta(days=1)).date()
    return (
        db.query(Reservacion)
        .filter(
            Reservacion.fecha == manana,
            Reservacion.estado == "confirmada",
            Reservacion.email_cliente.isnot(None),
            Reservacion.recordatorio_enviado.is_(False),
        )
        .all()
    )


def marcar_recordatorio_enviado(db: Session, reservacion_id: int) -> None:
    db.query(Reservacion).filter(Reservacion.id == reservacion_id).update(
        {"recordatorio_enviado": True}
    )
    db.commit()


def ocupacion_por_terraza(db: Session) -> list[dict]:
    from src.terrazas.models import Terraza

    hace_30 = datetime.now(timezone.utc).date() - timedelta(days=30)
    rows = (
        db.query(Terraza.id, Terraza.nombre, func.count(Reservacion.id).label("total"))
        .outerjoin(
            Reservacion,
            (Reservacion.terraza_id == Terraza.id)
            & (Reservacion.fecha >= hace_30)
            & (Reservacion.estado != "cancelada"),
        )
        .group_by(Terraza.id, Terraza.nombre)
        .all()
    )
    return [{"terraza_id": r.id, "nombre": r.nombre, "total_reservaciones": r.total} for r in rows]
