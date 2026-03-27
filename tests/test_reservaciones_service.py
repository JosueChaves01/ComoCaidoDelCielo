import pytest
from datetime import date, time
from src.reservaciones import service
from src.reservaciones.schemas import ReservacionCreate


def make_reservacion(terraza_id: int = 1) -> ReservacionCreate:
    return ReservacionCreate(
        nombre_cliente="Ana García",
        email_cliente="ana@example.com",
        terraza_id=terraza_id,
        fecha=date(2026, 5, 10),
        hora_inicio=time(14, 0),
        hora_fin=time(16, 0),
        num_personas=8,
    )


def test_check_availability_no_terraza(db):
    result = service.check_availability(db, 999, date(2026, 5, 10), time(14, 0), time(16, 0))
    assert result.disponible is False


def test_check_availability_available(db, sample_terraza):
    result = service.check_availability(
        db, sample_terraza.id, date(2026, 5, 10), time(14, 0), time(16, 0)
    )
    assert result.disponible is True


def test_create_reservacion(db, sample_terraza):
    data = make_reservacion(sample_terraza.id)
    res = service.create(db, data)
    assert res.codigo.startswith("RES-")
    assert res.nombre_cliente == "Ana García"
    assert res.estado == "confirmada"


def test_conflict_detection(db, sample_terraza):
    data = make_reservacion(sample_terraza.id)
    service.create(db, data)
    with pytest.raises(service.ConflictError):
        service.create(db, data)


def test_partial_overlap_conflict(db, sample_terraza):
    data1 = ReservacionCreate(
        nombre_cliente="Cliente 1",
        terraza_id=sample_terraza.id,
        fecha=date(2026, 5, 10),
        hora_inicio=time(14, 0),
        hora_fin=time(16, 0),
        num_personas=5,
    )
    data2 = ReservacionCreate(
        nombre_cliente="Cliente 2",
        terraza_id=sample_terraza.id,
        fecha=date(2026, 5, 10),
        hora_inicio=time(15, 0),  # overlaps
        hora_fin=time(17, 0),
        num_personas=5,
    )
    service.create(db, data1)
    with pytest.raises(service.ConflictError):
        service.create(db, data2)


def test_no_conflict_different_day(db, sample_terraza):
    data1 = make_reservacion(sample_terraza.id)
    data2 = ReservacionCreate(
        nombre_cliente="Cliente B",
        terraza_id=sample_terraza.id,
        fecha=date(2026, 5, 11),  # different day
        hora_inicio=time(14, 0),
        hora_fin=time(16, 0),
        num_personas=5,
    )
    r1 = service.create(db, data1)
    r2 = service.create(db, data2)
    assert r1.codigo != r2.codigo


def test_cancel_reservacion(db, sample_terraza):
    data = make_reservacion(sample_terraza.id)
    res = service.create(db, data)
    cancelled = service.cancel(db, res.codigo)
    assert cancelled.estado == "cancelada"


def test_cancel_not_found(db):
    with pytest.raises(service.NotFoundError):
        service.cancel(db, "RES-99999")


def test_cancelled_allows_rebooking(db, sample_terraza):
    data = make_reservacion(sample_terraza.id)
    res = service.create(db, data)
    service.cancel(db, res.codigo)
    # Same slot should now be available
    res2 = service.create(db, data)
    assert res2.codigo != res.codigo
