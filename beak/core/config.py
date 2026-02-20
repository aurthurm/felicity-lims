import os
import secrets
from functools import lru_cache
from pathlib import Path
from typing import Any

import pytz
from dotenv import load_dotenv
from pydantic import AnyHttpUrl, EmailStr, ValidationInfo, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from beak.utils.env import getenv_boolean, getenv_value

ROOT_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_FILE: Path = Path(BASE_DIR, "./../.env")
load_dotenv(dotenv_path=ENV_FILE, override=False)
DEFAULT_CORS_ORIGIN_REGEX = r"^https?://([a-z0-9-]+\.)?localtest\.me(:\d+)?$"


class Settings(BaseSettings):
    DEBUG: bool = True
    BASE_DIR: str = BASE_DIR
    SEEDS_DIR: str = os.path.abspath(os.path.join(BASE_DIR, "lims", "seeds", "data"))
    STATIC_DIR: str = os.path.join(BASE_DIR, "static")
    MEDIA_FOLDER: str = "media"
    MEDIA_DIR: str = os.path.join(BASE_DIR, MEDIA_FOLDER)
    API_V1_STR: str = "/api/v1"
    ALGORITHM: str = "HS256"
    SECRET_KEY: str = getenv_value("SECRET_KEY", secrets.token_urlsafe(32))
    REFRESH_SECRET_KEY: str = getenv_value(
        "REFRESH_SECRET_KEY", secrets.token_urlsafe(32)
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 4 * 1  # 4 hours
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 12 * 1  # 1/2 day / 12 hours
    PROJECT_NAME: str = getenv_value("PROJECT_NAME", "Beak LIMS")
    SERVER_NAME: str = getenv_value("SERVER_NAME", "beak-lims")
    SERVER_HOST: AnyHttpUrl = getenv_value("SERVER_HOST", "https://localhost")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://0.0.0.0:8000",
        "http://127.0.0.1:8000",
    ]
    CORS_ORIGIN_REGEX: str | None = getenv_value(
        "CORS_ORIGIN_REGEX",
        DEFAULT_CORS_ORIGIN_REGEX,
    )
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
    POSTGRES_USER: str = getenv_value("POSTGRES_USER", "beak")
    POSTGRES_PASSWORD: str = getenv_value("POSTGRES_PASSWORD", "beak")
    POSTGRES_DB: str = getenv_value("POSTGRES_DB", "beak_lims")
    PLATFORM_SCHEMA: str = getenv_value("PLATFORM_SCHEMA", "platform")
    TENANT_SCHEMA_PREFIX: str = getenv_value("TENANT_SCHEMA_PREFIX", "org_")
    DEFAULT_PRIMARY_INDUSTRY: str = getenv_value("DEFAULT_PRIMARY_INDUSTRY", "clinical")
    TENANT_HEADER_NAME: str = getenv_value("TENANT_HEADER_NAME", "X-Org-Slug")
    TENANT_REQUIRED_PATH_PREFIXES: list[str] = ["/beak-gql", "/api/v1"]
    TENANT_PUBLIC_PATHS: list[str] = [
        "/api/v1/health/status",
        "/api/v1/health/system",
        "/api/v1/version",
        "/api/v1/version/updates",
        "/api/v1/platform",
    ]
    PROVISION_TENANT_SCHEMA: str | None = getenv_value("TENANT_SCHEMA", None)
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
        "EMAILS_FROM_EMAIL", "beak@beak.labs"
    )
    EMAILS_FROM_NAME: str | None = getenv_value("EMAILS_FROM_NAME", "beak")

    @field_validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: str | None, info: ValidationInfo) -> str:
        if not v:
            return info.data["PROJECT_NAME"]
        return v

    @field_validator("CORS_ORIGIN_REGEX")
    def normalize_cors_origin_regex(cls, v: str | None) -> str:
        # Prevent blank env values from disabling regex matching.
        if v is None or not str(v).strip():
            return DEFAULT_CORS_ORIGIN_REGEX
        return str(v).strip()

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

    EMAIL_TEST_USER: EmailStr = "test@beaklims.inc"
    FIRST_SUPERUSER_EMAIL: EmailStr = getenv_value(
        "FIRST_SUPERUSER", "admin@beaklims.com"
    )
    FIRST_SUPERUSER_USERNAME: str = getenv_value("FIRST_SUPERUSER_USERNAME", "admin")
    FIRST_SUPERUSER_PASSWORD: str = getenv_value(
        "FIRST_SUPERUSER_PASSWORD", "!Beak#100"
    )
    PLATFORM_SUPERUSER_EMAIL: EmailStr = getenv_value(
        "PLATFORM_SUPERUSER_EMAIL", "platform.admin@beaklims.com"
    )
    PLATFORM_SUPERUSER_USERNAME: str = getenv_value(
        "PLATFORM_SUPERUSER_USERNAME", "platform_admin"
    )
    PLATFORM_SUPERUSER_PASSWORD: str = getenv_value(
        "PLATFORM_SUPERUSER_PASSWORD", "!Platform#100"
    )
    SYSTEM_DAEMON_EMAIL: EmailStr = "system_daemon@beaklims.com"
    SYSTEM_DAEMON_USERNAME: str = "system_daemon"
    SYSTEM_DAEMON_PASSWORD: str = "!System@Daemon#100"
    USERS_OPEN_REGISTRATION: bool = False
    LOAD_SETUP_DATA: bool = getenv_boolean("LOAD_SETUP_DATA", False)
    SERVE_WEBAPP: bool = getenv_boolean("SERVE_WEBAPP", True)
    ENABLE_BACKGROUND_PROCESSING: bool = getenv_boolean(
        "ENABLE_BACKGROUND_PROCESSING", False
    )
    OTLP_SPAN_EXPORT_URL: str = getenv_value("OTLP_SPAN_EXPORT_URL", None)  # xxx:4317
    SENTRY_DSN: str | None = getenv_value("SENTRY_DSN", None)
    RUN_OPEN_TRACING: bool = bool(OTLP_SPAN_EXPORT_URL)
    REDIS_SERVER: str | None = getenv_value("REDIS_SERVER", None)
    RATE_LIMIT: bool = getenv_boolean("RATE_LIMIT", True)
    RATE_LIMIT_PER_MINUTE: int = getenv_value("RATE_LIMIT_PER_MINUTE", 100)
    RATE_LIMIT_PER_HOUR: int = getenv_value("RATE_LIMIT_PER_HOUR", 2000)
    MONGODB_SERVER: str | None = getenv_value("MONGODB_SERVER", None)
    MONGODB_USER: str = getenv_value("MONGODB_USER", "beak")
    MONGODB_PASS: str = getenv_value("MONGODB_PASS", "beak")
    MINIO_SERVER: str | None = getenv_value("MINIO_SERVER", None)
    MINIO_ACCESS: str = getenv_value("MINIO_ACCESS", "beak")
    MINIO_SECRET: str = getenv_value("MINIO_SECRET", "beak")
    # Store jsons to document database
    DOCUMENT_STORAGE: bool = (
            bool(MONGODB_SERVER) and bool(MONGODB_USER) and bool(MONGODB_PASS)
    )
    # Use external storage for objects/blobs
    OBJECT_STORAGE: bool = (
            bool(MINIO_SERVER) and bool(MINIO_ACCESS) and bool(MINIO_SECRET)
    )
    # Limit Tables for audit-log: if empty, all will be audited
    AUDITABLE_ENTITIES: list[str] = [
        "sample",
        "analysis_result",
        "test_bill",
        "client",
        "patient",
    ]
    # Document Editor
    DEFAULT_DOCUMENT_EDITOR: str = "umo"
    # SMS
    SMS_API_URL: str | None = getenv_value("SMS_API_URL", None)
    SMS_TOKEN: str | None = getenv_value("SMS_TOKEN", None)
    SMS_USERNAME: str | None = getenv_value("SMS_USERNAME", None)
    SMS_PASSWORD: str | None = getenv_value("SMS_PASSWORD", None)

    # HIPAA Compliance
    HIPAA_ENCRYPTION_KEY: str | None = getenv_value("HIPAA_ENCRYPTION_KEY", None)
    SEARCH_ENCRYPTION_KEY: str | None = getenv_value("SEARCH_ENCRYPTION_KEY", None)

    # git personal access token
    GITHUB_PAT: str | None = getenv_value("GITHUB_PAT", None)

    #
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        # allow | forbid | ignore --- allowed to maintain a single .env for both beak and its webapp
        extra="allow",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
