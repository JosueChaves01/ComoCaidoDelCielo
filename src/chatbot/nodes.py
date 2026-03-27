import json
from datetime import date, time
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, SystemMessage
from src.chatbot.states import ChatState, ReservationInfo
from src.shared.llm import get_llm
from src.shared.database import SessionLocal
from src.terrazas import repository as terraza_repo
from src.reservaciones import service as reservacion_service
from src.reservaciones.schemas import ReservacionCreate


# ─── helpers ────────────────────────────────────────────────────────────────

def _append_assistant(state: ChatState, content: str) -> ChatState:
    state["messages"].append({"role": "assistant", "content": content})
    return state


def _get_db() -> Session:
    return SessionLocal()


# ─── nodes ──────────────────────────────────────────────────────────────────

def greeting_node(state: ChatState) -> ChatState:
    llm = get_llm()
    user_msg = state["messages"][-1]["content"] if state["messages"] else ""

    system = SystemMessage(content=(
        "Eres el asistente de reservaciones de 'Como Caído del Cielo', un restaurante con terrazas. "
        "Detecta la intención del usuario en su mensaje y responde SOLO con un JSON: "
        '{"intent": "nueva_reserva"|"cancelar"|"consultar", "respuesta": "<saludo breve>"}'
    ))
    response = llm.invoke([system, HumanMessage(content=user_msg)])
    try:
        data = json.loads(response.content)
        state["intent"] = data.get("intent", "nueva_reserva")
        state = _append_assistant(state, data.get("respuesta", "¡Hola! ¿En qué puedo ayudarte?"))
    except (json.JSONDecodeError, AttributeError):
        state["intent"] = "nueva_reserva"
        state = _append_assistant(state, "¡Hola! Bienvenido a Como Caído del Cielo. ¿Te gustaría hacer una reservación?")

    if state["intent"] == "cancelar":
        state["current_state"] = "CANCELLATION"
    else:
        state["current_state"] = "COLLECTING_INFO"
    return state


def collect_info_node(state: ChatState) -> ChatState:
    db = _get_db()
    try:
        terrazas = terraza_repo.get_all(db)
        state["available_terrazas"] = [
            {"id": t.id, "nombre": t.nombre, "capacidad": t.capacidad, "precio_hora": float(t.precio_hora)}
            for t in terrazas
        ]
    finally:
        db.close()

    llm = get_llm()
    terrazas_desc = "\n".join(
        f"  - ID {t['id']}: {t['nombre']} (cap. {t['capacidad']} personas, ${t['precio_hora']}/hora)"
        for t in state["available_terrazas"]
    )
    current_info = json.dumps(state.get("reservation_info", {}), default=str, ensure_ascii=False)
    conversation = "\n".join(f"{m['role']}: {m['content']}" for m in state["messages"][-6:])

    system = SystemMessage(content=(
        f"Eres el asistente de reservaciones de 'Como Caído del Cielo'.\n"
        f"Terrazas disponibles:\n{terrazas_desc}\n\n"
        f"Datos recolectados hasta ahora: {current_info}\n\n"
        "Extrae los datos de reservación del usuario y responde con JSON:\n"
        '{"nombre_cliente": "", "email_cliente": "", "terraza_id": 0, '
        '"fecha": "YYYY-MM-DD", "hora_inicio": "HH:MM", "hora_fin": "HH:MM", '
        '"num_personas": 0, "notas": "", "completo": true|false, "respuesta": ""}\n'
        "Si faltan datos, pon completo=false y pregunta por ellos en 'respuesta'.\n"
        "Si ya tienes todo, pon completo=true."
    ))
    response = llm.invoke([system, HumanMessage(content=conversation)])

    try:
        data = json.loads(response.content)
        info: ReservationInfo = state.get("reservation_info", ReservationInfo())
        for field in ["nombre_cliente", "email_cliente", "terraza_id", "fecha",
                      "hora_inicio", "hora_fin", "num_personas", "notas"]:
            val = data.get(field)
            if val:
                info[field] = val  # type: ignore[literal-required]
        state["reservation_info"] = info
        state = _append_assistant(state, data.get("respuesta", "¿Podrías darme más detalles?"))

        if data.get("completo"):
            state["current_state"] = "CHECKING_AVAILABILITY"
        else:
            state["current_state"] = "COLLECTING_INFO"
    except (json.JSONDecodeError, AttributeError):
        state = _append_assistant(state, "Necesito algunos datos para continuar. ¿Cuál es tu nombre, la fecha y el horario deseado?")
        state["current_state"] = "COLLECTING_INFO"

    return state


def check_availability_node(state: ChatState) -> ChatState:
    info = state.get("reservation_info", {})
    db = _get_db()
    try:
        result = reservacion_service.check_availability(
            db=db,
            terraza_id=int(info.get("terraza_id", 0)),
            fecha=date.fromisoformat(info.get("fecha", "")),
            hora_inicio=time.fromisoformat(info.get("hora_inicio", "")),
            hora_fin=time.fromisoformat(info.get("hora_fin", "")),
        )
    except Exception as e:
        state["last_error"] = str(e)
        state["current_state"] = "ERROR"
        state = _append_assistant(state, f"Hubo un error al verificar disponibilidad: {e}")
        return state
    finally:
        db.close()

    if result.disponible:
        state["current_state"] = "CONFIRMING"
        state = _append_assistant(state, result.mensaje + " ¿Confirmas la reservación?")
        state["confirmation_pending"] = True
    else:
        state["current_state"] = "COLLECTING_INFO"
        state = _append_assistant(
            state,
            result.mensaje + " Por favor elige otro horario o terraza.",
        )
    return state


def confirm_node(state: ChatState) -> ChatState:
    info = state.get("reservation_info", {})
    resumen = (
        f"Resumen de tu reservación:\n"
        f"  Nombre: {info.get('nombre_cliente', '-')}\n"
        f"  Email: {info.get('email_cliente', '-')}\n"
        f"  Terraza ID: {info.get('terraza_id', '-')}\n"
        f"  Fecha: {info.get('fecha', '-')}\n"
        f"  Horario: {info.get('hora_inicio', '-')} - {info.get('hora_fin', '-')}\n"
        f"  Personas: {info.get('num_personas', '-')}\n"
        "¿Confirmamos? Responde 'sí' o 'no'."
    )
    state = _append_assistant(state, resumen)
    state["confirmation_pending"] = True
    state["current_state"] = "CONFIRMING"
    return state


def booking_node(state: ChatState) -> ChatState:
    info = state.get("reservation_info", {})
    db = _get_db()
    try:
        data = ReservacionCreate(
            nombre_cliente=info.get("nombre_cliente", ""),
            email_cliente=info.get("email_cliente") or None,
            terraza_id=int(info.get("terraza_id", 0)),
            fecha=date.fromisoformat(info.get("fecha", "")),
            hora_inicio=time.fromisoformat(info.get("hora_inicio", "")),
            hora_fin=time.fromisoformat(info.get("hora_fin", "")),
            num_personas=int(info.get("num_personas", 0)),
            notas=info.get("notas") or None,
        )
        reservacion = reservacion_service.create(db, data)
        state = _append_assistant(
            state,
            f"¡Reservación confirmada! Tu código es **{reservacion.codigo}**. "
            f"Guárdalo para futuras referencias.",
        )
        state["current_state"] = "COMPLETED"
        state["confirmation_pending"] = False
    except Exception as e:
        state["last_error"] = str(e)
        state["current_state"] = "ERROR"
        state = _append_assistant(state, f"No se pudo completar la reservación: {e}")
    finally:
        db.close()
    return state


def cancellation_node(state: ChatState) -> ChatState:
    info = state.get("reservation_info", {})
    codigo = info.get("codigo_cancelacion", "")

    if not codigo:
        last_msg = state["messages"][-1]["content"] if state["messages"] else ""
        import re
        match = re.search(r"RES-\d+", last_msg.upper())
        if match:
            codigo = match.group(0)
            info["codigo_cancelacion"] = codigo
            state["reservation_info"] = info

    if not codigo:
        state = _append_assistant(state, "Por favor proporciona el código de reservación (ej. RES-00001).")
        state["current_state"] = "CANCELLATION"
        return state

    db = _get_db()
    try:
        reservacion_service.cancel(db, codigo)
        state = _append_assistant(state, f"La reservación **{codigo}** ha sido cancelada exitosamente.")
        state["current_state"] = "COMPLETED"
    except Exception as e:
        state["last_error"] = str(e)
        state = _append_assistant(state, f"No se pudo cancelar: {e}")
        state["current_state"] = "ERROR"
    finally:
        db.close()
    return state


def error_node(state: ChatState) -> ChatState:
    state = _append_assistant(
        state,
        "Lo siento, ocurrió un error. Por favor intenta de nuevo.",
    )
    state["current_state"] = "COLLECTING_INFO"
    state["last_error"] = None
    return state
