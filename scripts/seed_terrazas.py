"""
Seed script: inserts the 3 initial terrazas.
Run with: python scripts/seed_terrazas.py
Or on Railway: railway run python scripts/seed_terrazas.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.shared.database import SessionLocal, Base, engine
from src.terrazas.models import Terraza

TERRAZAS = [
    {
        "nombre": "Terraza Jardín",
        "capacidad": 30,
        "precio_hora": 800.00,
        "descripcion": "Terraza al aire libre rodeada de vegetación, ideal para eventos íntimos.",
    },
    {
        "nombre": "Terraza Vista al Mar",
        "capacidad": 50,
        "precio_hora": 1500.00,
        "descripcion": "Terraza con vista panorámica al mar, perfecta para celebraciones grandes.",
    },
    {
        "nombre": "Terraza Privada VIP",
        "capacidad": 12,
        "precio_hora": 600.00,
        "descripcion": "Terraza techada con ambiente exclusivo para reuniones privadas.",
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Terraza).count()
        if existing > 0:
            print(f"Ya existen {existing} terrazas. Saltando seed.")
            return

        for data in TERRAZAS:
            terraza = Terraza(**data)
            db.add(terraza)
        db.commit()
        print(f"✓ {len(TERRAZAS)} terrazas insertadas exitosamente.")
    except Exception as e:
        db.rollback()
        print(f"Error al insertar terrazas: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
