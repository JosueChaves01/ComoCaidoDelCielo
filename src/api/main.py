from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.shared.config import get_settings
from src.shared.database import Base, engine
from src.api.routes import chat, reservaciones, disponibilidad, auth, terrazas, admin_stats

# Import models so SQLAlchemy registers them before create_all
import src.terrazas.models  # noqa: F401
import src.reservaciones.models  # noqa: F401

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (dev convenience; use alembic in production)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Como Caído del Cielo — API de Reservaciones",
    description="Chatbot con LangGraph + FastAPI para reservar terrazas.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router, tags=["chat"])
app.include_router(reservaciones.router)
app.include_router(disponibilidad.router)
app.include_router(terrazas.router)
app.include_router(admin_stats.router)


@app.get("/health")
def health():
    return {"status": "ok"}
