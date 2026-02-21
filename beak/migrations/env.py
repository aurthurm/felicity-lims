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
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_customer (
                tenant_slug VARCHAR(128) PRIMARY KEY,
                customer_uid VARCHAR(64) NOT NULL,
                legal_name VARCHAR(255),
                billing_email VARCHAR(255),
                currency VARCHAR(8) NOT NULL DEFAULT 'USD',
                country VARCHAR(8),
                provider_preference VARCHAR(32) NOT NULL DEFAULT 'stripe',
                auto_finalize_invoices BOOLEAN NOT NULL DEFAULT false,
                auto_send_invoices BOOLEAN NOT NULL DEFAULT false,
                payment_terms_days INTEGER NOT NULL DEFAULT 30,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE UNIQUE INDEX IF NOT EXISTS uq_billing_customer_tenant_slug
            ON "{platform_schema}".billing_customer (tenant_slug)
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_subscription (
                uid VARCHAR(64) PRIMARY KEY,
                tenant_slug VARCHAR(128) NOT NULL,
                plan_code VARCHAR(64) NOT NULL,
                status VARCHAR(32) NOT NULL,
                base_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                usage_overage_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                mrr_snapshot NUMERIC(18, 2) NOT NULL DEFAULT 0,
                next_billing_date DATE NULL,
                starts_at TIMESTAMP NULL,
                ends_at TIMESTAMP NULL,
                paused_at TIMESTAMP NULL,
                canceled_at TIMESTAMP NULL,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_subscription_item (
                uid VARCHAR(64) PRIMARY KEY,
                subscription_uid VARCHAR(64) NOT NULL,
                tenant_slug VARCHAR(128) NOT NULL,
                item_code VARCHAR(128) NOT NULL,
                quantity NUMERIC(18, 4) NOT NULL DEFAULT 0,
                unit_price NUMERIC(18, 4) NOT NULL DEFAULT 0,
                amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_plan (
                uid VARCHAR(64) PRIMARY KEY,
                plan_code VARCHAR(64) NOT NULL UNIQUE,
                name VARCHAR(128) NOT NULL,
                active BOOLEAN NOT NULL DEFAULT true,
                currency VARCHAR(8) NOT NULL DEFAULT 'USD',
                base_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_plan_limit (
                uid VARCHAR(64) PRIMARY KEY,
                plan_uid VARCHAR(64) NOT NULL,
                metric_key VARCHAR(64) NOT NULL,
                limit_value INTEGER NOT NULL,
                limit_window VARCHAR(16) NOT NULL,
                enforcement_mode VARCHAR(32) NOT NULL DEFAULT 'hard_block',
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_plan_feature (
                uid VARCHAR(64) PRIMARY KEY,
                plan_uid VARCHAR(64) NOT NULL,
                feature_key VARCHAR(64) NOT NULL,
                enabled BOOLEAN NOT NULL DEFAULT true,
                included_units NUMERIC(18, 4) NOT NULL DEFAULT 0,
                unit_price NUMERIC(18, 4) NOT NULL DEFAULT 0,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_tenant_override (
                uid VARCHAR(64) PRIMARY KEY,
                tenant_slug VARCHAR(128) NOT NULL,
                metric_key VARCHAR(64),
                feature_key VARCHAR(64),
                override_limit_value INTEGER,
                override_enabled BOOLEAN,
                limit_window VARCHAR(16),
                enforcement_mode VARCHAR(32),
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_usage_counter (
                uid VARCHAR(64) PRIMARY KEY,
                tenant_slug VARCHAR(128) NOT NULL,
                metric_key VARCHAR(64) NOT NULL,
                window_start TIMESTAMP NOT NULL,
                window_end TIMESTAMP NOT NULL,
                scope_user_uid VARCHAR(64),
                scope_lab_uid VARCHAR(64),
                quantity BIGINT NOT NULL DEFAULT 0,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE UNIQUE INDEX IF NOT EXISTS uq_billing_usage_counter_dims
            ON "{platform_schema}".billing_usage_counter (
                tenant_slug,
                metric_key,
                window_start,
                COALESCE(scope_user_uid, ''),
                COALESCE(scope_lab_uid, '')
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_usage_record_daily (
                uid VARCHAR(64) PRIMARY KEY,
                tenant_slug VARCHAR(128) NOT NULL,
                usage_date DATE NOT NULL,
                metric_key VARCHAR(128) NOT NULL,
                quantity NUMERIC(18, 4) NOT NULL DEFAULT 0,
                unit_price NUMERIC(18, 4) NOT NULL DEFAULT 0,
                amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_invoice (
                uid VARCHAR(64) PRIMARY KEY,
                tenant_slug VARCHAR(128) NOT NULL,
                invoice_number VARCHAR(64) NOT NULL,
                status VARCHAR(32) NOT NULL,
                currency VARCHAR(8) NOT NULL DEFAULT 'USD',
                subtotal NUMERIC(18, 2) NOT NULL DEFAULT 0,
                tax_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                total_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                amount_due NUMERIC(18, 2) NOT NULL DEFAULT 0,
                amount_paid NUMERIC(18, 2) NOT NULL DEFAULT 0,
                due_date DATE NULL,
                issued_at TIMESTAMP NULL,
                finalized_at TIMESTAMP NULL,
                sent_at TIMESTAMP NULL,
                paid_at TIMESTAMP NULL,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE UNIQUE INDEX IF NOT EXISTS uq_billing_invoice_invoice_number
            ON "{platform_schema}".billing_invoice (invoice_number)
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_invoice_line (
                uid VARCHAR(64) PRIMARY KEY,
                invoice_uid VARCHAR(64) NOT NULL,
                line_index INTEGER NOT NULL,
                description TEXT NOT NULL,
                quantity NUMERIC(18, 4) NOT NULL DEFAULT 0,
                unit_price NUMERIC(18, 4) NOT NULL DEFAULT 0,
                amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_payment_attempt (
                uid VARCHAR(64) PRIMARY KEY,
                invoice_uid VARCHAR(64) NOT NULL,
                tenant_slug VARCHAR(128) NOT NULL,
                provider VARCHAR(32) NOT NULL,
                status VARCHAR(32) NOT NULL,
                amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                currency VARCHAR(8) NOT NULL DEFAULT 'USD',
                provider_reference VARCHAR(255),
                failure_reason TEXT,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_payment_proof (
                uid VARCHAR(64) PRIMARY KEY,
                tenant_slug VARCHAR(128) NOT NULL,
                invoice_uid VARCHAR(64) NOT NULL,
                status VARCHAR(32) NOT NULL DEFAULT 'submitted',
                amount NUMERIC(18, 2),
                currency VARCHAR(8),
                payment_method VARCHAR(64),
                payment_reference VARCHAR(255),
                note TEXT,
                original_filename VARCHAR(255) NOT NULL,
                content_type VARCHAR(128) NOT NULL,
                size_bytes BIGINT NOT NULL DEFAULT 0,
                bucket_name VARCHAR(128) NOT NULL,
                object_name VARCHAR(512) NOT NULL,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_payment_allocation (
                uid VARCHAR(64) PRIMARY KEY,
                payment_attempt_uid VARCHAR(64) NOT NULL,
                invoice_uid VARCHAR(64) NOT NULL,
                tenant_slug VARCHAR(128) NOT NULL,
                amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_webhook_event (
                uid VARCHAR(64) PRIMARY KEY,
                provider VARCHAR(32) NOT NULL,
                idempotency_key VARCHAR(255) NOT NULL,
                event_type VARCHAR(128) NOT NULL,
                payload JSONB NOT NULL,
                processed BOOLEAN NOT NULL DEFAULT false,
                processed_at TIMESTAMP NULL,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE UNIQUE INDEX IF NOT EXISTS uq_billing_webhook_event_idempotency_key
            ON "{platform_schema}".billing_webhook_event (idempotency_key)
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_provider_account_config (
                uid VARCHAR(64) PRIMARY KEY,
                provider VARCHAR(32) NOT NULL,
                account_name VARCHAR(128),
                account_reference VARCHAR(255),
                enabled BOOLEAN NOT NULL DEFAULT false,
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """
        )
    )
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{platform_schema}".billing_audit_log (
                uid VARCHAR(64) PRIMARY KEY,
                tenant_slug VARCHAR(128),
                actor_identifier VARCHAR(255),
                action VARCHAR(128) NOT NULL,
                resource_type VARCHAR(128) NOT NULL,
                resource_uid VARCHAR(64),
                details JSONB,
                created_at TIMESTAMP NULL
            )
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
