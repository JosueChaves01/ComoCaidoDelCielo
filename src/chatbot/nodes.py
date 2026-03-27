import json
from datetime import date, time
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, SystemMessage
from src.chatbot.states import ChatState, ReservationInfo
from src.shared.llm import get_llm
from src.shared.database import SessionLocal
from src.terrazas import repository as terraza_repo
from src.reservaciones import service as reservacion_service
from src.reservaciones import repository as reservacion_repo
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
        proximas = reservacion_repo.get_proximas(db, days=14)
    finally:
        db.close()

    # Build occupied slots map: {terraza_nombre: ["YYYY-MM-DD HH:MM–HH:MM", ...]}
    nombre_by_id = {t["id"]: t["nombre"] for t in state["available_terrazas"]}
    occupied: dict[str, list[str]] = {}
    for r in proximas:
        nombre = nombre_by_id.get(r.terraza_id, f"Terraza {r.terraza_id}")
        occupied.setdefault(nombre, []).append(
            f"{r.fecha} {str(r.hora_inicio)[:5]}–{str(r.hora_fin)[:5]}"
        )

    if occupied:
        occupied_str = "\n".join(
            f"  {name}: {', '.join(slots)}" for name, slots in occupied.items()
        )
    else:
        occupied_str = "  (sin reservaciones en los próximos 14 días — todo disponible)"

    llm = get_llm()
    terrazas_desc = "\n".join(
        f"  - ID {t['id']}: {t['nombre']} (cap. {t['capacidad']} personas, ${t['precio_hora']}/hora)"
        for t in state["available_terrazas"]
    )
    current_info = json.dumps(state.get("reservation_info", {}), default=str, ensure_ascii=False)
    conversation = "\n".join(f"{m['role']}: {m['content']}" for m in state["messages"][-6:])

    today_str = date.today().isoformat()
    today_weekday = date.today().strftime("%A")
    system = SystemMessage(content=(
        f"Eres el asistente de reservaciones de 'Como Caído del Cielo'.\n"
        f"Hoy es {today_str} ({today_weekday}).\n\n"
        f"TERRAZAS:\n{terrazas_desc}\n\n"
        f"SLOTS OCUPADOS (próximos 14 días):\n{occupied_str}\n\n"
        f"DATOS YA CONFIRMADOS: {current_info}\n\n"
        "=== COMPORTAMIENTO (sigue el caso que aplique) ===\n\n"
        "CASO A — El cliente NO tiene fecha ni hora definida todavía:\n"
        "  - Sugiere exactamente 2 opciones con fecha ISO y horario concreto.\n"
        "  - Ejemplo de respuesta: 'Tenemos disponibilidad el 2026-04-01 (martes) "
        "de 18:00 a 22:00 en Terraza Jardín, o el 2026-04-03 (jueves) a partir de las 19:00. "
        "¿Cuál te funciona?'\n"
        "  - Filtra por capacidad si el cliente mencionó número de personas.\n"
        "  - NO pidas nombre, email ni todos los campos de una sola vez.\n\n"
        "CASO B — El cliente ya eligió fecha y terraza pero faltan nombre o email:\n"
        "  - Pide únicamente los datos que faltan.\n\n"
        "CASO C — Tienes nombre_cliente, terraza_id, fecha, hora_inicio, hora_fin y num_personas:\n"
        "  - Pon completo=true y confirma el resumen al cliente.\n\n"
        "Responde ÚNICAMENTE con este JSON (sin texto adicional antes ni después):\n"
        '{"nombre_cliente":"","email_cliente":"","terraza_id":0,"fecha":"YYYY-MM-DD",'
        '"hora_inicio":"HH:MM","hora_fin":"HH:MM","num_personas":0,"notas":"",'
        '"completo":false,"respuesta":""}\n'
        "El campo 'respuesta' es el mensaje en español que verá el cliente."
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
