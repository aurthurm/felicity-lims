import os
from typing import Any

from pydantic import AnyHttpUrl , EmailStr, HttpUrl, validator
from pydantic_settings import BaseSettings


def getenv_boolean(var_name, default_value=False):
    result = default_value
    env_value = os.getenv(var_name)
    if env_value is not None:
        result = env_value.upper() in ("TRUE", "1")
    return result


def getenv_value(value, default_value=None):
    env_value = os.getenv(value)
    if env_value is None:
        env_value = default_value
    return env_value


class Settings(BaseSettings):
    BASE_DIR: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), ".."))

    STATIC_DIR: str = os.path.join(BASE_DIR, "static")

    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = (
        # secrets.token_urlsafe(32)
        "uIM7aXFRzaIxWr1NEy_RMQg9iIuDkLAlkOPs5zpgbts"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 16
    SERVER_NAME: str = getenv_value("SERVER_NAME", "felicity")
    SERVER_HOST: AnyHttpUrl = getenv_value("SERVER_HOST", "https://localhost")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
    ]
    CORS_SUPPORTS_CREDENTIALS: bool = True
    CORS_ALLOW_HEADERS: list[str] = [
        'Authorization', 'access-control-allow-methods', 'content-type', 
        'access-control-allow-origin', 'access-control-allow-headers'
    ]
    
    TESTING: bool = getenv_boolean("TESTING", False)
    RETAIN_TESTING_DB_DATA: bool = getenv_boolean("RETAIN_TESTING_DB_DATA", True)

    PROJECT_NAME: str = getenv_value("PROJECT_NAME", "FELLICITY LIMS")
    SENTRY_DSN: HttpUrl | None = getenv_value("SENTRY_DSN", "")

    @validator("SENTRY_DSN", pre=True)
    def sentry_dsn_can_be_blank(cls, v: str) -> str | None:
        if len(v) == 0:
            return None
        return v

    POSTGRES_SERVER: str = getenv_value("POSTGRES_SERVER", "localhost") # felicity_db
    POSTGRES_USER: str = getenv_value("POSTGRES_USER", "felicity")
    POSTGRES_PASSWORD: str = getenv_value("POSTGRES_PASSWORD", "felicity")
    POSTGRES_DB: str = getenv_value("POSTGRES_DB", "felicity_lims")
    SQLALCHEMY_DATABASE_URI: str | None = None
    SQLALCHEMY_ASYNC_DATABASE_URI: str | None = None
    SQLALCHEMY_TEST_DATABASE_URI: str | None = None
    SQLALCHEMY_TEST_ASYNC_DATABASE_URI: str | None = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str | None, values: dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return f'postgresql://{values.get("POSTGRES_USER")}:{values.get("POSTGRES_PASSWORD")}@{values.get("POSTGRES_SERVER")}/{values.get("POSTGRES_DB") or ""}'

    @validator("SQLALCHEMY_ASYNC_DATABASE_URI", pre=True)
    def assemble_async_db_connection(
        cls, v: str | None, values: dict[str, Any]
    ) -> Any:
        if isinstance(v, str):
            return v
        return f'postgresql+asyncpg://{values.get("POSTGRES_USER")}:{values.get("POSTGRES_PASSWORD")}@{values.get("POSTGRES_SERVER")}/{values.get("POSTGRES_DB") or ""}'

    @validator("SQLALCHEMY_TEST_DATABASE_URI", pre=True)
    def assemble_test_db_connection(
        cls, v: str | None, values: dict[str, Any]
    ) -> Any:
        if isinstance(v, str):
            return v
        return f'postgresql+asyncpg://{values.get("POSTGRES_USER")}:{values.get("POSTGRES_PASSWORD")}@{values.get("POSTGRES_SERVER")}/test_{values.get("POSTGRES_DB") or ""}'

    @validator("SQLALCHEMY_TEST_ASYNC_DATABASE_URI", pre=True)
    def assemble_async_test_db_connection(
        cls, v: str | None, values: dict[str, Any]
    ) -> Any:
        if isinstance(v, str):
            return v
        return f'postgresql+asyncpg://{values.get("POSTGRES_USER")}:{values.get("POSTGRES_PASSWORD")}@{values.get("POSTGRES_SERVER")}/text_{values.get("POSTGRES_DB") or ""}'

    SMTP_TLS: bool = getenv_boolean("SMTP_TLS", False)
    SMTP_PORT: int | None = getenv_value("SMTP_PORT", 1025)
    SMTP_HOST: str | None = getenv_value("SMTP_HOST", "localhost")
    SMTP_USER: str | None = getenv_value("SMTP_USER", "")
    SMTP_PASSWORD: str | None = getenv_value("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: EmailStr | None = getenv_value(
        "EMAILS_FROM_EMAIL", "felicity@felicity.labs"
    )
    EMAILS_FROM_NAME: str | None = getenv_value(
        "EMAILS_FROM_NAME", "felicity")

    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: str | None, values: dict[str, Any]) -> str:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = BASE_DIR + "/utils/email/email-templates/output"
    EMAILS_ENABLED: bool = False

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")
            and values.get("EMAILS_FROM_EMAIL")
        )

    EMAIL_TEST_USER: EmailStr = "admin@stanchionlabs.inc"
    FIRST_SUPERUSER_EMAIL: EmailStr = getenv_value(
        "FIRST_SUPERUSER", "admin@felicitylabs.com"
    )
    FIRST_SEPERUSER_USERNAME: str = getenv_value(
        "FIRST_SEPERUSER_USERNAME", "admin")
    FIRST_SUPERUSER_PASSWORD: str = getenv_value(
        "FIRST_SUPERUSER_PASSWORD", "!Felicity#100"
    )
    # Reserved System User
    SYSTEM_DAEMONUSER_EMAIL: EmailStr = "system_daemon@system.daemon"
    SYSTEM_DAEMONUSER_USERNAME: str = "system_daemon"
    SYSTEM_DAEMONUSER_PASSWORD: str = "!System@Daemon#100"
    #
    USERS_OPEN_REGISTRATION: bool = False

    LOAD_SETUP_DATA: bool = getenv_boolean("LOAD_SETUP_DATA", False)
    SERVE_WEBAPP: bool = getenv_boolean("SERVE_WEBAPP", False)
    # Tracing
    RUN_OPEN_TRACING: bool = getenv_boolean("RUN_OPEN_TRACING", False)
    OTLP_SPAN_EXPORT_URL: str = getenv_value(
        "OTLP_SPAN_EXPORT_URL", "http://localhost:4317")

    class Config:
        case_sensitive = True


settings = Settings()