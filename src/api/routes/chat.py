from fastapi import APIRouter
from src.api.schemas import ChatRequest, ChatResponse
from src.chatbot import session_store
from src.chatbot.graph import get_graph

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    state = session_store.get_or_create(request.session_id)
    state["messages"].append({"role": "user", "content": request.message})

    graph = get_graph()
    new_state = graph.invoke(state)

    session_store.update(request.session_id, new_state)

    assistant_messages = [m for m in new_state["messages"] if m["role"] == "assistant"]
    last_response = assistant_messages[-1]["content"] if assistant_messages else ""

    return ChatResponse(
        session_id=request.session_id,
        response=last_response,
        current_state=new_state.get("current_state", "UNKNOWN"),
        intent=new_state.get("intent"),
    )
