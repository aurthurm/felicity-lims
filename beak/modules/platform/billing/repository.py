"""Repository for platform billing persistence."""

from __future__ import annotations

import json
from datetime import UTC, date, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import text

from beak.core.config import get_settings
from beak.core.uid_gen import get_flake_uid
from beak.database.platform_session import PlatformSessionScoped

settings = get_settings()


class PlatformBillingRepository:
    """Persistence adapter for platform billing domain."""

    async def ensure_billing_refinement_tables(self) -> None:
        """Ensure entitlement and cap tables exist in platform schema."""
        stmts = [
            f"""
            CREATE TABLE IF NOT EXISTS "{settings.PLATFORM_SCHEMA}".billing_plan (
                uid VARCHAR(64) PRIMARY KEY,
                plan_code VARCHAR(64) NOT NULL UNIQUE,
                name VARCHAR(128) NOT NULL,
                active BOOLEAN NOT NULL DEFAULT true,
                currency VARCHAR(8) NOT NULL DEFAULT 'USD',
                base_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS "{settings.PLATFORM_SCHEMA}".billing_plan_limit (
                uid VARCHAR(64) PRIMARY KEY,
                plan_uid VARCHAR(64) NOT NULL,
                metric_key VARCHAR(64) NOT NULL,
                limit_value INTEGER NOT NULL,
                window VARCHAR(16) NOT NULL,
                enforcement_mode VARCHAR(32) NOT NULL DEFAULT 'hard_block',
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS "{settings.PLATFORM_SCHEMA}".billing_plan_feature (
                uid VARCHAR(64) PRIMARY KEY,
                plan_uid VARCHAR(64) NOT NULL,
                feature_key VARCHAR(64) NOT NULL,
                enabled BOOLEAN NOT NULL DEFAULT true,
                included_units NUMERIC(18, 4) NOT NULL DEFAULT 0,
                unit_price NUMERIC(18, 4) NOT NULL DEFAULT 0,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS "{settings.PLATFORM_SCHEMA}".billing_tenant_override (
                uid VARCHAR(64) PRIMARY KEY,
                tenant_slug VARCHAR(128) NOT NULL,
                metric_key VARCHAR(64),
                feature_key VARCHAR(64),
                override_limit_value INTEGER,
                override_enabled BOOLEAN,
                window VARCHAR(16),
                enforcement_mode VARCHAR(32),
                metadata JSONB,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS "{settings.PLATFORM_SCHEMA}".billing_usage_counter (
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
            """,
            f"""
            CREATE UNIQUE INDEX IF NOT EXISTS uq_billing_usage_counter_dims
            ON "{settings.PLATFORM_SCHEMA}".billing_usage_counter (
                tenant_slug,
                metric_key,
                window_start,
                COALESCE(scope_user_uid, ''),
                COALESCE(scope_lab_uid, '')
            )
            """,
        ]
        async with PlatformSessionScoped() as session:
            for stmt in stmts:
                await session.execute(text(stmt))
            await session.commit()

    async def ensure_tenant_exists(self, tenant_slug: str) -> bool:
        """Check tenant existence in platform registry.

        Args:
            tenant_slug: Platform tenant slug.

        Returns:
            True when tenant exists, otherwise False.
        """
        stmt = text(
            f"""
            SELECT 1
            FROM "{settings.PLATFORM_SCHEMA}".tenant
            WHERE slug = :tenant_slug
            LIMIT 1
            """
        )
        async with PlatformSessionScoped() as session:
            row = (await session.execute(stmt, {"tenant_slug": tenant_slug})).first()
        return row is not None

    async def get_profile(self, tenant_slug: str) -> dict[str, Any] | None:
        """Fetch tenant billing profile."""
        stmt = text(
            f"""
            SELECT
                tenant_slug,
                customer_uid,
                legal_name,
                billing_email,
                currency,
                country,
                provider_preference,
                auto_finalize_invoices,
                auto_send_invoices,
                payment_terms_days,
                COALESCE(metadata, '{{}}'::jsonb) AS metadata,
                created_at,
                updated_at
            FROM "{settings.PLATFORM_SCHEMA}".billing_customer
            WHERE tenant_slug = :tenant_slug
            """
        )
        async with PlatformSessionScoped() as session:
            row = (await session.execute(stmt, {"tenant_slug": tenant_slug})).mappings().first()
        return dict(row) if row else None

    async def upsert_profile(
        self,
        tenant_slug: str,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        """Create or update billing profile for a tenant."""
        now = datetime.now(UTC)
        profile = await self.get_profile(tenant_slug)
        if not profile:
            profile = {
                "tenant_slug": tenant_slug,
                "customer_uid": get_flake_uid(),
                "legal_name": None,
                "billing_email": None,
                "currency": "USD",
                "country": None,
                "provider_preference": "stripe",
                "auto_finalize_invoices": False,
                "auto_send_invoices": False,
                "payment_terms_days": 30,
                "metadata": {},
                "created_at": now,
                "updated_at": now,
            }

        merged = {**profile, **payload, "tenant_slug": tenant_slug, "updated_at": now}
        if not merged.get("customer_uid"):
            merged["customer_uid"] = get_flake_uid()

        stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_customer (
                tenant_slug,
                customer_uid,
                legal_name,
                billing_email,
                currency,
                country,
                provider_preference,
                auto_finalize_invoices,
                auto_send_invoices,
                payment_terms_days,
                metadata,
                created_at,
                updated_at
            ) VALUES (
                :tenant_slug,
                :customer_uid,
                :legal_name,
                :billing_email,
                :currency,
                :country,
                :provider_preference,
                :auto_finalize_invoices,
                :auto_send_invoices,
                :payment_terms_days,
                CAST(:metadata AS jsonb),
                :created_at,
                :updated_at
            )
            ON CONFLICT (tenant_slug) DO UPDATE SET
                legal_name = EXCLUDED.legal_name,
                billing_email = EXCLUDED.billing_email,
                currency = EXCLUDED.currency,
                country = EXCLUDED.country,
                provider_preference = EXCLUDED.provider_preference,
                auto_finalize_invoices = EXCLUDED.auto_finalize_invoices,
                auto_send_invoices = EXCLUDED.auto_send_invoices,
                payment_terms_days = EXCLUDED.payment_terms_days,
                metadata = EXCLUDED.metadata,
                updated_at = EXCLUDED.updated_at
            """
        )
        async with PlatformSessionScoped() as session:
            await session.execute(
                stmt,
                {
                    **merged,
                    "metadata": json.dumps(merged.get("metadata") or {}),
                    "created_at": merged.get("created_at") or now,
                },
            )
            await session.commit()
        refreshed = await self.get_profile(tenant_slug)
        if not refreshed:
            raise RuntimeError("Failed to upsert billing profile")
        return refreshed

    async def get_subscription(self, tenant_slug: str) -> dict[str, Any] | None:
        """Fetch active subscription row for a tenant."""
        stmt = text(
            f"""
            SELECT
                uid,
                tenant_slug,
                plan_code,
                status,
                base_amount,
                usage_overage_amount,
                mrr_snapshot,
                next_billing_date,
                starts_at,
                ends_at,
                paused_at,
                canceled_at,
                COALESCE(metadata, '{{}}'::jsonb) AS metadata,
                created_at,
                updated_at
            FROM "{settings.PLATFORM_SCHEMA}".billing_subscription
            WHERE tenant_slug = :tenant_slug
            ORDER BY created_at DESC
            LIMIT 1
            """
        )
        async with PlatformSessionScoped() as session:
            row = (await session.execute(stmt, {"tenant_slug": tenant_slug})).mappings().first()
        return dict(row) if row else None

    async def upsert_subscription(self, tenant_slug: str, payload: dict[str, Any]) -> dict[str, Any]:
        """Create or update current subscription for a tenant."""
        now = datetime.now(UTC)
        existing = await self.get_subscription(tenant_slug)
        if existing:
            uid = existing["uid"]
            stmt = text(
                f"""
                UPDATE "{settings.PLATFORM_SCHEMA}".billing_subscription
                SET
                    plan_code = :plan_code,
                    status = :status,
                    base_amount = :base_amount,
                    usage_overage_amount = :usage_overage_amount,
                    mrr_snapshot = :mrr_snapshot,
                    next_billing_date = :next_billing_date,
                    starts_at = :starts_at,
                    ends_at = :ends_at,
                    paused_at = :paused_at,
                    canceled_at = :canceled_at,
                    metadata = CAST(:metadata AS jsonb),
                    updated_at = :updated_at
                WHERE uid = :uid
                """
            )
            params = {
                "uid": uid,
                "updated_at": now,
                **payload,
                "metadata": json.dumps(payload.get("metadata") or {}),
            }
        else:
            uid = get_flake_uid()
            stmt = text(
                f"""
                INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_subscription (
                    uid,
                    tenant_slug,
                    plan_code,
                    status,
                    base_amount,
                    usage_overage_amount,
                    mrr_snapshot,
                    next_billing_date,
                    starts_at,
                    ends_at,
                    paused_at,
                    canceled_at,
                    metadata,
                    created_at,
                    updated_at
                ) VALUES (
                    :uid,
                    :tenant_slug,
                    :plan_code,
                    :status,
                    :base_amount,
                    :usage_overage_amount,
                    :mrr_snapshot,
                    :next_billing_date,
                    :starts_at,
                    :ends_at,
                    :paused_at,
                    :canceled_at,
                    CAST(:metadata AS jsonb),
                    :created_at,
                    :updated_at
                )
                """
            )
            params = {
                "uid": uid,
                "tenant_slug": tenant_slug,
                "created_at": now,
                "updated_at": now,
                **payload,
                "metadata": json.dumps(payload.get("metadata") or {}),
            }

        async with PlatformSessionScoped() as session:
            await session.execute(stmt, params)
            await session.commit()
        refreshed = await self.get_subscription(tenant_slug)
        if not refreshed:
            raise RuntimeError("Failed to upsert subscription")
        return refreshed

    async def create_invoice(self, tenant_slug: str, payload: dict[str, Any]) -> dict[str, Any]:
        """Create a draft invoice and line items."""
        now = datetime.now(UTC)
        uid = get_flake_uid()
        invoice_number = f"INV-{now.strftime('%Y%m')}-{uid[-6:]}"
        subtotal = Decimal(str(payload.get("subtotal") or "0"))
        tax_amount = Decimal(str(payload.get("tax_amount") or "0"))
        total_amount = subtotal + tax_amount

        invoice_stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_invoice (
                uid,
                tenant_slug,
                invoice_number,
                status,
                currency,
                subtotal,
                tax_amount,
                total_amount,
                amount_due,
                amount_paid,
                due_date,
                issued_at,
                metadata,
                created_at,
                updated_at
            ) VALUES (
                :uid,
                :tenant_slug,
                :invoice_number,
                'draft',
                :currency,
                :subtotal,
                :tax_amount,
                :total_amount,
                :amount_due,
                0,
                :due_date,
                :issued_at,
                CAST(:metadata AS jsonb),
                :created_at,
                :updated_at
            )
            """
        )

        line_stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_invoice_line (
                uid,
                invoice_uid,
                line_index,
                description,
                quantity,
                unit_price,
                amount,
                metadata,
                created_at,
                updated_at
            ) VALUES (
                :uid,
                :invoice_uid,
                :line_index,
                :description,
                :quantity,
                :unit_price,
                :amount,
                CAST(:metadata AS jsonb),
                :created_at,
                :updated_at
            )
            """
        )

        async with PlatformSessionScoped() as session:
            await session.execute(
                invoice_stmt,
                {
                    "uid": uid,
                    "tenant_slug": tenant_slug,
                    "invoice_number": invoice_number,
                    "currency": payload.get("currency") or "USD",
                    "subtotal": subtotal,
                    "tax_amount": tax_amount,
                    "total_amount": total_amount,
                    "amount_due": total_amount,
                    "due_date": payload.get("due_date"),
                    "issued_at": now,
                    "metadata": json.dumps(payload.get("metadata") or {}),
                    "created_at": now,
                    "updated_at": now,
                },
            )

            for idx, line in enumerate(payload.get("lines") or []):
                await session.execute(
                    line_stmt,
                    {
                        "uid": get_flake_uid(),
                        "invoice_uid": uid,
                        "line_index": idx,
                        "description": line.get("description"),
                        "quantity": line.get("quantity") or Decimal("1"),
                        "unit_price": line.get("unit_price") or Decimal("0"),
                        "amount": line.get("amount") or Decimal("0"),
                        "metadata": json.dumps(line.get("metadata") or {}),
                        "created_at": now,
                        "updated_at": now,
                    },
                )
            await session.commit()

        invoice = await self.get_invoice(tenant_slug, uid)
        if not invoice:
            raise RuntimeError("Failed to create invoice")
        return invoice

    async def list_invoices(self, tenant_slug: str) -> list[dict[str, Any]]:
        """List invoices for tenant."""
        stmt = text(
            f"""
            SELECT
                uid,
                tenant_slug,
                invoice_number,
                status,
                currency,
                subtotal,
                tax_amount,
                total_amount,
                amount_due,
                amount_paid,
                due_date,
                issued_at,
                finalized_at,
                sent_at,
                paid_at,
                COALESCE(metadata, '{{}}'::jsonb) AS metadata,
                created_at,
                updated_at
            FROM "{settings.PLATFORM_SCHEMA}".billing_invoice
            WHERE tenant_slug = :tenant_slug
            ORDER BY created_at DESC
            """
        )
        async with PlatformSessionScoped() as session:
            rows = (await session.execute(stmt, {"tenant_slug": tenant_slug})).mappings().all()
        return [dict(row) for row in rows]

    async def get_invoice(self, tenant_slug: str, invoice_uid: str) -> dict[str, Any] | None:
        """Fetch one invoice by uid/tenant."""
        stmt = text(
            f"""
            SELECT
                uid,
                tenant_slug,
                invoice_number,
                status,
                currency,
                subtotal,
                tax_amount,
                total_amount,
                amount_due,
                amount_paid,
                due_date,
                issued_at,
                finalized_at,
                sent_at,
                paid_at,
                COALESCE(metadata, '{{}}'::jsonb) AS metadata,
                created_at,
                updated_at
            FROM "{settings.PLATFORM_SCHEMA}".billing_invoice
            WHERE tenant_slug = :tenant_slug
              AND uid = :invoice_uid
            LIMIT 1
            """
        )
        async with PlatformSessionScoped() as session:
            row = (
                await session.execute(
                    stmt,
                    {"tenant_slug": tenant_slug, "invoice_uid": invoice_uid},
                )
            ).mappings().first()
        return dict(row) if row else None

    async def update_invoice_status(
        self,
        tenant_slug: str,
        invoice_uid: str,
        *,
        status: str,
        finalized_at: datetime | None = None,
        sent_at: datetime | None = None,
        paid_at: datetime | None = None,
        amount_paid: Decimal | None = None,
    ) -> dict[str, Any] | None:
        """Update invoice state and payment fields."""
        now = datetime.now(UTC)
        stmt = text(
            f"""
            UPDATE "{settings.PLATFORM_SCHEMA}".billing_invoice
            SET
                status = :status,
                finalized_at = COALESCE(:finalized_at, finalized_at),
                sent_at = COALESCE(:sent_at, sent_at),
                paid_at = COALESCE(:paid_at, paid_at),
                amount_paid = COALESCE(:amount_paid, amount_paid),
                amount_due = CASE
                    WHEN :amount_paid IS NULL THEN amount_due
                    ELSE GREATEST(total_amount - :amount_paid, 0)
                END,
                updated_at = :updated_at
            WHERE tenant_slug = :tenant_slug
              AND uid = :invoice_uid
            """
        )
        async with PlatformSessionScoped() as session:
            await session.execute(
                stmt,
                {
                    "tenant_slug": tenant_slug,
                    "invoice_uid": invoice_uid,
                    "status": status,
                    "finalized_at": finalized_at,
                    "sent_at": sent_at,
                    "paid_at": paid_at,
                    "amount_paid": amount_paid,
                    "updated_at": now,
                },
            )
            await session.commit()
        return await self.get_invoice(tenant_slug, invoice_uid)

    async def update_invoice_metadata(
        self,
        tenant_slug: str,
        invoice_uid: str,
        metadata: dict[str, Any],
    ) -> dict[str, Any] | None:
        """Replace invoice metadata."""
        now = datetime.now(UTC)
        stmt = text(
            f"""
            UPDATE "{settings.PLATFORM_SCHEMA}".billing_invoice
            SET metadata = CAST(:metadata AS jsonb),
                updated_at = :updated_at
            WHERE tenant_slug = :tenant_slug
              AND uid = :invoice_uid
            """
        )
        async with PlatformSessionScoped() as session:
            await session.execute(
                stmt,
                {
                    "tenant_slug": tenant_slug,
                    "invoice_uid": invoice_uid,
                    "metadata": json.dumps(metadata),
                    "updated_at": now,
                },
            )
            await session.commit()
        return await self.get_invoice(tenant_slug, invoice_uid)

    async def create_payment_attempt(
        self,
        *,
        tenant_slug: str,
        invoice_uid: str,
        provider: str,
        status: str,
        amount: Decimal,
        currency: str,
        provider_reference: str | None,
        failure_reason: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Insert payment attempt row."""
        now = datetime.now(UTC)
        uid = get_flake_uid()
        stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_payment_attempt (
                uid,
                invoice_uid,
                tenant_slug,
                provider,
                status,
                amount,
                currency,
                provider_reference,
                failure_reason,
                metadata,
                created_at,
                updated_at
            ) VALUES (
                :uid,
                :invoice_uid,
                :tenant_slug,
                :provider,
                :status,
                :amount,
                :currency,
                :provider_reference,
                :failure_reason,
                CAST(:metadata AS jsonb),
                :created_at,
                :updated_at
            )
            """
        )
        async with PlatformSessionScoped() as session:
            await session.execute(
                stmt,
                {
                    "uid": uid,
                    "invoice_uid": invoice_uid,
                    "tenant_slug": tenant_slug,
                    "provider": provider,
                    "status": status,
                    "amount": amount,
                    "currency": currency,
                    "provider_reference": provider_reference,
                    "failure_reason": failure_reason,
                    "metadata": json.dumps(metadata or {}),
                    "created_at": now,
                    "updated_at": now,
                },
            )
            await session.commit()

        return {
            "uid": uid,
            "invoice_uid": invoice_uid,
            "tenant_slug": tenant_slug,
            "provider": provider,
            "status": status,
            "amount": amount,
            "currency": currency,
            "provider_reference": provider_reference,
            "failure_reason": failure_reason,
            "metadata": metadata or {},
            "created_at": now,
            "updated_at": now,
        }

    async def list_payment_attempts(
        self,
        tenant_slug: str,
        *,
        limit: int = 20,
    ) -> list[dict[str, Any]]:
        """List recent payment attempts for tenant."""
        stmt = text(
            f"""
            SELECT
                uid,
                invoice_uid,
                tenant_slug,
                provider,
                status,
                amount,
                currency,
                provider_reference,
                failure_reason,
                COALESCE(metadata, '{{}}'::jsonb) AS metadata,
                created_at,
                updated_at
            FROM "{settings.PLATFORM_SCHEMA}".billing_payment_attempt
            WHERE tenant_slug = :tenant_slug
            ORDER BY created_at DESC
            LIMIT :limit
            """
        )
        async with PlatformSessionScoped() as session:
            rows = (
                await session.execute(stmt, {"tenant_slug": tenant_slug, "limit": limit})
            ).mappings().all()
        return [dict(row) for row in rows]

    async def compute_aging(self, tenant_slug: str, *, as_of: date) -> dict[str, Decimal]:
        """Compute A/R aging buckets for open receivables."""
        stmt = text(
            f"""
            SELECT
                COALESCE(SUM(CASE
                    WHEN due_date IS NULL OR :as_of <= due_date THEN amount_due
                    ELSE 0
                END), 0) AS current,
                COALESCE(SUM(CASE
                    WHEN due_date IS NOT NULL AND :as_of > due_date AND :as_of <= (due_date + INTERVAL '30 days') THEN amount_due
                    ELSE 0
                END), 0) AS bucket_30,
                COALESCE(SUM(CASE
                    WHEN due_date IS NOT NULL AND :as_of > (due_date + INTERVAL '30 days') AND :as_of <= (due_date + INTERVAL '60 days') THEN amount_due
                    ELSE 0
                END), 0) AS bucket_60,
                COALESCE(SUM(CASE
                    WHEN due_date IS NOT NULL AND :as_of > (due_date + INTERVAL '60 days') THEN amount_due
                    ELSE 0
                END), 0) AS bucket_90_plus
            FROM "{settings.PLATFORM_SCHEMA}".billing_invoice
            WHERE tenant_slug = :tenant_slug
              AND status IN ('open', 'uncollectible')
            """
        )
        async with PlatformSessionScoped() as session:
            row = (
                await session.execute(stmt, {"tenant_slug": tenant_slug, "as_of": as_of})
            ).mappings().first()
        mapped = dict(row or {})
        return {
            "current": Decimal(str(mapped.get("current") or "0")),
            "bucket_30": Decimal(str(mapped.get("bucket_30") or "0")),
            "bucket_60": Decimal(str(mapped.get("bucket_60") or "0")),
            "bucket_90_plus": Decimal(str(mapped.get("bucket_90_plus") or "0")),
        }

    async def upsert_webhook_event(
        self,
        *,
        provider: str,
        event_id: str,
        event_type: str,
        payload: dict[str, Any],
    ) -> bool:
        """Insert webhook event idempotently.

        Returns:
            True when inserted, False when duplicate idempotency key exists.
        """
        now = datetime.now(UTC)
        stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_webhook_event (
                uid,
                provider,
                idempotency_key,
                event_type,
                payload,
                processed,
                created_at,
                updated_at
            ) VALUES (
                :uid,
                :provider,
                :idempotency_key,
                :event_type,
                CAST(:payload AS jsonb),
                false,
                :created_at,
                :updated_at
            )
            ON CONFLICT (idempotency_key) DO NOTHING
            """
        )
        async with PlatformSessionScoped() as session:
            result = await session.execute(
                stmt,
                {
                    "uid": get_flake_uid(),
                    "provider": provider,
                    "idempotency_key": f"{provider}:{event_id}",
                    "event_type": event_type,
                    "payload": json.dumps(payload),
                    "created_at": now,
                    "updated_at": now,
                },
            )
            await session.commit()
        return result.rowcount > 0

    async def mark_webhook_processed(self, provider: str, event_id: str) -> None:
        """Mark webhook event processed."""
        now = datetime.now(UTC)
        stmt = text(
            f"""
            UPDATE "{settings.PLATFORM_SCHEMA}".billing_webhook_event
            SET processed = true,
                processed_at = :processed_at,
                updated_at = :updated_at
            WHERE idempotency_key = :idempotency_key
            """
        )
        async with PlatformSessionScoped() as session:
            await session.execute(
                stmt,
                {
                    "idempotency_key": f"{provider}:{event_id}",
                    "processed_at": now,
                    "updated_at": now,
                },
            )
            await session.commit()

    async def list_plans(self) -> list[dict[str, Any]]:
        """List billing plans with child limits/features."""
        await self.ensure_billing_refinement_tables()
        stmt = text(
            f"""
            SELECT uid, plan_code, name, active, currency, base_amount, created_at, updated_at
            FROM "{settings.PLATFORM_SCHEMA}".billing_plan
            ORDER BY plan_code ASC
            """
        )
        async with PlatformSessionScoped() as session:
            rows = (await session.execute(stmt)).mappings().all()
        plans = [dict(row) for row in rows]
        for plan in plans:
            plan["limits"] = await self.list_plan_limits(plan["uid"])
            plan["features"] = await self.list_plan_features(plan["uid"])
        return plans

    async def get_plan_by_code(self, plan_code: str) -> dict[str, Any] | None:
        """Fetch one billing plan by code with child rows."""
        await self.ensure_billing_refinement_tables()
        stmt = text(
            f"""
            SELECT uid, plan_code, name, active, currency, base_amount, created_at, updated_at
            FROM "{settings.PLATFORM_SCHEMA}".billing_plan
            WHERE plan_code = :plan_code
            LIMIT 1
            """
        )
        async with PlatformSessionScoped() as session:
            row = (await session.execute(stmt, {"plan_code": plan_code})).mappings().first()
        if not row:
            return None
        plan = dict(row)
        plan["limits"] = await self.list_plan_limits(plan["uid"])
        plan["features"] = await self.list_plan_features(plan["uid"])
        return plan

    async def upsert_plan(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Create or update billing plan by plan_code."""
        now = datetime.now(UTC)
        existing = await self.get_plan_by_code(str(payload["plan_code"]))
        if existing:
            stmt = text(
                f"""
                UPDATE "{settings.PLATFORM_SCHEMA}".billing_plan
                SET
                    name = :name,
                    active = :active,
                    currency = :currency,
                    base_amount = :base_amount,
                    updated_at = :updated_at
                WHERE uid = :uid
                """
            )
            params = {
                "uid": existing["uid"],
                "name": payload["name"],
                "active": payload.get("active", True),
                "currency": payload.get("currency", "USD"),
                "base_amount": payload.get("base_amount", Decimal("0")),
                "updated_at": now,
            }
            plan_uid = existing["uid"]
        else:
            plan_uid = get_flake_uid()
            stmt = text(
                f"""
                INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_plan (
                    uid, plan_code, name, active, currency, base_amount, created_at, updated_at
                ) VALUES (
                    :uid, :plan_code, :name, :active, :currency, :base_amount, :created_at, :updated_at
                )
                """
            )
            params = {
                "uid": plan_uid,
                "plan_code": payload["plan_code"],
                "name": payload["name"],
                "active": payload.get("active", True),
                "currency": payload.get("currency", "USD"),
                "base_amount": payload.get("base_amount", Decimal("0")),
                "created_at": now,
                "updated_at": now,
            }

        async with PlatformSessionScoped() as session:
            await session.execute(stmt, params)
            await session.commit()

        if "limits" in payload:
            await self.replace_plan_limits(plan_uid, payload.get("limits") or [])
        if "features" in payload:
            await self.replace_plan_features(plan_uid, payload.get("features") or [])

        refreshed = await self.get_plan_by_code(str(payload["plan_code"]))
        if not refreshed:
            raise RuntimeError("Failed to upsert billing plan")
        return refreshed

    async def list_plan_limits(self, plan_uid: str) -> list[dict[str, Any]]:
        stmt = text(
            f"""
            SELECT metric_key, limit_value, window, enforcement_mode
            FROM "{settings.PLATFORM_SCHEMA}".billing_plan_limit
            WHERE plan_uid = :plan_uid
            ORDER BY metric_key ASC
            """
        )
        async with PlatformSessionScoped() as session:
            rows = (await session.execute(stmt, {"plan_uid": plan_uid})).mappings().all()
        return [dict(row) for row in rows]

    async def list_plan_features(self, plan_uid: str) -> list[dict[str, Any]]:
        stmt = text(
            f"""
            SELECT feature_key, enabled, included_units, unit_price
            FROM "{settings.PLATFORM_SCHEMA}".billing_plan_feature
            WHERE plan_uid = :plan_uid
            ORDER BY feature_key ASC
            """
        )
        async with PlatformSessionScoped() as session:
            rows = (await session.execute(stmt, {"plan_uid": plan_uid})).mappings().all()
        return [dict(row) for row in rows]

    async def replace_plan_limits(self, plan_uid: str, limits: list[dict[str, Any]]) -> None:
        now = datetime.now(UTC)
        delete_stmt = text(
            f'DELETE FROM "{settings.PLATFORM_SCHEMA}".billing_plan_limit WHERE plan_uid = :plan_uid'
        )
        insert_stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_plan_limit (
                uid, plan_uid, metric_key, limit_value, window, enforcement_mode, created_at, updated_at
            ) VALUES (
                :uid, :plan_uid, :metric_key, :limit_value, :window, :enforcement_mode, :created_at, :updated_at
            )
            """
        )
        async with PlatformSessionScoped() as session:
            await session.execute(delete_stmt, {"plan_uid": plan_uid})
            for row in limits:
                await session.execute(
                    insert_stmt,
                    {
                        "uid": get_flake_uid(),
                        "plan_uid": plan_uid,
                        "metric_key": row["metric_key"],
                        "limit_value": row["limit_value"],
                        "window": row["window"],
                        "enforcement_mode": row.get("enforcement_mode", "hard_block"),
                        "created_at": now,
                        "updated_at": now,
                    },
                )
            await session.commit()

    async def replace_plan_features(self, plan_uid: str, features: list[dict[str, Any]]) -> None:
        now = datetime.now(UTC)
        delete_stmt = text(
            f'DELETE FROM "{settings.PLATFORM_SCHEMA}".billing_plan_feature WHERE plan_uid = :plan_uid'
        )
        insert_stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_plan_feature (
                uid, plan_uid, feature_key, enabled, included_units, unit_price, created_at, updated_at
            ) VALUES (
                :uid, :plan_uid, :feature_key, :enabled, :included_units, :unit_price, :created_at, :updated_at
            )
            """
        )
        async with PlatformSessionScoped() as session:
            await session.execute(delete_stmt, {"plan_uid": plan_uid})
            for row in features:
                await session.execute(
                    insert_stmt,
                    {
                        "uid": get_flake_uid(),
                        "plan_uid": plan_uid,
                        "feature_key": row["feature_key"],
                        "enabled": row.get("enabled", True),
                        "included_units": row.get("included_units", Decimal("0")),
                        "unit_price": row.get("unit_price", Decimal("0")),
                        "created_at": now,
                        "updated_at": now,
                    },
                )
            await session.commit()

    async def replace_tenant_overrides(
        self,
        tenant_slug: str,
        overrides: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """Replace override set for tenant."""
        await self.ensure_billing_refinement_tables()
        now = datetime.now(UTC)
        delete_stmt = text(
            f'DELETE FROM "{settings.PLATFORM_SCHEMA}".billing_tenant_override WHERE tenant_slug = :tenant_slug'
        )
        insert_stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_tenant_override (
                uid,
                tenant_slug,
                metric_key,
                feature_key,
                override_limit_value,
                override_enabled,
                window,
                enforcement_mode,
                metadata,
                created_at,
                updated_at
            ) VALUES (
                :uid,
                :tenant_slug,
                :metric_key,
                :feature_key,
                :override_limit_value,
                :override_enabled,
                :window,
                :enforcement_mode,
                CAST(:metadata AS jsonb),
                :created_at,
                :updated_at
            )
            """
        )
        async with PlatformSessionScoped() as session:
            await session.execute(delete_stmt, {"tenant_slug": tenant_slug})
            for row in overrides:
                await session.execute(
                    insert_stmt,
                    {
                        "uid": get_flake_uid(),
                        "tenant_slug": tenant_slug,
                        "metric_key": row.get("metric_key"),
                        "feature_key": row.get("feature_key"),
                        "override_limit_value": row.get("override_limit_value"),
                        "override_enabled": row.get("override_enabled"),
                        "window": row.get("window"),
                        "enforcement_mode": row.get("enforcement_mode"),
                        "metadata": json.dumps(row.get("metadata") or {}),
                        "created_at": now,
                        "updated_at": now,
                    },
                )
            await session.commit()
        return await self.list_tenant_overrides(tenant_slug)

    async def list_tenant_overrides(self, tenant_slug: str) -> list[dict[str, Any]]:
        await self.ensure_billing_refinement_tables()
        stmt = text(
            f"""
            SELECT
                tenant_slug,
                metric_key,
                feature_key,
                override_limit_value,
                override_enabled,
                window,
                enforcement_mode,
                COALESCE(metadata, '{{}}'::jsonb) AS metadata
            FROM "{settings.PLATFORM_SCHEMA}".billing_tenant_override
            WHERE tenant_slug = :tenant_slug
            ORDER BY feature_key NULLS LAST, metric_key NULLS LAST
            """
        )
        async with PlatformSessionScoped() as session:
            rows = (await session.execute(stmt, {"tenant_slug": tenant_slug})).mappings().all()
        return [dict(row) for row in rows]

    async def list_usage_counters(self, tenant_slug: str) -> list[dict[str, Any]]:
        await self.ensure_billing_refinement_tables()
        stmt = text(
            f"""
            SELECT metric_key, quantity, window_start, window_end, scope_user_uid, scope_lab_uid
            FROM "{settings.PLATFORM_SCHEMA}".billing_usage_counter
            WHERE tenant_slug = :tenant_slug
            ORDER BY window_start DESC, metric_key ASC
            """
        )
        async with PlatformSessionScoped() as session:
            rows = (await session.execute(stmt, {"tenant_slug": tenant_slug})).mappings().all()
        return [dict(row) for row in rows]

    async def get_tenant_schema(self, tenant_slug: str) -> str | None:
        """Resolve schema name for a tenant."""
        stmt = text(
            f"""
            SELECT schema_name
            FROM "{settings.PLATFORM_SCHEMA}".tenant
            WHERE slug = :tenant_slug
            LIMIT 1
            """
        )
        async with PlatformSessionScoped() as session:
            row = (await session.execute(stmt, {"tenant_slug": tenant_slug})).first()
        return str(row[0]) if row else None

    async def count_tenant_users(self, tenant_slug: str) -> int:
        """Count users in tenant schema."""
        schema = await self.get_tenant_schema(tenant_slug)
        if not schema:
            return 0
        stmt = text(f'SELECT COUNT(*) FROM "{schema}"."user"')
        async with PlatformSessionScoped() as session:
            count = (await session.execute(stmt)).scalar()
        return int(count or 0)

    async def count_tenant_labs(self, tenant_slug: str) -> int:
        """Count laboratories in tenant schema."""
        schema = await self.get_tenant_schema(tenant_slug)
        if not schema:
            return 0
        stmt = text(f'SELECT COUNT(*) FROM "{schema}"."laboratory"')
        async with PlatformSessionScoped() as session:
            count = (await session.execute(stmt)).scalar()
        return int(count or 0)

    async def get_usage_counter_value(
        self,
        *,
        tenant_slug: str,
        metric_key: str,
        window_start: datetime,
        scope_user_uid: str | None = None,
        scope_lab_uid: str | None = None,
    ) -> int:
        """Fetch current usage counter quantity for a metric dimension."""
        await self.ensure_billing_refinement_tables()
        stmt = text(
            f"""
            SELECT COALESCE(SUM(quantity), 0)
            FROM "{settings.PLATFORM_SCHEMA}".billing_usage_counter
            WHERE tenant_slug = :tenant_slug
              AND metric_key = :metric_key
              AND window_start = :window_start
              AND scope_user_uid IS NOT DISTINCT FROM :scope_user_uid
              AND scope_lab_uid IS NOT DISTINCT FROM :scope_lab_uid
            """
        )
        async with PlatformSessionScoped() as session:
            value = (
                await session.execute(
                    stmt,
                    {
                        "tenant_slug": tenant_slug,
                        "metric_key": metric_key,
                        "window_start": window_start,
                        "scope_user_uid": scope_user_uid,
                        "scope_lab_uid": scope_lab_uid,
                    },
                )
            ).scalar()
        return int(value or 0)

    async def increment_usage_counter(
        self,
        *,
        tenant_slug: str,
        metric_key: str,
        window_start: datetime,
        window_end: datetime,
        scope_user_uid: str | None = None,
        scope_lab_uid: str | None = None,
        delta: int = 1,
    ) -> None:
        """Increment usage counter for one metric window/dimension."""
        await self.ensure_billing_refinement_tables()
        now = datetime.now(UTC)
        update_stmt = text(
            f"""
            UPDATE "{settings.PLATFORM_SCHEMA}".billing_usage_counter
            SET quantity = quantity + :delta,
                updated_at = :updated_at
            WHERE tenant_slug = :tenant_slug
              AND metric_key = :metric_key
              AND window_start = :window_start
              AND scope_user_uid IS NOT DISTINCT FROM :scope_user_uid
              AND scope_lab_uid IS NOT DISTINCT FROM :scope_lab_uid
            """
        )
        insert_stmt = text(
            f"""
            INSERT INTO "{settings.PLATFORM_SCHEMA}".billing_usage_counter (
                uid,
                tenant_slug,
                metric_key,
                window_start,
                window_end,
                scope_user_uid,
                scope_lab_uid,
                quantity,
                created_at,
                updated_at
            ) VALUES (
                :uid,
                :tenant_slug,
                :metric_key,
                :window_start,
                :window_end,
                :scope_user_uid,
                :scope_lab_uid,
                :quantity,
                :created_at,
                :updated_at
            )
            """
        )
        async with PlatformSessionScoped() as session:
            result = await session.execute(
                update_stmt,
                {
                    "delta": delta,
                    "updated_at": now,
                    "tenant_slug": tenant_slug,
                    "metric_key": metric_key,
                    "window_start": window_start,
                    "scope_user_uid": scope_user_uid,
                    "scope_lab_uid": scope_lab_uid,
                },
            )
            if result.rowcount == 0:
                await session.execute(
                    insert_stmt,
                    {
                        "uid": get_flake_uid(),
                        "tenant_slug": tenant_slug,
                        "metric_key": metric_key,
                        "window_start": window_start,
                        "window_end": window_end,
                        "scope_user_uid": scope_user_uid,
                        "scope_lab_uid": scope_lab_uid,
                        "quantity": delta,
                        "created_at": now,
                        "updated_at": now,
                    },
                )
            await session.commit()
