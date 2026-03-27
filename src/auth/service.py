from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from src.shared.config import get_settings


def verify_credentials(username: str, password: str) -> bool:
    settings = get_settings()
    return username == settings.admin_username and password == settings.admin_password


def create_access_token(subject: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> str | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        return payload.get("sub")
    except JWTError:
        return None
