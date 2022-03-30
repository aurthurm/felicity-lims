import os
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, AnyUrl, BaseSettings, EmailStr, HttpUrl, validator


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


class PostgresDsn(AnyUrl):
    allowed_schemes = {
        "postgres",
        "postgresql",
        "postgres+asyncpg",
        "postgresql+asyncpg",
    }
    user_required = True


class Settings(BaseSettings):
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "uIM7aXFRzaIxWr1NEy_RMQg9iIuDkLAlkOPs5zpgbts"  # secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 16
    SERVER_NAME: str = getenv_value("SERVER_NAME", "felicity")
    SERVER_HOST: AnyHttpUrl = getenv_value("SERVER_HOST", "https://localhost")
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:8000", "http://localhost:3000",
                                              "http://192.168.137.97:3000", "http://192.168.137.128:3000",
                                              "http://192.168.0.196:3000", "http://192.168.0.195:3000",
                                              "http://192.168.137.227:3000"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    PROJECT_NAME: str = getenv_value("PROJECT_NAME", "FELLICITY LIMS")
    SENTRY_DSN: Optional[HttpUrl] = getenv_value("SENTRY_DSN", "")

    @validator("SENTRY_DSN", pre=True)
    def sentry_dsn_can_be_blank(cls, v: str) -> Optional[str]:
        if len(v) == 0:
            return None
        return v

    POSTGRES_SERVER: str = getenv_value("POSTGRES_SERVER", "localhost")  # felicity_db
    POSTGRES_USER: str = getenv_value("POSTGRES_USER", "felicity")
    POSTGRES_PASSWORD: str = getenv_value("POSTGRES_PASSWORD", "felicity")
    POSTGRES_DB: str = getenv_value("POSTGRES_DB", "felicity_lims")
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None
    SQLALCHEMY_ASYNC_DATABASE_URI: Optional[PostgresDsn] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    @validator("SQLALCHEMY_ASYNC_DATABASE_URI", pre=True)
    def assemble_async_db_connection(
        cls, v: Optional[str], values: Dict[str, Any]
    ) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    SMTP_TLS: bool = getenv_boolean("SMTP_TLS", True)
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None

    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = BASE_DIR + "/utils/email/email-templates/build"
    EMAILS_ENABLED: bool = False

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")
            and values.get("EMAILS_FROM_EMAIL")
        )

    EMAIL_TEST_USER: EmailStr = "admin@stanchionlabs.inc"
    FIRST_SUPERUSER_EMAIL: EmailStr = getenv_value(
        "FIRST_SUPERUSER", "admin@felicitylabs.com"
    )
    FIRST_SEPERUSER_USERNAME: str = getenv_value("FIRST_SEPERUSER_USERNAME", "admin")
    FIRST_SUPERUSER_PASSWORD: str = getenv_value("FIRST_SUPERUSER_PASSWORD", "admin")
    USERS_OPEN_REGISTRATION: bool = False

    LOAD_SETUP_DATA = getenv_boolean("LOAD_SETUP_DATA", False)

    class Config:
        case_sensitive = True


settings = Settings()
