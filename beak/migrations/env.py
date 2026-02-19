import asyncio
import os
from logging.config import fileConfig

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
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = BaseEntity.metadata
TENANT_SCHEMA = os.environ.get("TENANT_SCHEMA")


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    """Run hippaa in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
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


def do_run_migrations(connection):
    if TENANT_SCHEMA:
        connection.execute(text(f'SET search_path TO "{TENANT_SCHEMA}", public'))
        connection.commit()
        connection.dialect.default_schema_name = TENANT_SCHEMA

    configure_kwargs = {
        "connection": connection,
        "target_metadata": target_metadata,
    }
    if TENANT_SCHEMA:
        # Prevent Alembic from resolving to public.alembic_version and skipping tenant DDL.
        configure_kwargs["include_schemas"] = True
        configure_kwargs["version_table"] = "alembic_version"
        configure_kwargs["version_table_schema"] = TENANT_SCHEMA

    context.configure(**configure_kwargs)

    with context.begin_transaction():
        context.run_migrations()


async def bootstrap_platform_schema(connection) -> None:
    """Default migration path: ensure platform schema + tenant registry exist."""
    platform_schema = settings.PLATFORM_SCHEMA

    await connection.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{platform_schema}"'))
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".tenant (
                uid VARCHAR(64) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(128) NOT NULL UNIQUE,
                schema_name VARCHAR(128) NOT NULL UNIQUE,
                status VARCHAR(32) NOT NULL,
                admin_email VARCHAR(255),
                primary_industry VARCHAR(32),
                enabled_modules JSONB,
                module_state JSONB,
                provisioned_at TIMESTAMP NULL,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            ALTER TABLE "{platform_schema}".tenant
            ADD COLUMN IF NOT EXISTS primary_industry VARCHAR(32)
            """
        )
    )
    await connection.execute(
        text(
            f"""
            ALTER TABLE "{platform_schema}".tenant
            ADD COLUMN IF NOT EXISTS enabled_modules JSONB
            """
        )
    )
    await connection.execute(
        text(
            f"""
            ALTER TABLE "{platform_schema}".tenant
            ADD COLUMN IF NOT EXISTS module_state JSONB
            """
        )
    )
    await connection.execute(
        text(
            f"""
            UPDATE "{platform_schema}".tenant
            SET primary_industry = COALESCE(primary_industry, 'clinical'),
                enabled_modules = COALESCE(enabled_modules, '["core","clinical"]'::jsonb),
                module_state = COALESCE(module_state, '{{}}'::jsonb)
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".alembic_version_platform (
                version_num VARCHAR(32) NOT NULL PRIMARY KEY
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            INSERT INTO "{platform_schema}".alembic_version_platform(version_num)
            VALUES ('platform_bootstrap')
            ON CONFLICT (version_num) DO NOTHING
            """
        )
    )
    await connection.commit()


async def run_migrations_online():
    """Run hippaa in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_async_url()
    connect_args = {}
    if TENANT_SCHEMA:
        connect_args["server_settings"] = {"search_path": f'"{TENANT_SCHEMA}",public'}

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
        if not TENANT_SCHEMA:
            # Default behavior: migrate/bootstrap platform metadata only.
            await bootstrap_platform_schema(connection)
            return

        if TENANT_SCHEMA:
            await connection.execute(
                text(f'SET search_path TO "{TENANT_SCHEMA}", public')
            )
            await connection.commit()
        await connection.run_sync(do_run_migrations)


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
