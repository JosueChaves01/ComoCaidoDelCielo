from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.shared.database import get_db
from src.shared.config import get_settings
from src.reservaciones import repository

router = APIRouter(prefix="/pagos", tags=["pagos"])


class CheckoutRequest(BaseModel):
    codigo: str


def _stripe():
    import stripe
    stripe.api_key = get_settings().stripe_secret_key
    return stripe


@router.post("/checkout")
def crear_checkout(body: CheckoutRequest, db: Session = Depends(get_db)):
    settings = get_settings()
    if not settings.stripe_secret_key:
        raise HTTPException(503, "Pagos no configurados")

    reservacion = repository.get_by_codigo(db, body.codigo.upper())
    if not reservacion:
        raise HTTPException(404, "Reservación no encontrada")
    if reservacion.estado == "cancelada":
        raise HTTPException(400, "La reservación está cancelada")

    inicio = datetime.combine(reservacion.fecha, reservacion.hora_inicio)
    fin = datetime.combine(reservacion.fecha, reservacion.hora_fin)
    horas = (fin - inicio).total_seconds() / 3600
    monto_centavos = int(float(reservacion.terraza.precio_hora) * horas * 100)

    stripe = _stripe()
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "mxn",
                "product_data": {
                    "name": reservacion.terraza.nombre,
                    "description": (
                        f"Reservación {reservacion.codigo} · {reservacion.fecha} · "
                        f"{str(reservacion.hora_inicio)[:5]}–{str(reservacion.hora_fin)[:5]}"
                    ),
                },
                "unit_amount": monto_centavos,
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url=f"{settings.frontend_url}/chat?pago=exitoso&codigo={reservacion.codigo}",
        cancel_url=f"{settings.frontend_url}/chat?pago=cancelado",
        metadata={"codigo": reservacion.codigo},
    )
    return {"checkout_url": session.url, "session_id": session.id}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    settings = get_settings()
    if not settings.stripe_secret_key:
        raise HTTPException(503, "Pagos no configurados")

    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")

    stripe = _stripe()
    try:
        event = stripe.Webhook.construct_event(payload, sig, settings.stripe_webhook_secret)
    except Exception:
        raise HTTPException(400, "Webhook inválido")

    if event["type"] == "checkout.session.completed":
        checkout = event["data"]["object"]
        codigo = checkout.get("metadata", {}).get("codigo")
        if codigo:
            reservacion = repository.get_by_codigo(db, codigo)
            if reservacion and reservacion.estado == "pendiente":
                reservacion.estado = "confirmada"
                db.commit()

    return {"received": True}
