from fastapi import APIRouter, Request
from src.api.schemas import ChatRequest, ChatResponse
from src.api.limiter import limiter
from src.chatbot import session_store
from src.chatbot.graph import get_graph

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
def chat(request: Request, body: ChatRequest):
    state = session_store.get_or_create(body.session_id)
    state["messages"].append({"role": "user", "content": body.message})

    graph = get_graph()
    new_state = graph.invoke(state)

    session_store.update(body.session_id, new_state)

    assistant_messages = [m for m in new_state["messages"] if m["role"] == "assistant"]
    last_response = assistant_messages[-1]["content"] if assistant_messages else ""

    return ChatResponse(
        session_id=body.session_id,
        response=last_response,
        current_state=new_state.get("current_state", "UNKNOWN"),
        intent=new_state.get("intent"),
    )
