from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from src.shared.database import get_db
from src.shared.config import get_settings
from src.reservaciones import repository
from src.notifications.email import send_recordatorio

router = APIRouter(prefix="/cron", tags=["cron"])


def _verify_cron_secret(x_cron_secret: str = Header(...)):
    settings = get_settings()
    if not settings.cron_secret or x_cron_secret != settings.cron_secret:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.post("/recordatorios", dependencies=[Depends(_verify_cron_secret)])
def enviar_recordatorios(db: Session = Depends(get_db)):
    pendientes = repository.get_pendientes_recordatorio(db)
    enviados = 0
    for r in pendientes:
        send_recordatorio(
            codigo=r.codigo,
            nombre=r.nombre_cliente,
            email=r.email_cliente,
            terraza=r.terraza.nombre,
            fecha=str(r.fecha),
            hora_inicio=str(r.hora_inicio)[:5],
            hora_fin=str(r.hora_fin)[:5],
        )
        repository.marcar_recordatorio_enviado(db, r.id)
        enviados += 1
    return {"enviados": enviados}
