import pytest
from datetime import date, time


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_reservaciones_empty(client):
    response = client.get("/reservaciones")
    assert response.status_code == 200
    assert response.json() == []


def test_cancel_not_found(client):
    response = client.delete("/reservaciones/RES-99999")
    assert response.status_code == 404


def test_disponibilidad_no_terraza(client):
    response = client.get(
        "/disponibilidad",
        params={
            "terraza_id": 999,
            "fecha": "2026-05-10",
            "hora_inicio": "14:00",
            "hora_fin": "16:00",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["disponible"] is False


def test_disponibilidad_available(client, sample_terraza):
    response = client.get(
        "/disponibilidad",
        params={
            "terraza_id": sample_terraza.id,
            "fecha": "2026-05-10",
            "hora_inicio": "14:00",
            "hora_fin": "16:00",
        },
    )
    assert response.status_code == 200
    assert response.json()["disponible"] is True


def test_cancel_reservacion_via_api(client, sample_terraza):
    from src.reservaciones import service
    from src.reservaciones.schemas import ReservacionCreate
    from tests.conftest import TestingSessionLocal

    db = TestingSessionLocal()
    try:
        from src.shared.database import Base
        from sqlalchemy import create_engine
        engine = db.get_bind()
        res = service.create(
            db,
            ReservacionCreate(
                nombre_cliente="Test User",
                terraza_id=sample_terraza.id,
                fecha=date(2026, 5, 10),
                hora_inicio=time(14, 0),
                hora_fin=time(16, 0),
                num_personas=4,
            ),
        )
        codigo = res.codigo
    finally:
        db.close()

    response = client.delete(f"/reservaciones/{codigo}")
    assert response.status_code == 200
    assert response.json()["estado"] == "cancelada"
