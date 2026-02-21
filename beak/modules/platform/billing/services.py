"""Service orchestration for platform billing workflows."""

from __future__ import annotations

from datetime import UTC, date, datetime
from decimal import Decimal
from typing import Any

from beak.core.config import get_settings
from beak.modules.platform.billing.entities import (
    BillingInvoiceStatus,
    BillingPaymentAttemptStatus,
    BillingProvider,
    BillingSubscriptionStatus,
)
from beak.modules.platform.billing.providers.base import BillingProviderAdapter
from beak.modules.platform.billing.providers.paystack import PaystackBillingAdapter
from beak.modules.platform.billing.providers.stripe import StripeBillingAdapter
from beak.modules.platform.billing.repository import PlatformBillingRepository
from beak.modules.platform.billing.schemas import (
    BillingAgingSnapshot,
    BillingInvoice,
    BillingInvoiceCreatePayload,
    BillingPaymentAttempt,
    BillingProviderHealth,
    BillingProviderHealthResponse,
    BillingWebhookResult,
    InvoiceMarkPaidPayload,
    SubscriptionResponse,
    SubscriptionUpdatePayload,
    TenantBillingOverview,
    TenantBillingProfile,
    TenantBillingProfileUpdate,
)

settings = get_settings()

_ALLOWED_SUBSCRIPTION_TRANSITIONS: dict[BillingSubscriptionStatus, set[BillingSubscriptionStatus]] = {
    BillingSubscriptionStatus.TRIALING: {
        BillingSubscriptionStatus.ACTIVE,
        BillingSubscriptionStatus.CANCELED,
    },
    BillingSubscriptionStatus.ACTIVE: {
        BillingSubscriptionStatus.PAUSED,
        BillingSubscriptionStatus.PAST_DUE,
        BillingSubscriptionStatus.CANCELED,
    },
    BillingSubscriptionStatus.PAST_DUE: {
        BillingSubscriptionStatus.ACTIVE,
        BillingSubscriptionStatus.CANCELED,
    },
    BillingSubscriptionStatus.PAUSED: {
        BillingSubscriptionStatus.ACTIVE,
        BillingSubscriptionStatus.CANCELED,
    },
    BillingSubscriptionStatus.CANCELED: set(),
}


class PlatformBillingService:
    """Business service for platform billing operations."""

    def __init__(self) -> None:
        self.repository = PlatformBillingRepository()
        self._providers: dict[BillingProvider, BillingProviderAdapter] = {
            BillingProvider.STRIPE: StripeBillingAdapter(),
            BillingProvider.PAYSTACK: PaystackBillingAdapter(),
        }

    async def _assert_tenant_exists(self, tenant_slug: str) -> None:
        if not await self.repository.ensure_tenant_exists(tenant_slug):
            raise ValueError(f"Unknown tenant slug '{tenant_slug}'")

    def _provider(self, provider: BillingProvider) -> BillingProviderAdapter:
        adapter = self._providers.get(provider)
        if not adapter:
            raise ValueError(f"Unsupported provider '{provider}'")
        return adapter

    async def get_profile(self, tenant_slug: str) -> TenantBillingProfile:
        """Get tenant billing profile, creating default if missing."""
        await self._assert_tenant_exists(tenant_slug)
        profile = await self.repository.get_profile(tenant_slug)
        if not profile:
            profile = await self.repository.upsert_profile(tenant_slug, {})
        return TenantBillingProfile.model_validate(profile)

    async def update_profile(
        self,
        tenant_slug: str,
        payload: TenantBillingProfileUpdate,
    ) -> TenantBillingProfile:
        """Upsert tenant billing profile and sync provider customer."""
        await self._assert_tenant_exists(tenant_slug)
        data = payload.model_dump(exclude_none=True)
        profile = await self.repository.upsert_profile(tenant_slug, data)
        model = TenantBillingProfile.model_validate(profile)

        adapter = self._provider(model.provider_preference)
        provider_customer = await adapter.create_or_sync_customer(
            {
                "tenant_slug": tenant_slug,
                "customer_uid": model.customer_uid,
                "billing_email": model.billing_email,
                "legal_name": model.legal_name,
                "currency": model.currency,
                "provider_customer_id": model.metadata.get("provider_customer_id"),
            }
        )
        metadata = dict(model.metadata)
        provider_customer_id = provider_customer.get("provider_customer_id")
        if provider_customer_id:
            metadata["provider_customer_id"] = provider_customer_id
        refreshed = await self.repository.upsert_profile(
            tenant_slug,
            {"metadata": metadata},
        )
        return TenantBillingProfile.model_validate(refreshed)

    async def get_subscription(self, tenant_slug: str) -> SubscriptionResponse | None:
        """Get current subscription for tenant."""
        await self._assert_tenant_exists(tenant_slug)
        row = await self.repository.get_subscription(tenant_slug)
        if not row:
            return None
        return SubscriptionResponse.model_validate(row)

    async def update_subscription(
        self,
        tenant_slug: str,
        payload: SubscriptionUpdatePayload,
    ) -> SubscriptionResponse:
        """Create/update subscription with transition checks."""
        await self._assert_tenant_exists(tenant_slug)
        existing = await self.get_subscription(tenant_slug)
        if existing and existing.status != payload.status:
            allowed = _ALLOWED_SUBSCRIPTION_TRANSITIONS.get(existing.status, set())
            if payload.status not in allowed:
                raise ValueError(
                    f"Invalid subscription transition {existing.status} -> {payload.status}"
                )

        profile = await self.get_profile(tenant_slug)
        adapter = self._provider(profile.provider_preference)
        existing_metadata: dict[str, Any] = (
            dict(existing.metadata) if existing and existing.metadata else {}
        )
        provider_payload: dict[str, Any] = {
            "tenant_slug": tenant_slug,
            **payload.model_dump(),
            "provider_customer_id": profile.metadata.get("provider_customer_id"),
            "billing_email": profile.billing_email,
            "provider_subscription_id": existing_metadata.get("provider_subscription_id"),
            "provider_subscription_token": existing_metadata.get("provider_subscription_token"),
        }

        if existing:
            provider_subscription = await adapter.change_subscription(provider_payload)
        else:
            provider_subscription = await adapter.create_subscription(provider_payload)

        metadata = dict(payload.metadata)
        metadata.update(existing_metadata)
        if provider_subscription.get("provider_subscription_id"):
            metadata["provider_subscription_id"] = provider_subscription["provider_subscription_id"]
        if provider_subscription.get("provider_subscription_token"):
            metadata["provider_subscription_token"] = provider_subscription["provider_subscription_token"]

        row = await self.repository.upsert_subscription(
            tenant_slug,
            {
                **payload.model_dump(),
                "metadata": metadata,
            },
        )

        return SubscriptionResponse.model_validate(row)

    async def create_invoice(
        self,
        tenant_slug: str,
        payload: BillingInvoiceCreatePayload,
    ) -> BillingInvoice:
        """Create tenant draft invoice and optional auto progression."""
        await self._assert_tenant_exists(tenant_slug)
        lines = payload.lines
        subtotal = sum((line.amount for line in lines), Decimal("0"))
        row = await self.repository.create_invoice(
            tenant_slug,
            {
                **payload.model_dump(),
                "subtotal": subtotal,
            },
        )
        invoice = BillingInvoice.model_validate(row)
        profile = await self.get_profile(tenant_slug)
        adapter = self._provider(profile.provider_preference)
        provider_invoice = await adapter.create_invoice(
            {
                "tenant_slug": tenant_slug,
                "invoice_uid": invoice.uid,
                "invoice_number": invoice.invoice_number,
                "customer_uid": profile.customer_uid,
                "provider_customer_id": profile.metadata.get("provider_customer_id"),
                "billing_email": profile.billing_email,
                "currency": invoice.currency,
                "due_date": invoice.due_date.isoformat() if invoice.due_date else None,
                "amount_due": str(invoice.amount_due),
                "lines": [line.model_dump() for line in lines],
            }
        )
        metadata = dict(invoice.metadata)
        provider_invoice_id = provider_invoice.get("provider_invoice_id")
        if provider_invoice_id:
            metadata["provider_invoice_id"] = provider_invoice_id
        hosted_url = provider_invoice.get("provider_hosted_url")
        if hosted_url:
            metadata["provider_hosted_url"] = hosted_url
        if metadata != invoice.metadata:
            updated = await self.repository.update_invoice_metadata(
                tenant_slug=tenant_slug,
                invoice_uid=invoice.uid,
                metadata=metadata,
            )
            if updated:
                invoice = BillingInvoice.model_validate(updated)

        if profile.auto_finalize_invoices:
            invoice = await self.finalize_invoice(tenant_slug, invoice.uid)
        if profile.auto_send_invoices and invoice.status == BillingInvoiceStatus.OPEN:
            invoice = await self.send_invoice(tenant_slug, invoice.uid)
        return invoice

    async def list_invoices(self, tenant_slug: str) -> list[BillingInvoice]:
        """List tenant invoices."""
        await self._assert_tenant_exists(tenant_slug)
        rows = await self.repository.list_invoices(tenant_slug)
        return [BillingInvoice.model_validate(row) for row in rows]

    async def get_invoice(self, tenant_slug: str, invoice_uid: str) -> BillingInvoice | None:
        """Get one tenant invoice."""
        await self._assert_tenant_exists(tenant_slug)
        row = await self.repository.get_invoice(tenant_slug, invoice_uid)
        if not row:
            return None
        return BillingInvoice.model_validate(row)

    async def finalize_invoice(self, tenant_slug: str, invoice_uid: str) -> BillingInvoice:
        """Finalize draft invoice into open receivable."""
        invoice = await self.get_invoice(tenant_slug, invoice_uid)
        if not invoice:
            raise ValueError("Invoice not found")
        if invoice.status != BillingInvoiceStatus.DRAFT:
            raise ValueError("Only draft invoices can be finalized")

        row = await self.repository.update_invoice_status(
            tenant_slug,
            invoice_uid,
            status=BillingInvoiceStatus.OPEN,
            finalized_at=datetime.now(UTC),
        )
        if not row:
            raise ValueError("Invoice not found")

        profile = await self.get_profile(tenant_slug)
        adapter = self._provider(profile.provider_preference)
        await adapter.finalize_invoice(
            {
                "tenant_slug": tenant_slug,
                "invoice_uid": invoice_uid,
                "provider_invoice_id": invoice.metadata.get("provider_invoice_id"),
                "invoice_number": invoice.invoice_number,
                "amount_due": str(invoice.amount_due),
                "currency": invoice.currency,
            }
        )
        return BillingInvoice.model_validate(row)

    async def send_invoice(self, tenant_slug: str, invoice_uid: str) -> BillingInvoice:
        """Mark invoice sent after finalization."""
        invoice = await self.get_invoice(tenant_slug, invoice_uid)
        if not invoice:
            raise ValueError("Invoice not found")
        if invoice.status != BillingInvoiceStatus.OPEN:
            raise ValueError("Only open invoices can be sent")

        row = await self.repository.update_invoice_status(
            tenant_slug,
            invoice_uid,
            status=BillingInvoiceStatus.OPEN,
            sent_at=datetime.now(UTC),
        )
        if not row:
            raise ValueError("Invoice not found")
        return BillingInvoice.model_validate(row)

    async def mark_invoice_paid(
        self,
        tenant_slug: str,
        invoice_uid: str,
        payload: InvoiceMarkPaidPayload,
    ) -> BillingInvoice:
        """Manually mark invoice paid for off-platform reconciliation."""
        invoice = await self.get_invoice(tenant_slug, invoice_uid)
        if not invoice:
            raise ValueError("Invoice not found")
        if invoice.status not in {BillingInvoiceStatus.OPEN, BillingInvoiceStatus.UNCOLLECTIBLE}:
            raise ValueError("Only open or uncollectible invoices can be marked paid")

        amount_paid = payload.amount if payload.amount is not None else invoice.total_amount
        row = await self.repository.update_invoice_status(
            tenant_slug,
            invoice_uid,
            status=BillingInvoiceStatus.PAID,
            paid_at=datetime.now(UTC),
            amount_paid=amount_paid,
        )
        if not row:
            raise ValueError("Invoice not found")

        await self.repository.create_payment_attempt(
            tenant_slug=tenant_slug,
            invoice_uid=invoice_uid,
            provider=BillingProvider.STRIPE,
            status=BillingPaymentAttemptStatus.SUCCEEDED,
            amount=amount_paid,
            currency=invoice.currency,
            provider_reference=payload.payment_reference,
            failure_reason=None,
            metadata={"source": "manual_mark_paid", "note": payload.note},
        )
        return BillingInvoice.model_validate(row)

    async def list_payment_attempts(self, tenant_slug: str, *, limit: int = 20) -> list[BillingPaymentAttempt]:
        """List recent payment attempts."""
        await self._assert_tenant_exists(tenant_slug)
        rows = await self.repository.list_payment_attempts(tenant_slug, limit=limit)
        return [BillingPaymentAttempt.model_validate(row) for row in rows]

    async def get_provider_health(self) -> BillingProviderHealthResponse:
        """Return provider health/config snapshot."""
        stripe_ok = bool(settings.STRIPE_SECRET_KEY and settings.STRIPE_WEBHOOK_SECRET)
        paystack_ok = bool(settings.PAYSTACK_SECRET_KEY and settings.PAYSTACK_WEBHOOK_SECRET)

        return BillingProviderHealthResponse(
            providers=[
                BillingProviderHealth(
                    provider=BillingProvider.STRIPE,
                    healthy=stripe_ok,
                    details=(
                        "Configured" if stripe_ok else "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET"
                    ),
                ),
                BillingProviderHealth(
                    provider=BillingProvider.PAYSTACK,
                    healthy=paystack_ok,
                    details=(
                        "Configured" if paystack_ok else "Missing PAYSTACK_SECRET_KEY or PAYSTACK_WEBHOOK_SECRET"
                    ),
                ),
            ]
        )

    async def get_overview(self, tenant_slug: str) -> TenantBillingOverview:
        """Return tenant billing overview for platform table."""
        await self._assert_tenant_exists(tenant_slug)
        subscription = await self.get_subscription(tenant_slug)
        aging_raw = await self.repository.compute_aging(tenant_slug, as_of=date.today())
        aging = BillingAgingSnapshot(
            current=aging_raw["current"],
            bucket_30=aging_raw["bucket_30"],
            bucket_60=aging_raw["bucket_60"],
            bucket_90_plus=aging_raw["bucket_90_plus"],
        )
        return TenantBillingOverview(
            tenant_slug=tenant_slug,
            plan_code=subscription.plan_code if subscription else None,
            subscription_status=subscription.status if subscription else None,
            mrr_snapshot=subscription.mrr_snapshot if subscription else Decimal("0"),
            aging=aging,
        )

    async def process_webhook(
        self,
        *,
        provider: BillingProvider,
        payload: dict[str, Any],
    ) -> BillingWebhookResult:
        """Process webhook events with idempotency and reconciliation updates."""
        adapter = self._provider(provider)
        normalized = adapter.parse_webhook(payload)

        event_id = str(normalized.get("event_id") or "")
        event_type = str(normalized.get("event_type") or "unknown")
        if not event_id:
            raise ValueError("Webhook event_id missing")

        inserted = await self.repository.upsert_webhook_event(
            provider=provider,
            event_id=event_id,
            event_type=event_type,
            payload=payload,
        )
        if not inserted:
            return BillingWebhookResult(
                provider=provider,
                event_id=event_id,
                accepted=True,
                duplicate=True,
                detail="Duplicate event ignored",
            )

        tenant_slug = normalized.get("tenant_slug")
        invoice_uid = normalized.get("invoice_uid")
        status_value = str(normalized.get("status") or "pending")

        if tenant_slug and invoice_uid:
            invoice = await self.get_invoice(tenant_slug, invoice_uid)
            if invoice:
                if status_value in {"paid", "succeeded", "success"}:
                    await self.repository.update_invoice_status(
                        tenant_slug,
                        invoice_uid,
                        status=BillingInvoiceStatus.PAID,
                        paid_at=datetime.now(UTC),
                        amount_paid=Decimal(str(normalized.get("amount") or invoice.total_amount)),
                    )
                elif status_value in {"open", "pending"} and invoice.status == BillingInvoiceStatus.DRAFT:
                    await self.repository.update_invoice_status(
                        tenant_slug,
                        invoice_uid,
                        status=BillingInvoiceStatus.OPEN,
                        finalized_at=datetime.now(UTC),
                    )

                attempt_status = (
                    BillingPaymentAttemptStatus.SUCCEEDED
                    if status_value in {"paid", "succeeded", "success"}
                    else BillingPaymentAttemptStatus.PENDING
                )
                await self.repository.create_payment_attempt(
                    tenant_slug=tenant_slug,
                    invoice_uid=invoice_uid,
                    provider=provider,
                    status=attempt_status,
                    amount=Decimal(str(normalized.get("amount") or invoice.amount_due)),
                    currency=str(normalized.get("currency") or invoice.currency).upper(),
                    provider_reference=(
                        str(normalized.get("provider_reference"))
                        if normalized.get("provider_reference")
                        else None
                    ),
                    failure_reason=None,
                    metadata={"event_type": event_type},
                )

        await self.repository.mark_webhook_processed(provider, event_id)
        return BillingWebhookResult(
            provider=provider,
            event_id=event_id,
            accepted=True,
            duplicate=False,
            detail="Webhook processed",
        )
