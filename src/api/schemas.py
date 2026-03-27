from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    response: str
    current_state: str
    intent: Optional[str] = None
