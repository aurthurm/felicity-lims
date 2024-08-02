import os
from functools import lru_cache
from pathlib import Path
from typing import Any

import pytz
from dotenv import load_dotenv
from pydantic import AnyHttpUrl, EmailStr, ValidationInfo, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from felicity.utils.env import getenv_boolean, getenv_value

BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_FILE: Path = Path(BASE_DIR, "./../.env")
load_dotenv(dotenv_path=ENV_FILE)


class Settings(BaseSettings):
    BASE_DIR: str = BASE_DIR
    SEEDS_DIR: str = os.path.abspath(os.path.join(BASE_DIR, "lims", "seeds", "data"))
    STATIC_DIR: str = os.path.join(BASE_DIR, "static")
    API_V1_STR: str = "/api/v1"
    ALGORITHM: str = "HS256"
    # secrets.token_urlsafe(32)
    SECRET_KEY: str = (
        "Eoy7XAjJWnr6PcgFi0FK37XbjXEfx2PdFV8GFbucReDbWiew8T79ob3ZIF3bgYi62THktkoTNdC1SrFyd_k4xQ"
    )
    REFRESH_SECRET_KEY: str = (
        "KKj6HeSWwizXDnzc1SS_e-PYn3EwA4XuotoOD3J0mvmu1PLdVzbDkAeThJDTQsgYHVgYwbV5PnSbo_ZJZHEMEg"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 4 * 1  # 4 hours
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 12 * 1  # 1/2 day / 12 hours
    PROJECT_NAME: str = getenv_value("PROJECT_NAME", "Felicity LIMS")
    SERVER_NAME: str = getenv_value("SERVER_NAME", "felicity-lims")
    SERVER_HOST: AnyHttpUrl = getenv_value("SERVER_HOST", "https://localhost")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    CORS_SUPPORTS_CREDENTIALS: bool = True
    CORS_ALLOW_HEADERS: list[str] = [
        "Authorization",
        "access-control-allow-methods",
        "content-type",
        "access-control-allow-origin",
        "access-control-allow-headers",
    ]
    DATE_STR_FORMAT: str = "%d-%m-%Y"
    DATETIME_STR_FORMAT: str = f"{DATE_STR_FORMAT} %H:%M"
    DATE_HUMAN_FORMAT: str = "%d-%b-%Y"
    DATETIME_HUMAN_FORMAT: str = f"{DATE_HUMAN_FORMAT} %I.%M %p"
    TIMEZONE_AWARE: bool = True
    TIMEZONE_REGION: str = "UTC"  # "Africa/Harare"
    TIMEZONE: Any = pytz.timezone(TIMEZONE_REGION)
    POSTGRES_SERVER: str = getenv_value("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = getenv_value("POSTGRES_USER", "felicity")
    POSTGRES_PASSWORD: str = getenv_value("POSTGRES_PASSWORD", "felicity")
    POSTGRES_DB: str = getenv_value("POSTGRES_DB", "felicity_lims")
    SQLALCHEMY_DATABASE_URI: str | None = None
    TESTING: bool = getenv_boolean("TESTING", False)
    RETAIN_TESTING_DB_DATA: bool = getenv_boolean("RETAIN_TESTING_DB_DATA", False)
    SQLALCHEMY_TEST_DATABASE_URI: str | None = None

    @field_validator("SQLALCHEMY_DATABASE_URI")
    def assemble_async_db_connection(cls, v: str | None, info: ValidationInfo) -> str:
        if isinstance(v, str):
            return v
        return f'postgresql+asyncpg://{info.data.get("POSTGRES_USER")}:{info.data.get("POSTGRES_PASSWORD")}\
        @{info.data.get("POSTGRES_SERVER")}/{info.data.get("POSTGRES_DB") or ""}'.replace(
            " ", ""
        )

    @field_validator("SQLALCHEMY_TEST_DATABASE_URI")
    def assemble_async_test_db_connection(
            cls, v: str | None, info: ValidationInfo
    ) -> str:
        if isinstance(v, str):
            return v
        return f'postgresql+asyncpg://{info.data.get("POSTGRES_USER")}:{info.data.get("POSTGRES_PASSWORD")}\
        @{info.data.get("POSTGRES_SERVER")}/test_{info.data.get("POSTGRES_DB") or ""}'.replace(
            " ", ""
        )

    SMTP_TLS: bool = getenv_boolean("SMTP_TLS", False)
    SMTP_PORT: int | None = getenv_value("SMTP_PORT", 1025)
    SMTP_HOST: str | None = getenv_value("SMTP_HOST", "localhost")
    SMTP_USER: str | None = getenv_value("SMTP_USER", "")
    SMTP_PASSWORD: str | None = getenv_value("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: EmailStr | None = getenv_value(
        "EMAILS_FROM_EMAIL", "felicity@felicity.labs"
    )
    EMAILS_FROM_NAME: str | None = getenv_value("EMAILS_FROM_NAME", "felicity")

    @field_validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: str | None, info: ValidationInfo) -> str:
        if not v:
            return info.data["PROJECT_NAME"]
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = BASE_DIR + "/utils/email/email-templates/output"
    EMAILS_ENABLED: bool = False

    @field_validator("EMAILS_ENABLED")
    def get_emails_enabled(cls, v: bool, info: ValidationInfo) -> bool:
        return bool(
            info.data.get("SMTP_HOST")
            and info.data.get("SMTP_PORT")
            and info.data.get("EMAILS_FROM_EMAIL")
        )

    EMAIL_TEST_USER: EmailStr = "test@felicitylims.inc"
    FIRST_SUPERUSER_EMAIL: EmailStr = getenv_value(
        "FIRST_SUPERUSER", "admin@felicitylims.com"
    )
    FIRST_SUPERUSER_USERNAME: str = getenv_value("FIRST_SUPERUSER_USERNAME", "admin")
    FIRST_SUPERUSER_PASSWORD: str = getenv_value(
        "FIRST_SUPERUSER_PASSWORD", "!Felicity#100"
    )
    SYSTEM_DAEMON_EMAIL: EmailStr = "system_daemon@felicitylims.com"
    SYSTEM_DAEMON_USERNAME: str = "system_daemon"
    SYSTEM_DAEMON_PASSWORD: str = "!System@Daemon#100"
    USERS_OPEN_REGISTRATION: bool = False
    LOAD_SETUP_DATA: bool = getenv_boolean("LOAD_SETUP_DATA", False)
    SERVE_WEBAPP: bool = getenv_boolean("SERVE_WEBAPP", True)
    RUN_OPEN_TRACING: bool = getenv_boolean("RUN_OPEN_TRACING", False)
    OTLP_SPAN_EXPORT_URL: str = getenv_value(
        "OTLP_SPAN_EXPORT_URL", "http://localhost:4317"
    )
    REDIS_SERVER: str = getenv_value("REDIS_SERVER", "localhost:6379")
    MONGODB_SERVER: str = getenv_value("MONGODB_SERVER", "localhost")
    MONGODB_USER: str = getenv_value("MONGODB_USER", "felicity")
    MONGODB_PASS: str = getenv_value("MONGODB_PASS", "felicity")
    MINIO_SERVER: str = getenv_value("MINIO_SERVER", "http://localhost:9000")
    MINIO_ACCESS: str = getenv_value("MINIO_ACCESS", "felicity")
    MINIO_SECRET: str = getenv_value("MINIO_SECRET", "felicity")
    MEILISEARCH_SERVER: str = getenv_value("MEILISEARCH_SERVER", "http://localhost:7700")
    MEILISEARCH_API_KEY: str = getenv_value("MEILISEARCH_API_KEY", "api_key")

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        # allow | forbid | ignore --- allowed to mainatin a single .env for both felicity and its webapp
        extra="allow",
    )


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
