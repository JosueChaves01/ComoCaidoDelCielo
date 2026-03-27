import logging
from src.shared.config import get_settings

logger = logging.getLogger(__name__)


def _get_client():
    import resend
    settings = get_settings()
    resend.api_key = settings.resend_api_key
    return resend


def _html_confirmacion(codigo: str, nombre: str, terraza: str, fecha: str, hora_inicio: str, hora_fin: str, personas: int) -> str:
    return f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;color:#1c1c1c;max-width:520px;margin:0 auto;padding:24px">
  <h2 style="color:#1c4a35">¡Reservación confirmada!</h2>
  <p>Hola <strong>{nombre}</strong>, tu reservación en <em>Como Caído del Cielo</em> está confirmada.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr style="background:#f5f5f5">
      <td style="padding:8px 12px;font-weight:bold">Código</td>
      <td style="padding:8px 12px;font-family:monospace;font-size:18px;color:#1c4a35">{codigo}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;font-weight:bold">Terraza</td>
      <td style="padding:8px 12px">{terraza}</td>
    </tr>
    <tr style="background:#f5f5f5">
      <td style="padding:8px 12px;font-weight:bold">Fecha</td>
      <td style="padding:8px 12px">{fecha}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;font-weight:bold">Horario</td>
      <td style="padding:8px 12px">{hora_inicio} – {hora_fin}</td>
    </tr>
    <tr style="background:#f5f5f5">
      <td style="padding:8px 12px;font-weight:bold">Personas</td>
      <td style="padding:8px 12px">{personas}</td>
    </tr>
  </table>
  <p style="color:#666;font-size:13px">Guarda tu código para consultar o cancelar tu reservación.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="color:#aaa;font-size:12px">Como Caído del Cielo · reservaciones@comocaidodelcielo.com</p>
</body>
</html>
"""


def _html_recordatorio(codigo: str, nombre: str, terraza: str, fecha: str, hora_inicio: str, hora_fin: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;color:#1c1c1c;max-width:520px;margin:0 auto;padding:24px">
  <h2 style="color:#1c4a35">Recordatorio: tu reservación es mañana</h2>
  <p>Hola <strong>{nombre}</strong>, te recordamos que mañana tienes una reservación en <em>Como Caído del Cielo</em>.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr style="background:#f5f5f5">
      <td style="padding:8px 12px;font-weight:bold">Código</td>
      <td style="padding:8px 12px;font-family:monospace;color:#1c4a35">{codigo}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;font-weight:bold">Terraza</td>
      <td style="padding:8px 12px">{terraza}</td>
    </tr>
    <tr style="background:#f5f5f5">
      <td style="padding:8px 12px;font-weight:bold">Fecha</td>
      <td style="padding:8px 12px">{fecha}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;font-weight:bold">Horario</td>
      <td style="padding:8px 12px">{hora_inicio} – {hora_fin}</td>
    </tr>
  </table>
  <p style="color:#666;font-size:13px">Si necesitas cancelar, hazlo con tu código de reservación.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="color:#aaa;font-size:12px">Como Caído del Cielo · reservaciones@comocaidodelcielo.com</p>
</body>
</html>
"""


def send_confirmacion(
    codigo: str,
    nombre: str,
    email: str,
    terraza: str,
    fecha: str,
    hora_inicio: str,
    hora_fin: str,
    personas: int,
) -> None:
    settings = get_settings()
    if not settings.resend_api_key:
        logger.info("RESEND_API_KEY no configurado — email de confirmación omitido")
        return
    try:
        resend = _get_client()
        resend.Emails.send({
            "from": settings.resend_from_email,
            "to": [email],
            "subject": f"Reservación confirmada · {codigo}",
            "html": _html_confirmacion(codigo, nombre, terraza, fecha, hora_inicio, hora_fin, personas),
        })
        logger.info("Email de confirmación enviado a %s (%s)", email, codigo)
    except Exception as exc:
        logger.error("Error enviando email de confirmación para %s: %s", codigo, exc)


def send_recordatorio(
    codigo: str,
    nombre: str,
    email: str,
    terraza: str,
    fecha: str,
    hora_inicio: str,
    hora_fin: str,
) -> None:
    settings = get_settings()
    if not settings.resend_api_key:
        logger.info("RESEND_API_KEY no configurado — recordatorio omitido")
        return
    try:
        resend = _get_client()
        resend.Emails.send({
            "from": settings.resend_from_email,
            "to": [email],
            "subject": f"Recordatorio: tu reservación mañana · {codigo}",
            "html": _html_recordatorio(codigo, nombre, terraza, fecha, hora_inicio, hora_fin),
        })
        logger.info("Recordatorio enviado a %s (%s)", email, codigo)
    except Exception as exc:
        logger.error("Error enviando recordatorio para %s: %s", codigo, exc)
