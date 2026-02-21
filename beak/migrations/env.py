import asyncio
import os
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy import text

from beak.core.config import settings
from beak.database.base import BaseEntity

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = BaseEntity.metadata

TENANT_SCHEMA = os.environ.get("TENANT_SCHEMA")
PLATFORM_SCHEMA = settings.PLATFORM_SCHEMA

_MIGRATIONS_DIR = Path(__file__).parent
_VERSIONS_DIR = str(_MIGRATIONS_DIR / "versions")
_PLATFORM_DIR = str(_MIGRATIONS_DIR / "platform")


def _is_platform_table(schema: str | None) -> bool:
    """Return True if the schema matches the platform schema."""
    return schema == PLATFORM_SCHEMA


def include_object_platform(obj, name, type_, reflected, compare_to):
    """Only include objects in the platform schema for platform migrations."""
    if type_ == "table":
        return _is_platform_table(obj.schema)
    if hasattr(obj, "table"):
        return _is_platform_table(obj.table.schema)
    return True


def include_object_tenant(obj, name, type_, reflected, compare_to):
    """Exclude platform schema objects for tenant migrations."""
    if type_ == "table":
        return not _is_platform_table(obj.schema)
    if hasattr(obj, "table"):
        return not _is_platform_table(obj.table.schema)
    return True


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def get_async_url():
    user = settings.POSTGRES_USER
    password = settings.POSTGRES_PASSWORD
    server = settings.POSTGRES_SERVER
    db = settings.POSTGRES_DB
    return f"postgresql+asyncpg://{user}:{password}@{server}/{db}"


def do_run_platform_migrations(connection):
    """Run migrations scoped to the platform schema."""
    connection.execute(text(f'SET search_path TO "{PLATFORM_SCHEMA}", public'))
    connection.commit()
    connection.dialect.default_schema_name = PLATFORM_SCHEMA

    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        version_table="alembic_version",
        version_table_schema=PLATFORM_SCHEMA,
        include_schemas=True,
        include_object=include_object_platform,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_tenant_migrations(connection):
    """Run migrations scoped to a tenant schema."""
    connection.execute(text(f'SET search_path TO "{TENANT_SCHEMA}", public'))
    connection.commit()
    connection.dialect.default_schema_name = TENANT_SCHEMA

    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        version_table="alembic_version",
        version_table_schema=TENANT_SCHEMA,
        include_schemas=True,
        include_object=include_object_tenant,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online():
    """Run migrations in 'online' mode."""
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_async_url()

    if TENANT_SCHEMA:
        # Tenant mode: only use tenant version locations.
        config.set_main_option("version_locations", _VERSIONS_DIR)
        connect_args = {
            "server_settings": {"search_path": f'"{TENANT_SCHEMA}",public'}
        }
    else:
        # Platform mode: only use platform version locations.
        config.set_main_option("version_locations", _PLATFORM_DIR)
        connect_args = {}

    connectable = AsyncEngine(
        engine_from_config(
            configuration,
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
            future=True,
            connect_args=connect_args,
        )
    )

    async with connectable.connect() as connection:
        if TENANT_SCHEMA:
            await connection.execute(
                text(f'SET search_path TO "{TENANT_SCHEMA}", public')
            )
            await connection.commit()
            await connection.run_sync(do_run_tenant_migrations)
        else:
            # Ensure platform schema exists before running migrations.
            await connection.execute(
                text(f'CREATE SCHEMA IF NOT EXISTS "{PLATFORM_SCHEMA}"')
            )
            await connection.commit()
            await connection.run_sync(do_run_platform_migrations)


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
