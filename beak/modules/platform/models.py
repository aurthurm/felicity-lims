"""SQLAlchemy models for platform control-plane core tables."""

from __future__ import annotations

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, PrimaryKeyConstraint, String, Table
from sqlalchemy.dialects.postgresql import JSONB

from beak.core.config import get_settings
from beak.modules.shared.abstract.entity.base import Base

settings = get_settings()
_PLATFORM_TABLE = {"schema": settings.PLATFORM_SCHEMA}


class Tenant(Base):
    __tablename__ = "tenant"
    __table_args__ = _PLATFORM_TABLE

    name = Column(String(255), nullable=False)
    slug = Column(String(128), nullable=False, unique=True)
    schema_name = Column(String(128), nullable=False, unique=True)
    status = Column(String(32), nullable=False)
    admin_email = Column(String(255), nullable=True)
    primary_industry = Column(String(32), nullable=True)
    enabled_modules = Column(JSONB, nullable=True)
    module_state = Column(JSONB, nullable=True)
    provisioned_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class PlatformRole(Base):
    __tablename__ = "platform_role"
    __table_args__ = _PLATFORM_TABLE

    name = Column(String(64), nullable=False, unique=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class PlatformUser(Base):
    __tablename__ = "platform_user"
    __table_args__ = _PLATFORM_TABLE

    email = Column(String(255), nullable=False, unique=True)
    username = Column(String(128), nullable=False, unique=True)
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


platform_user_role = Table(
    "platform_user_role",
    Base.metadata,
    Column(
        "user_uid",
        String(64),
        ForeignKey(f'{settings.PLATFORM_SCHEMA}.platform_user.uid', ondelete="CASCADE"),
        nullable=False,
    ),
    Column(
        "role_uid",
        String(64),
        ForeignKey(f'{settings.PLATFORM_SCHEMA}.platform_role.uid', ondelete="CASCADE"),
        nullable=False,
    ),
    Column("created_at", DateTime, nullable=True),
    PrimaryKeyConstraint("user_uid", "role_uid", name="pk_platform_user_role"),
    schema=settings.PLATFORM_SCHEMA,
)


__all__ = [
    "Tenant",
    "PlatformRole",
    "PlatformUser",
    "platform_user_role",
]
