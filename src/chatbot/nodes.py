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
        '{"intent": "nueva_reserva"|"cancelar"|"consultar", "respuesta": "<saludo breve>"} '
        "Usa 'consultar' cuando el usuario pregunta por disponibilidad, horarios o qué terrazas hay libres, "
        "sin haber pedido aún hacer una reservación."
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
    elif state["intent"] == "consultar":
        state["current_state"] = "CONSULTING"
    else:
        state["current_state"] = "COLLECTING_INFO"
    return state


def _build_available_slots(
    terrazas: list[dict],
    occupied: dict[str, list[str]],
    num_personas: int,
    today: date,
) -> list[dict]:
    """Return up to 4 available slot suggestions for the next 7 days."""
    from datetime import timedelta

    DEFAULT_SLOTS = [("18:00", "22:00"), ("13:00", "16:00"), ("19:00", "23:00"), ("12:00", "15:00")]
    suggestions = []
    for delta in range(1, 8):
        candidate = (today + timedelta(days=delta)).isoformat()
        for t in terrazas:
            if num_personas and t["capacidad"] < num_personas:
                continue
            nombre = t["nombre"]
            for hora_inicio, hora_fin in DEFAULT_SLOTS:
                slot_str = f"{candidate} {hora_inicio}–{hora_fin}"
                occupied_slots = occupied.get(nombre, [])
                conflict = any(candidate in s for s in occupied_slots)
                if not conflict:
                    suggestions.append({
                        "terraza_id": t["id"],
                        "terraza_nombre": nombre,
                        "fecha": candidate,
                        "hora_inicio": hora_inicio,
                        "hora_fin": hora_fin,
                    })
                if len(suggestions) >= 4:
                    return suggestions
    return suggestions


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

    info: ReservationInfo = state.get("reservation_info", ReservationInfo())
    has_date = bool(info.get("fecha"))
    has_time = bool(info.get("hora_inicio"))
    num_personas = int(info.get("num_personas") or 0)

    llm = get_llm()
    terrazas_desc = "\n".join(
        f"  - ID {t['id']}: {t['nombre']} (cap. {t['capacidad']} personas, ${t['precio_hora']}/hora)"
        for t in state["available_terrazas"]
    )
    current_info = json.dumps(info, default=str, ensure_ascii=False)
    conversation = "\n".join(f"{m['role']}: {m['content']}" for m in state["messages"][-6:])
    today = date.today()
    today_str = today.isoformat()
    today_weekday = today.strftime("%A")

    import re as _re
    _DATE_RE = _re.compile(r"\b(\d{4}-\d{2}-\d{2})\b")
    _TIME_RE_MSG = _re.compile(r"\b(\d{1,2}:\d{2})\b")

    # Check last user message for an explicit ISO date — if found, skip CASO A
    last_user_msg = next(
        (m["content"] for m in reversed(state["messages"]) if m["role"] == "user"), ""
    )
    msg_has_date = bool(_DATE_RE.search(last_user_msg))

    # ── CASO A: no date/time confirmed yet AND user didn't provide one ────────
    if (not has_date or not has_time) and not msg_has_date:
        slots = _build_available_slots(
            state["available_terrazas"], occupied, num_personas, today
        )
        if slots:
            weekdays_es = {
                "Monday": "lunes", "Tuesday": "martes", "Wednesday": "miércoles",
                "Thursday": "jueves", "Friday": "viernes",
                "Saturday": "sábado", "Sunday": "domingo",
            }
            from datetime import datetime as dt
            lines = []
            for i, s in enumerate(slots[:2]):
                d = dt.fromisoformat(s["fecha"])
                dia = weekdays_es.get(d.strftime("%A"), d.strftime("%A"))
                lines.append(
                    f"• {s['terraza_nombre']} — {dia} {s['fecha']} de {s['hora_inicio']} a {s['hora_fin']}"
                )
            reply = (
                "¡Con gusto! Tenemos estas opciones disponibles:\n"
                + "\n".join(lines)
                + "\n¿Cuál de las dos te funciona mejor?"
            )
        else:
            reply = "Tenemos disponibilidad esta semana. ¿Qué fecha y horario te vienen mejor?"
        state = _append_assistant(state, reply)
        state["reservation_info"] = info
        state["current_state"] = "COLLECTING_INFO"
        return state

    # ── CASO B / C: date confirmed → collect remaining fields via JSON ────────
    system = SystemMessage(content=(
        f"Eres el asistente de reservaciones de 'Como Caído del Cielo'.\n"
        f"Hoy es {today_str} ({today_weekday}).\n\n"
        f"TERRAZAS:\n{terrazas_desc}\n\n"
        f"DATOS YA CONFIRMADOS: {current_info}\n\n"
        "Pide SOLO el dato que falta (nombre, terraza, hora o personas). Un campo a la vez.\n"
        "Si tienes nombre_cliente, terraza_id, fecha, hora_inicio, hora_fin y num_personas: "
        "pon completo=true y confirma el resumen.\n\n"
        "Responde ÚNICAMENTE con este JSON (sin texto adicional antes ni después):\n"
        '{"nombre_cliente":"","email_cliente":"","terraza_id":0,"fecha":"YYYY-MM-DD",'
        '"hora_inicio":"HH:MM","hora_fin":"HH:MM","num_personas":0,"notas":"",'
        '"completo":false,"respuesta":""}\n'
        "El campo 'respuesta' es el mensaje en español que verá el cliente."
    ))
    response = llm.invoke([system, HumanMessage(content=conversation)])

    try:
        data = json.loads(response.content)
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
        state = _append_assistant(state, "¿Cuál es tu nombre para la reservación?")
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


def availability_consult_node(state: ChatState) -> ChatState:
    """Handle availability consultation without committing to a reservation."""
    import re
    from datetime import timedelta, datetime as dt

    db = _get_db()
    try:
        terrazas = terraza_repo.get_all(db)
        terrazas_list = [
            {"id": t.id, "nombre": t.nombre, "capacidad": t.capacidad}
            for t in terrazas
        ]
        proximas = reservacion_repo.get_proximas(db, days=30)
    finally:
        db.close()

    # Build occupied map: {fecha_iso: {terraza_nombre: ["HH:MM–HH:MM", ...]}}
    nombre_by_id = {t["id"]: t["nombre"] for t in terrazas_list}
    occupied: dict[str, dict[str, list[str]]] = {}
    for r in proximas:
        fecha_str = str(r.fecha)
        nombre = nombre_by_id.get(r.terraza_id, f"Terraza {r.terraza_id}")
        occupied.setdefault(fecha_str, {}).setdefault(nombre, []).append(
            f"{str(r.hora_inicio)[:5]}–{str(r.hora_fin)[:5]}"
        )

    last_user_msg = next(
        (m["content"] for m in reversed(state["messages"]) if m["role"] == "user"), ""
    )
    msg_lower = last_user_msg.lower()
    today = date.today()

    WEEKDAY_MAP = {
        "lunes": 0, "martes": 1, "miércoles": 2, "miercoles": 2,
        "jueves": 3, "viernes": 4, "sábado": 5, "sabado": 5, "domingo": 6,
    }
    WEEKDAY_ES = {0: "lunes", 1: "martes", 2: "miércoles", 3: "jueves",
                  4: "viernes", 5: "sábado", 6: "domingo"}
    DEFAULT_SLOTS = [("12:00", "15:00"), ("16:00", "19:00"), ("18:00", "22:00"), ("20:00", "23:00")]

    # Resolve target dates from user message
    dates_to_show: list[date] = []

    iso_dates = re.findall(r'\b(\d{4}-\d{2}-\d{2})\b', last_user_msg)
    if iso_dates:
        for d in iso_dates[:3]:
            try:
                dates_to_show.append(date.fromisoformat(d))
            except ValueError:
                pass

    if not dates_to_show:
        for day_name, day_num in WEEKDAY_MAP.items():
            if day_name in msg_lower:
                days_ahead = (day_num - today.weekday()) % 7 or 7
                # "la semana que viene" or "próxima" shifts by +7
                if any(w in msg_lower for w in ["próxima", "proxima", "que viene", "siguiente"]):
                    days_ahead += 7
                dates_to_show.append(today + timedelta(days=days_ahead))

    if not dates_to_show:
        if "fin de semana" in msg_lower:
            sat_ahead = (5 - today.weekday()) % 7 or 7
            if any(w in msg_lower for w in ["próximo", "proximo", "que viene", "siguiente"]):
                sat_ahead += 7
            dates_to_show = [today + timedelta(days=sat_ahead),
                             today + timedelta(days=sat_ahead + 1)]
        elif any(w in msg_lower for w in ["mañana", "manana"]):
            dates_to_show = [today + timedelta(days=1)]
        elif "hoy" in msg_lower:
            dates_to_show = [today]
        elif "pasado" in msg_lower:
            dates_to_show = [today + timedelta(days=2)]

    # No specific dates found → ask for clarification
    if not dates_to_show:
        reply = (
            "¡Claro! Tenemos bastante disponibilidad. "
            "¿Qué días específicos te gustaría consultar? "
            "Puedes decirme por ejemplo 'el sábado', 'martes y jueves', o una fecha exacta como '2026-04-05', "
            "y te muestro los horarios libres de cada terraza."
        )
        state = _append_assistant(state, reply)
        state["current_state"] = "CONSULTING"
        return state

    # Build availability response for the resolved dates
    lines = []
    for d in sorted(set(dates_to_show)):
        fecha_str = d.isoformat()
        dia = WEEKDAY_ES[d.weekday()]
        lines.append(f"\n📅 {dia.capitalize()} {fecha_str}:")

        any_free = False
        for t in terrazas_list:
            occ_slots = occupied.get(fecha_str, {}).get(t["nombre"], [])

            # Parse occupied intervals for conflict check
            def _to_minutes(hhmm: str) -> int:
                h, m = hhmm.split(":")
                return int(h) * 60 + int(m)

            occ_intervals = []
            for s in occ_slots:
                start_str, end_str = s.split("–")
                occ_intervals.append((_to_minutes(start_str), _to_minutes(end_str)))

            free_slots = []
            for slot_start, slot_end in DEFAULT_SLOTS:
                s_min, e_min = _to_minutes(slot_start), _to_minutes(slot_end)
                conflict = any(s_min < oe and e_min > os for os, oe in occ_intervals)
                if not conflict:
                    free_slots.append(f"{slot_start}–{slot_end}")

            if free_slots:
                any_free = True
                lines.append(f"  ✅ {t['nombre']} (cap. {t['capacidad']}): {', '.join(free_slots)}")
            else:
                lines.append(f"  ❌ {t['nombre']}: sin disponibilidad")

        if not any_free:
            lines.append("  (sin terrazas libres ese día)")

    cta = "\n\n¿Te gustaría reservar alguno de estos horarios? Solo dime y te ayudo."
    reply = "¡Aquí tienes la disponibilidad!" + "".join(lines) + cta

    # If user now wants to book, transition to reservation flow
    if any(w in msg_lower for w in ["reservar", "reserva", "apartar", "quiero ese"]):
        state["current_state"] = "COLLECTING_INFO"
    else:
        state["current_state"] = "CONSULTING"

    state = _append_assistant(state, reply)
    return state


def error_node(state: ChatState) -> ChatState:
    state = _append_assistant(
        state,
        "Lo siento, ocurrió un error. Por favor intenta de nuevo.",
    )
    state["current_state"] = "COLLECTING_INFO"
    state["last_error"] = None
    return state
