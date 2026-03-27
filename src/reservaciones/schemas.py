from datetime import date, time, datetime
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, field_validator


EstadoReservacion = Literal["pendiente", "confirmada", "cancelada", "completada"]


class ReservacionCreate(BaseModel):
    nombre_cliente: str
    email_cliente: Optional[str] = None
    terraza_id: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    num_personas: int
    notas: Optional[str] = None

    @field_validator("hora_fin")
    @classmethod
    def hora_fin_after_inicio(cls, v, info):
        if "hora_inicio" in info.data and v <= info.data["hora_inicio"]:
            raise ValueError("hora_fin debe ser posterior a hora_inicio")
        return v


class ReservacionResponse(BaseModel):
    id: int
    codigo: str
    nombre_cliente: str
    email_cliente: Optional[str]
    terraza_id: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    num_personas: int
    estado: EstadoReservacion
    notas: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class AvailabilityRequest(BaseModel):
    terraza_id: int
    fecha: date
    hora_inicio: time
    hora_fin: time


class AvailabilityResponse(BaseModel):
    disponible: bool
    mensaje: str
    conflictos: list[str] = []


class OcupacionTerraza(BaseModel):
    terraza_id: int
    nombre: str
    total_reservaciones: int


class DashboardStats(BaseModel):
    reservaciones_hoy: int
    reservaciones_semana: int
    ingresos_estimados_semana: float
    ocupacion_por_terraza: list[OcupacionTerraza]
