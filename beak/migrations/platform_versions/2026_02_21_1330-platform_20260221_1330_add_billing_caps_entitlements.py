"""add billing caps and entitlements (platform)

Revision ID: platform_20260221_1330
Revises: platform_20260221_1200
Create Date: 2026-02-21 13:30:00.000000
"""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection

revision: str = "platform_20260221_1330"
down_revision: str | None = "platform_20260221_1200"


async def upgrade(*, connection: AsyncConnection, platform_schema: str) -> None:
    """Create caps/entitlement tables if missing."""
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
