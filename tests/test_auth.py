import pytest
from unittest.mock import patch
from src.auth.service import create_access_token, decode_token, verify_credentials


def test_verify_credentials_correct():
    with patch("src.auth.service.get_settings") as mock:
        mock.return_value.admin_username = "admin"
        mock.return_value.admin_password = "secret123"
        mock.return_value.secret_key = "test-key"
        mock.return_value.jwt_algorithm = "HS256"
        mock.return_value.jwt_expire_minutes = 480
        assert verify_credentials("admin", "secret123") is True


def test_verify_credentials_wrong():
    with patch("src.auth.service.get_settings") as mock:
        mock.return_value.admin_username = "admin"
        mock.return_value.admin_password = "secret123"
        assert verify_credentials("admin", "wrong") is False
        assert verify_credentials("hacker", "secret123") is False


def test_token_roundtrip():
    with patch("src.auth.service.get_settings") as mock:
        mock.return_value.secret_key = "test-secret-key-32-chars-minimum!!"
        mock.return_value.jwt_algorithm = "HS256"
        mock.return_value.jwt_expire_minutes = 480
        token = create_access_token("admin")
        assert decode_token(token) == "admin"


def test_invalid_token_returns_none():
    with patch("src.auth.service.get_settings") as mock:
        mock.return_value.secret_key = "test-secret-key-32-chars-minimum!!"
        mock.return_value.jwt_algorithm = "HS256"
        assert decode_token("not-a-valid-token") is None


def test_login_endpoint_success(client):
    import os
    os.environ["ADMIN_USERNAME"] = "admin"
    os.environ["ADMIN_PASSWORD"] = "testpass"
    with patch("src.auth.service.get_settings") as mock:
        mock.return_value.admin_username = "admin"
        mock.return_value.admin_password = "testpass"
        mock.return_value.secret_key = "test-secret-key-32-chars-minimum!!"
        mock.return_value.jwt_algorithm = "HS256"
        mock.return_value.jwt_expire_minutes = 480
        response = client.post("/auth/login", json={"username": "admin", "password": "testpass"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_endpoint_wrong_password(client):
    with patch("src.auth.service.get_settings") as mock:
        mock.return_value.admin_username = "admin"
        mock.return_value.admin_password = "secret"
        response = client.post("/auth/login", json={"username": "admin", "password": "wrong"})
    assert response.status_code == 401


def test_admin_stats_without_token(client):
    response = client.get("/admin/stats")
    assert response.status_code in (401, 403)


def test_admin_stats_with_token(client, sample_terraza):
    with patch("src.auth.service.get_settings") as mock:
        mock.return_value.secret_key = "test-secret-key-32-chars-minimum!!"
        mock.return_value.jwt_algorithm = "HS256"
        mock.return_value.jwt_expire_minutes = 480
        token = create_access_token("admin")

    with patch("src.auth.dependencies.decode_token", return_value="admin"):
        response = client.get("/admin/stats", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    data = response.json()
    assert "reservaciones_hoy" in data
    assert "reservaciones_semana" in data
    assert "ingresos_estimados_semana" in data
    assert "ocupacion_por_terraza" in data
