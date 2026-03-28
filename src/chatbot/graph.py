from langgraph.graph import StateGraph, END
from src.chatbot.states import ChatState
from src.chatbot.nodes import (
    greeting_node,
    collect_info_node,
    check_availability_node,
    confirm_node,
    booking_node,
    cancellation_node,
    availability_consult_node,
    error_node,
)
from src.chatbot.edges import (
    route_after_greeting,
    route_after_collect,
    route_after_check,
    route_after_confirm,
    route_after_booking,
)


def build_graph() -> StateGraph:
    graph = StateGraph(ChatState)

    graph.add_node("greeting", greeting_node)
    graph.add_node("collect_info", collect_info_node)
    graph.add_node("check_availability", check_availability_node)
    graph.add_node("confirm", confirm_node)
    graph.add_node("booking", booking_node)
    graph.add_node("cancellation", cancellation_node)
    graph.add_node("availability_consult", availability_consult_node)
    graph.add_node("error", error_node)

    graph.set_entry_point("greeting")

    graph.add_conditional_edges(
        "greeting",
        route_after_greeting,
        {
            "cancellation": "cancellation",
            "collect_info": "collect_info",
            "availability_consult": "availability_consult",
        },
    )
    graph.add_conditional_edges(
        "collect_info",
        route_after_collect,
        {"check_availability": "check_availability", "collect_info": END},
    )
    graph.add_conditional_edges(
        "check_availability",
        route_after_check,
        {"confirm": "confirm", "collect_info": END, "error": "error"},
    )
    graph.add_conditional_edges(
        "confirm",
        route_after_confirm,
        {"booking": "booking", "collect_info": END, "confirm": END},
    )
    graph.add_conditional_edges(
        "booking",
        route_after_booking,
        {"error": "error", "end": END},
    )
    graph.add_edge("cancellation", END)
    graph.add_edge("availability_consult", END)
    graph.add_edge("error", END)

    return graph


_compiled_graph = None


def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph().compile()
    return _compiled_graph
