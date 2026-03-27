from sqlalchemy import (
    Column, Integer, String, Date, Time, Text, TIMESTAMP, Boolean, ForeignKey, CheckConstraint
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.shared.database import Base


class Reservacion(Base):
    __tablename__ = "reservaciones"
    __table_args__ = (
        CheckConstraint(
            "estado IN ('pendiente','confirmada','cancelada','completada')",
            name="ck_reservaciones_estado",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(10), nullable=False, unique=True, index=True)
    nombre_cliente = Column(String(150), nullable=False)
    email_cliente = Column(String(200), nullable=True)
    terraza_id = Column(Integer, ForeignKey("terrazas.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    num_personas = Column(Integer, nullable=False)
    estado = Column(String(20), nullable=False, default="confirmada")
    notas = Column(Text, nullable=True)
    recordatorio_enviado = Column(Boolean, nullable=False, server_default="false", default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    terraza = relationship("Terraza", backref="reservaciones")
