import uuid
from src.chatbot.states import ChatState, ReservationInfo


_sessions: dict[str, ChatState] = {}


def get_or_create(session_id: str) -> ChatState:
    if session_id not in _sessions:
        _sessions[session_id] = ChatState(
            session_id=session_id,
            messages=[],
            current_state="GREETING",
            reservation_info=ReservationInfo(),
            available_terrazas=[],
            confirmation_pending=False,
            last_error=None,
            intent=None,
        )
    return _sessions[session_id]


def update(session_id: str, state: ChatState) -> None:
    _sessions[session_id] = state


def delete(session_id: str) -> None:
    _sessions.pop(session_id, None)


def new_session_id() -> str:
    return str(uuid.uuid4())
