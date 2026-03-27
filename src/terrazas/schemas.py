from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TerrazaCreate(BaseModel):
    nombre: str
    capacidad: int
    precio_hora: Decimal
    descripcion: Optional[str] = None
    activa: bool = True


class TerrazaUpdate(BaseModel):
    nombre: Optional[str] = None
    capacidad: Optional[int] = None
    precio_hora: Optional[Decimal] = None
    descripcion: Optional[str] = None
    activa: Optional[bool] = None


class TerrazaResponse(BaseModel):
    id: int
    nombre: str
    capacidad: int
    precio_hora: Decimal
    descripcion: str | None
    activa: bool
    created_at: datetime

    model_config = {"from_attributes": True}
