import pytest
from unittest.mock import patch
from src.auth.service import create_access_token


def auth_headers():
    with patch("src.auth.service.get_settings") as mock:
        mock.return_value.secret_key = "test-secret-key-32-chars-minimum!!"
        mock.return_value.jwt_algorithm = "HS256"
        mock.return_value.jwt_expire_minutes = 480
        token = create_access_token("admin")
    return {"Authorization": f"Bearer {token}"}


def test_list_terrazas_public(client, sample_terraza):
    response = client.get("/terrazas")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["nombre"] == "Terraza Principal"


def test_list_terrazas_admin_without_token(client):
    response = client.get("/terrazas/admin")
    assert response.status_code in (401, 403)


def test_list_terrazas_admin_with_token(client, sample_terraza):
    with patch("src.auth.dependencies.decode_token", return_value="admin"):
        response = client.get("/terrazas/admin", headers=auth_headers())
    assert response.status_code == 200


def test_create_terraza_requires_auth(client):
    response = client.post("/terrazas", json={
        "nombre": "Nueva Terraza", "capacidad": 10, "precio_hora": 300
    })
    assert response.status_code in (401, 403)


def test_create_terraza_with_auth(client):
    with patch("src.auth.dependencies.decode_token", return_value="admin"):
        response = client.post(
            "/terrazas",
            json={"nombre": "Nueva Terraza", "capacidad": 10, "precio_hora": "300.00"},
            headers=auth_headers(),
        )
    assert response.status_code == 201
    assert response.json()["nombre"] == "Nueva Terraza"


def test_update_terraza_with_auth(client, sample_terraza):
    with patch("src.auth.dependencies.decode_token", return_value="admin"):
        response = client.put(
            f"/terrazas/{sample_terraza.id}",
            json={"precio_hora": "999.00"},
            headers=auth_headers(),
        )
    assert response.status_code == 200
    assert float(response.json()["precio_hora"]) == 999.0


def test_update_terraza_not_found(client):
    with patch("src.auth.dependencies.decode_token", return_value="admin"):
        response = client.put(
            "/terrazas/9999",
            json={"precio_hora": "100.00"},
            headers=auth_headers(),
        )
    assert response.status_code == 404
