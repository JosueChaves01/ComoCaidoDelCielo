from typing import Literal, Optional
from typing_extensions import TypedDict


ConversationState = Literal[
    "GREETING",
    "COLLECTING_INFO",
    "CHECKING_AVAILABILITY",
    "CONFIRMING",
    "BOOKING",
    "COMPLETED",
    "CANCELLATION",
    "CONSULTING",
    "ERROR",
]


class ReservationInfo(TypedDict, total=False):
    nombre_cliente: str
    email_cliente: str
    terraza_id: int
    fecha: str          # ISO format: YYYY-MM-DD
    hora_inicio: str    # HH:MM
    hora_fin: str       # HH:MM
    num_personas: int
    notas: str
    codigo_cancelacion: str  # para flujo de cancelación


class ChatState(TypedDict):
    session_id: str
    messages: list[dict]           # {"role": "user"|"assistant", "content": str}
    current_state: ConversationState
    reservation_info: ReservationInfo
    available_terrazas: list[dict]
    confirmation_pending: bool
    last_error: Optional[str]
    intent: Optional[str]          # "nueva_reserva" | "cancelar" | "consultar"
