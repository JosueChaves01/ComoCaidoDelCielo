from src.chatbot.states import ChatState


def route_after_greeting(state: ChatState) -> str:
    intent = state.get("intent", "nueva_reserva")
    if intent == "cancelar":
        return "cancellation"
    return "collect_info"


def route_after_collect(state: ChatState) -> str:
    if state.get("current_state") == "CHECKING_AVAILABILITY":
        return "check_availability"
    return "collect_info"


def route_after_check(state: ChatState) -> str:
    cs = state.get("current_state")
    if cs == "CONFIRMING":
        return "confirm"
    if cs == "ERROR":
        return "error"
    return "collect_info"


def route_after_confirm(state: ChatState) -> str:
    last_msg = state["messages"][-1]["content"].lower() if state["messages"] else ""
    # Check the second-to-last message (last assistant) vs latest user
    user_messages = [m for m in state["messages"] if m["role"] == "user"]
    if user_messages:
        last_user = user_messages[-1]["content"].lower()
        if any(w in last_user for w in ["sí", "si", "confirmo", "yes", "ok", "dale"]):
            return "booking"
        if any(w in last_user for w in ["no", "cancelar", "cancel"]):
            return "collect_info"
    return "confirm"


def route_after_booking(state: ChatState) -> str:
    cs = state.get("current_state")
    if cs == "ERROR":
        return "error"
    return "end"


def route_after_error(state: ChatState) -> str:
    return "collect_info"
