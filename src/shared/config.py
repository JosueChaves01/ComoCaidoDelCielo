from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "sqlite:///./test.db"
    openrouter_api_key: str = ""
    openrouter_model: str = "mistralai/mistral-7b-instruct:free"
    secret_key: str = "dev-secret-key"
    environment: str = "development"
    allowed_origins: str = "http://localhost:3000"
    admin_username: str = "admin"
    admin_password: str = ""
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480
    resend_api_key: str = ""
    resend_from_email: str = "reservaciones@comocaidodelcielo.com"
    cron_secret: str = ""
    redis_url: str = ""
    sentry_dsn: str = ""
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    frontend_url: str = "http://localhost:3000"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
