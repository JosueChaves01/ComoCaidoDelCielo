"""
End-to-end tests for full conversation flows.
LLM calls are mocked; sessions use in-memory store; DB uses test SQLite.
"""
import json
import pytest
from unittest.mock import patch, MagicMock
from tests.conftest import TestingSessionLocal
from src.chatbot import session_store


def _llm_resp(content: str) -> MagicMock:
    m = MagicMock()
    m.content = content
    return m


E2E_SESSION = "e2e-booking"
E2E_CANCEL_SESSION = "e2e-cancel"


@pytest.fixture(autouse=True)
def cleanup_sessions():
    yield
    session_store.delete(E2E_SESSION)
    session_store.delete(E2E_CANCEL_SESSION)


def test_full_booking_flow(client, sample_terraza):
    """
    3-turn booking:
      turn 1 → COLLECTING_INFO (incomplete)
      turn 2 → CONFIRMING (data complete, availability ok)
      turn 3 → COMPLETED (user confirmed, reservation created)
    """
    tid = sample_terraza.id

    # LLM calls per turn (graph always: greeting → collect_info → ...):
    #   turn 1: greeting(1) + collect_info CASO-A extract(1) = 2
    #           (no date extracted → Python slot suggestion, early return)
    #   turn 2: greeting(1) + collect_info CASO-A extract(1) + CASO-B(1) = 3
    #           (extract returns full data → CASO B → check_avail → confirm → END)
    #   turn 3: greeting(1) + collect_info CASO-B(1) = 2
    #           (all data in session → CASO B → check_avail → confirm → booking → END)
    llm_responses = [
        # turn 1 — greeting
        _llm_resp(json.dumps({"intent": "nueva_reserva", "respuesta": "¡Hola! ¿Cómo te llamas?"})),
        # turn 1 — collect_info CASO-A extract (empty → Python slot suggestion)
        _llm_resp(json.dumps({"terraza_id": 0, "fecha": "", "hora_inicio": "", "hora_fin": "", "num_personas": 0})),
        # turn 2 — greeting
        _llm_resp(json.dumps({"intent": "nueva_reserva", "respuesta": "Entendido."})),
        # turn 2 — collect_info CASO-A extract (full data from user message)
        _llm_resp(json.dumps({
            "terraza_id": tid, "fecha": "2026-09-01",
            "hora_inicio": "18:00", "hora_fin": "21:00", "num_personas": 8,
        })),
        # turn 2 — collect_info CASO-B (all data → completo=True, advances to check_avail)
        _llm_resp(json.dumps({
            "nombre_cliente": "Ana E2E", "email_cliente": "ana@e2e.com",
            "terraza_id": tid, "fecha": "2026-09-01",
            "hora_inicio": "18:00", "hora_fin": "21:00", "num_personas": 8,
            "notas": "", "completo": True, "respuesta": "¿Confirmamos tu reservación?",
        })),
        # turn 3 — greeting
        _llm_resp(json.dumps({"intent": "nueva_reserva", "respuesta": "Ok."})),
        # turn 3 — collect_info CASO-B (all data still in session → completo=True)
        _llm_resp(json.dumps({
            "nombre_cliente": "Ana E2E", "email_cliente": "ana@e2e.com",
            "terraza_id": tid, "fecha": "2026-09-01",
            "hora_inicio": "18:00", "hora_fin": "21:00", "num_personas": 8,
            "notas": "", "completo": True, "respuesta": "Datos completos.",
        })),
    ]

    mock_llm = MagicMock()
    mock_llm.invoke.side_effect = llm_responses

    with patch("src.chatbot.nodes.get_llm", return_value=mock_llm), \
         patch("src.chatbot.nodes.SessionLocal", TestingSessionLocal), \
         patch("src.notifications.email.send_confirmacion"):

        r1 = client.post("/chat", json={"session_id": E2E_SESSION, "message": "quiero reservar"})
        assert r1.status_code == 200
        assert r1.json()["current_state"] == "COLLECTING_INFO"

        r2 = client.post("/chat", json={
            "session_id": E2E_SESSION,
            "message": f"Ana E2E, ana@e2e.com, terraza {tid}, 2026-09-01, 18 a 21h, 8 personas",
        })
        assert r2.status_code == 200
        assert r2.json()["current_state"] == "CONFIRMING"

        r3 = client.post("/chat", json={"session_id": E2E_SESSION, "message": "sí confirmo"})
        assert r3.status_code == 200
        data = r3.json()
        assert data["current_state"] == "COMPLETED"
        assert "RES-" in data["response"]


def test_booking_conflict(client, sample_terraza):
    """Attempting to book an already-taken slot returns an error message."""
    from src.reservaciones import service as reservacion_service
    from src.reservaciones.schemas import ReservacionCreate
    from datetime import date, time

    db = TestingSessionLocal()
    try:
        reservacion_service.create(db, ReservacionCreate(
            nombre_cliente="Previo",
            terraza_id=sample_terraza.id,
            fecha=date(2026, 9, 10),
            hora_inicio=time(14, 0),
            hora_fin=time(16, 0),
            num_personas=5,
        ))
    finally:
        db.close()

    tid = sample_terraza.id
    llm_responses = [
        # turn 1 — greeting
        _llm_resp(json.dumps({"intent": "nueva_reserva", "respuesta": "¡Hola!"})),
        # turn 1 — collect_info CASO-A extract (empty → Python slots, early return)
        _llm_resp(json.dumps({"terraza_id": 0, "fecha": "", "hora_inicio": "", "hora_fin": "", "num_personas": 0})),
        # turn 2 — greeting
        _llm_resp(json.dumps({"intent": "nueva_reserva", "respuesta": "Ok."})),
        # turn 2 — collect_info CASO-A extract (full conflicting slot)
        _llm_resp(json.dumps({
            "terraza_id": tid, "fecha": "2026-09-10",
            "hora_inicio": "14:00", "hora_fin": "16:00", "num_personas": 3,
        })),
        # turn 2 — collect_info CASO-B (all data → completo=True)
        _llm_resp(json.dumps({
            "nombre_cliente": "Otro", "email_cliente": None,
            "terraza_id": tid, "fecha": "2026-09-10",
            "hora_inicio": "14:00", "hora_fin": "16:00", "num_personas": 3,
            "notas": "", "completo": True, "respuesta": "Perfecto.",
        })),
    ]

    mock_llm = MagicMock()
    mock_llm.invoke.side_effect = llm_responses

    conflict_session = "e2e-conflict"
    try:
        with patch("src.chatbot.nodes.get_llm", return_value=mock_llm), \
             patch("src.chatbot.nodes.SessionLocal", TestingSessionLocal):

            client.post("/chat", json={"session_id": conflict_session, "message": "reservar"})
            r2 = client.post("/chat", json={
                "session_id": conflict_session,
                "message": f"Otro, terraza {tid}, 2026-09-10, 14 a 16h, 3 personas",
            })
            assert r2.status_code == 200
            # Conflict detected → stays in COLLECTING_INFO asking for another slot
            assert r2.json()["current_state"] == "COLLECTING_INFO"
    finally:
        session_store.delete(conflict_session)


def test_cancellation_flow(client, sample_terraza):
    """
    Chat cancellation: pre-populate codigo_cancelacion in the session so
    cancellation_node can find and cancel it in one turn.
    (cancellation_node checks reservation_info first, before scanning messages)
    """
    from src.reservaciones import service as reservacion_service
    from src.reservaciones.schemas import ReservacionCreate
    from datetime import date, time

    db = TestingSessionLocal()
    try:
        res = reservacion_service.create(db, ReservacionCreate(
            nombre_cliente="Para Cancelar",
            terraza_id=sample_terraza.id,
            fecha=date(2026, 9, 20),
            hora_inicio=time(10, 0),
            hora_fin=time(12, 0),
            num_personas=4,
        ))
        codigo = res.codigo
    finally:
        db.close()

    # Pre-populate the session so cancellation_node finds the code immediately
    state = session_store.get_or_create(E2E_CANCEL_SESSION)
    state["reservation_info"]["codigo_cancelacion"] = codigo
    session_store.update(E2E_CANCEL_SESSION, state)

    llm_responses = [
        _llm_resp(json.dumps({"intent": "cancelar", "respuesta": "Cancelando tu reservación."})),
    ]
    mock_llm = MagicMock()
    mock_llm.invoke.side_effect = llm_responses

    with patch("src.chatbot.nodes.get_llm", return_value=mock_llm), \
         patch("src.chatbot.nodes.SessionLocal", TestingSessionLocal):

        r = client.post("/chat", json={
            "session_id": E2E_CANCEL_SESSION,
            "message": "quiero cancelar mi reservación",
        })
        assert r.status_code == 200
        data = r.json()
        assert data["current_state"] == "COMPLETED"
        assert codigo in data["response"]
