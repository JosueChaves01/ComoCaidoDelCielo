import json
import uuid
import logging
from src.chatbot.states import ChatState, ReservationInfo

logger = logging.getLogger(__name__)
_REDIS_TTL = 86_400  # 24 hours
_redis_client = None
_sessions: dict[str, ChatState] = {}  # in-memory fallback


def _make_initial(session_id: str) -> ChatState:
    return ChatState(
        session_id=session_id,
        messages=[],
        current_state="GREETING",
        reservation_info=ReservationInfo(),
        available_terrazas=[],
        confirmation_pending=False,
        last_error=None,
        intent=None,
    )


def _get_redis():
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    from src.shared.config import get_settings
    url = get_settings().redis_url
    if not url:
        return None
    import redis
    _redis_client = redis.from_url(url, decode_responses=True)
    return _redis_client


def get_or_create(session_id: str) -> ChatState:
    client = _get_redis()
    if client:
        try:
            data = client.get(f"chatbot:session:{session_id}")
            if data:
                return json.loads(data)
            state = _make_initial(session_id)
            client.setex(f"chatbot:session:{session_id}", _REDIS_TTL, json.dumps(state))
            return state
        except Exception as e:
            logger.warning("Redis error, falling back to in-memory: %s", e)

    if session_id not in _sessions:
        _sessions[session_id] = _make_initial(session_id)
    return _sessions[session_id]


def update(session_id: str, state: ChatState) -> None:
    client = _get_redis()
    if client:
        try:
            client.setex(f"chatbot:session:{session_id}", _REDIS_TTL, json.dumps(state))
            return
        except Exception as e:
            logger.warning("Redis error, falling back to in-memory: %s", e)
    _sessions[session_id] = state


def delete(session_id: str) -> None:
    client = _get_redis()
    if client:
        try:
            client.delete(f"chatbot:session:{session_id}")
            return
        except Exception as e:
            logger.warning("Redis error, falling back to in-memory: %s", e)
    _sessions.pop(session_id, None)


def new_session_id() -> str:
    return str(uuid.uuid4())
