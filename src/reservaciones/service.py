from datetime import date, time
from sqlalchemy.orm import Session
from src.reservaciones import repository
from src.reservaciones.schemas import (
    ReservacionCreate,
    ReservacionResponse,
    AvailabilityResponse,
    DashboardStats,
    OcupacionTerraza,
)
from src.terrazas import repository as terraza_repo


class ConflictError(Exception):
    pass


class NotFoundError(Exception):
    pass


def _generate_codigo(db: Session) -> str:
    last_id = repository.get_last_id(db)
    return f"RES-{(last_id + 1):05d}"


def check_availability(
    db: Session,
    terraza_id: int,
    fecha: date,
    hora_inicio: time,
    hora_fin: time,
) -> AvailabilityResponse:
    terraza = terraza_repo.get_by_id(db, terraza_id)
    if not terraza:
        return AvailabilityResponse(
            disponible=False,
            mensaje=f"Terraza {terraza_id} no encontrada o inactiva.",
        )

    conflicts = repository.find_conflicts(db, terraza_id, fecha, hora_inicio, hora_fin)
    if conflicts:
        codigos = [c.codigo for c in conflicts]
        return AvailabilityResponse(
            disponible=False,
            mensaje="Horario no disponible: existe conflicto con otra reservación.",
            conflictos=codigos,
        )

    return AvailabilityResponse(
        disponible=True,
        mensaje=f"La terraza '{terraza.nombre}' está disponible en ese horario.",
    )


def create(db: Session, data: ReservacionCreate) -> ReservacionResponse:
    result = check_availability(db, data.terraza_id, data.fecha, data.hora_inicio, data.hora_fin)
    if not result.disponible:
        raise ConflictError(result.mensaje)

    codigo = _generate_codigo(db)
    reservacion = repository.create(db, data, codigo)
    return ReservacionResponse.model_validate(reservacion)


def cancel(db: Session, codigo: str) -> ReservacionResponse:
    reservacion = repository.cancel(db, codigo)
    if not reservacion:
        raise NotFoundError(f"Reservación {codigo} no encontrada.")
    return ReservacionResponse.model_validate(reservacion)


def list_all(db: Session) -> list[ReservacionResponse]:
    reservaciones = repository.list_all(db)
    return [ReservacionResponse.model_validate(r) for r in reservaciones]


def get_dashboard_stats(db: Session) -> DashboardStats:
    ocupacion = [OcupacionTerraza(**row) for row in repository.ocupacion_por_terraza(db)]
    return DashboardStats(
        reservaciones_hoy=repository.stats_hoy(db),
        reservaciones_semana=repository.stats_semana(db),
        ingresos_estimados_semana=float(repository.ingresos_estimados(db)),
        ocupacion_por_terraza=ocupacion,
    )
