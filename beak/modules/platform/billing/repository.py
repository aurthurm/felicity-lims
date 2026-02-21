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
