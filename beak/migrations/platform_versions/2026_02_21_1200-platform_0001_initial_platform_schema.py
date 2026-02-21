"""initial platform schema baseline

Revision ID: platform_20260221_1200
Revises: None
Create Date: 2026-02-21 12:00:00.000000
"""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection

from beak.database.base import BaseEntity

revision: str = "platform_20260221_1200"
down_revision: str | None = None


def _platform_tables(platform_schema: str) -> list:
    return [
        table
        for table in BaseEntity.metadata.sorted_tables
        if table.schema == platform_schema
    ]


async def upgrade(*, connection: AsyncConnection, platform_schema: str) -> None:
    """Create platform schema baseline tables from ORM metadata."""
    await connection.run_sync(
        lambda sync_conn: BaseEntity.metadata.create_all(
            sync_conn,
            tables=_platform_tables(platform_schema),
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
