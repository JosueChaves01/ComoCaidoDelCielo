"""
Tests for LangGraph state transitions.
These tests mock the LLM to avoid real API calls.
"""
import pytest
from unittest.mock import patch, MagicMock
from src.chatbot.states import ChatState, ReservationInfo
from src.chatbot import session_store


def make_state(current_state="GREETING") -> ChatState:
    return ChatState(
        session_id="test-session",
        messages=[],
        current_state=current_state,
        reservation_info=ReservationInfo(),
        available_terrazas=[],
        confirmation_pending=False,
        last_error=None,
        intent=None,
    )


def test_session_create():
    state = session_store.get_or_create("new-session-123")
    assert state["current_state"] == "GREETING"
    assert state["messages"] == []
    session_store.delete("new-session-123")


def test_session_update():
    state = session_store.get_or_create("update-session")
    state["intent"] = "nueva_reserva"
    session_store.update("update-session", state)
    retrieved = session_store.get_or_create("update-session")
    assert retrieved["intent"] == "nueva_reserva"
    session_store.delete("update-session")


def test_greeting_node_nueva_reserva():
    import json
    from src.chatbot.nodes import greeting_node

    mock_response = MagicMock()
    mock_response.content = json.dumps({
        "intent": "nueva_reserva",
        "respuesta": "¡Hola! ¿Quieres reservar una terraza?"
    })

    with patch("src.chatbot.nodes.get_llm") as mock_llm_factory:
        mock_llm = MagicMock()
        mock_llm.invoke.return_value = mock_response
        mock_llm_factory.return_value = mock_llm

        state = make_state()
        state["messages"].append({"role": "user", "content": "quiero reservar"})
        result = greeting_node(state)

    assert result["intent"] == "nueva_reserva"
    assert result["current_state"] == "COLLECTING_INFO"
    assert any(m["role"] == "assistant" for m in result["messages"])


def test_greeting_node_cancelar():
    import json
    from src.chatbot.nodes import greeting_node

    mock_response = MagicMock()
    mock_response.content = json.dumps({
        "intent": "cancelar",
        "respuesta": "Claro, ¿cuál es tu código?"
    })

    with patch("src.chatbot.nodes.get_llm") as mock_llm_factory:
        mock_llm = MagicMock()
        mock_llm.invoke.return_value = mock_response
        mock_llm_factory.return_value = mock_llm

        state = make_state()
        state["messages"].append({"role": "user", "content": "quiero cancelar"})
        result = greeting_node(state)

    assert result["intent"] == "cancelar"
    assert result["current_state"] == "CANCELLATION"


def test_edges_route_after_greeting_nueva_reserva():
    from src.chatbot.edges import route_after_greeting
    state = make_state()
    state["intent"] = "nueva_reserva"
    assert route_after_greeting(state) == "collect_info"


def test_edges_route_after_greeting_cancelar():
    from src.chatbot.edges import route_after_greeting
    state = make_state()
    state["intent"] = "cancelar"
    assert route_after_greeting(state) == "cancellation"


def test_edges_route_after_confirm_yes():
    from src.chatbot.edges import route_after_confirm
    state = make_state("CONFIRMING")
    state["messages"] = [
        {"role": "assistant", "content": "¿Confirmas?"},
        {"role": "user", "content": "sí, confirmo"},
    ]
    assert route_after_confirm(state) == "booking"


def test_edges_route_after_confirm_no():
    from src.chatbot.edges import route_after_confirm
    state = make_state("CONFIRMING")
    state["messages"] = [
        {"role": "assistant", "content": "¿Confirmas?"},
        {"role": "user", "content": "no, cancelar"},
    ]
    assert route_after_confirm(state) == "collect_info"
