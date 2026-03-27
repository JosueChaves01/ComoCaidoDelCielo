from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class TerrazaResponse(BaseModel):
    id: int
    nombre: str
    capacidad: int
    precio_hora: Decimal
    descripcion: str | None
    activa: bool
    created_at: datetime

    model_config = {"from_attributes": True}
