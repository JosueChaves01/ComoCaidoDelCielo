from sqlalchemy import Boolean, Column, Integer, Numeric, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from src.shared.database import Base


class Terraza(Base):
    __tablename__ = "terrazas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    capacidad = Column(Integer, nullable=False)
    precio_hora = Column(Numeric(10, 2), nullable=False)
    descripcion = Column(Text, nullable=True)
    activa = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
