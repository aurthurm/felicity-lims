"""Service orchestration for platform billing workflows."""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta
from decimal import Decimal
import re
from typing import Any

from beak.core.config import get_settings
from beak.modules.platform.billing.entities import (
    BillingEnforcementMode,
    BillingPaymentProofStatus,
    BillingInvoiceStatus,
    BillingLimitMetricKey,
    BillingLimitWindow,
    BillingPaymentAttemptStatus,
    BillingProvider,
    BillingSubscriptionStatus,
)
from beak.modules.shared.infrastructure.minio import MinioClient
from beak.modules.shared.infrastructure.minio.buckets import MinioBucket
from beak.modules.shared.infrastructure.scope import resolve_storage_scope
from beak.modules.platform.billing.providers.base import BillingProviderAdapter
from beak.modules.platform.billing.providers.paystack import PaystackBillingAdapter
from beak.modules.platform.billing.providers.stripe import StripeBillingAdapter
from beak.modules.platform.billing.repository import PlatformBillingRepository
from beak.modules.platform.billing.schemas import (
    BillingAgingSnapshot,
    BillingInvoice,
    BillingInvoiceCreatePayload,
    BillingPaymentProof,
    BillingPaymentProofCreateResponse,
    BillingPaymentProofReviewPayload,
    BillingPlanCreate,
    BillingPlanOut,
    BillingPlanUpdate,
    BillingPaymentAttempt,
    BillingProviderHealth,
    BillingProviderHealthResponse,
    BillingWebhookResult,
    InvoiceMarkPaidPayload,
    SubscriptionResponse,
    SubscriptionUpdatePayload,
    TenantEffectiveFeature,
    TenantEffectiveLimit,
    TenantBillingOverview,
    TenantBillingProfile,
    TenantBillingProfileUpdate,
    TenantEntitlementOverrideInput,
    TenantEntitlementsOut,
    TenantUsageSnapshot,
    UsageCounterRow,
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
        self._storage: MinioClient | None = None
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

    def _get_storage(self) -> MinioClient:
        if self._storage is not None:
            return self._storage
        if not settings.MINIO_SERVER:
            raise ValueError("MINIO_SERVER is required for payment proof uploads")
        self._storage = MinioClient()
        return self._storage

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

    async def list_payment_proofs(
        self,
        tenant_slug: str,
        *,
        invoice_uid: str | None = None,
        limit: int = 100,
    ) -> list[BillingPaymentProof]:
        """List submitted payment proofs for a tenant."""
        await self._assert_tenant_exists(tenant_slug)
        rows = await self.repository.list_payment_proofs(
            tenant_slug=tenant_slug,
            invoice_uid=invoice_uid,
            limit=limit,
        )
        return [BillingPaymentProof.model_validate(row) for row in rows]

    async def submit_payment_proof(
        self,
        *,
        tenant_slug: str,
        invoice_uid: str,
        file_bytes: bytes,
        original_filename: str,
        content_type: str,
        amount: Decimal | None = None,
        currency: str | None = None,
        payment_method: str | None = None,
        payment_reference: str | None = None,
        note: str | None = None,
    ) -> BillingPaymentProofCreateResponse:
        """Upload and record a tenant payment-proof attachment for an invoice."""
        await self._assert_tenant_exists(tenant_slug)
        invoice = await self.get_invoice(tenant_slug, invoice_uid)
        if not invoice:
            raise ValueError("Invoice not found")
        if invoice.status in {BillingInvoiceStatus.PAID, BillingInvoiceStatus.VOID}:
            raise ValueError("Cannot upload proof for paid/void invoice")

        cleaned_name = re.sub(r"[^a-zA-Z0-9._-]+", "_", original_filename).strip("._")
        safe_name = cleaned_name or "proof.bin"
        proof_uid = f"pf-{datetime.now(UTC).strftime('%Y%m%d%H%M%S')}-{invoice_uid[-6:]}"
        object_name = f"{invoice_uid}/{proof_uid}-{safe_name}"
        scope = resolve_storage_scope(tenant_slug=tenant_slug, require_tenant=True)

        storage = self._get_storage()
        storage.put_object(
            bucket=MinioBucket.INVOICE,
            object_name=object_name,
            data=file_bytes,
            metadata={
                "tenant_slug": tenant_slug,
                "invoice_uid": invoice_uid,
                "payment_reference": payment_reference or "",
            },
            content_type=content_type or "application/octet-stream",
            scope=scope,
            domain="billing-payment-proof",
        )

        proof = await self.repository.create_payment_proof(
            tenant_slug=tenant_slug,
            invoice_uid=invoice_uid,
            amount=amount,
            currency=currency,
            payment_method=payment_method,
            payment_reference=payment_reference,
            note=note,
            original_filename=safe_name,
            content_type=content_type or "application/octet-stream",
            size_bytes=len(file_bytes),
            bucket_name=str(MinioBucket.INVOICE),
            object_name=object_name,
            metadata={},
        )
        return BillingPaymentProofCreateResponse(proof=BillingPaymentProof.model_validate(proof))

    async def get_payment_proof_download(
        self,
        *,
        tenant_slug: str,
        proof_uid: str,
    ) -> tuple[BillingPaymentProof, bytes]:
        """Fetch payment proof metadata and file bytes for secure download."""
        await self._assert_tenant_exists(tenant_slug)
        row = await self.repository.get_payment_proof(tenant_slug=tenant_slug, proof_uid=proof_uid)
        if not row:
            raise ValueError("Payment proof not found")
        proof = BillingPaymentProof.model_validate(row)
        scope = resolve_storage_scope(tenant_slug=tenant_slug, require_tenant=True)
        storage = self._get_storage()
        payloads = storage.get_object(
            bucket=MinioBucket(proof.bucket_name),
            object_names=[proof.object_name],
            scope=scope,
            domain="billing-payment-proof",
        )
        if not payloads:
            raise ValueError("Payment proof file missing")
        return proof, payloads[0]

    async def review_payment_proof(
        self,
        *,
        tenant_slug: str,
        proof_uid: str,
        payload: BillingPaymentProofReviewPayload,
        reviewed_by: str | None = None,
    ) -> BillingPaymentProof:
        """Review a tenant payment proof and optionally settle the invoice."""
        await self._assert_tenant_exists(tenant_slug)
        row = await self.repository.get_payment_proof(tenant_slug=tenant_slug, proof_uid=proof_uid)
        if not row:
            raise ValueError("Payment proof not found")

        if payload.status == BillingPaymentProofStatus.SUBMITTED:
            raise ValueError("Review status must be reviewed or rejected")

        proof = BillingPaymentProof.model_validate(row)
        metadata = dict(proof.metadata or {})
        metadata["reviewed_by"] = reviewed_by
        metadata["reviewed_at"] = datetime.now(UTC).isoformat()
        if payload.note:
            metadata["review_note"] = payload.note

        updated = await self.repository.update_payment_proof(
            tenant_slug=tenant_slug,
            proof_uid=proof_uid,
            status=str(payload.status),
            note=payload.note,
            metadata=metadata,
        )
        if not updated:
            raise ValueError("Payment proof not found")

        if payload.mark_invoice_paid:
            if payload.status != BillingPaymentProofStatus.REVIEWED:
                raise ValueError("Cannot mark invoice paid when proof is rejected")
            mark_payload = InvoiceMarkPaidPayload(
                amount=payload.amount,
                payment_reference=payload.payment_reference or proof.payment_reference,
                note=payload.note or f"Marked paid from proof {proof_uid}",
            )
            await self.mark_invoice_paid(tenant_slug, proof.invoice_uid, mark_payload)

        refreshed = await self.repository.get_payment_proof(tenant_slug=tenant_slug, proof_uid=proof_uid)
        if not refreshed:
            raise ValueError("Payment proof not found")
        return BillingPaymentProof.model_validate(refreshed)

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

    async def list_plans(self) -> list[BillingPlanOut]:
        """List all billing plans."""
        rows = await self.repository.list_plans()
        return [BillingPlanOut.model_validate(row) for row in rows]

    async def upsert_plan(
        self,
        plan_code: str,
        payload: BillingPlanCreate | BillingPlanUpdate,
    ) -> BillingPlanOut:
        """Create or update a billing plan."""
        if isinstance(payload, BillingPlanCreate):
            data = payload.model_dump()
        else:
            existing = await self.repository.get_plan_by_code(plan_code)
            if not existing:
                raise ValueError(f"Unknown billing plan '{plan_code}'")
            data = {
                "plan_code": plan_code,
                "name": payload.name if payload.name is not None else existing["name"],
                "active": payload.active if payload.active is not None else existing["active"],
                "currency": payload.currency if payload.currency is not None else existing["currency"],
                "base_amount": (
                    payload.base_amount if payload.base_amount is not None else existing["base_amount"]
                ),
            }
            if payload.limits is not None:
                data["limits"] = [row.model_dump() for row in payload.limits]
            if payload.features is not None:
                data["features"] = [row.model_dump() for row in payload.features]
        if "plan_code" not in data:
            data["plan_code"] = plan_code
        row = await self.repository.upsert_plan(data)
        return BillingPlanOut.model_validate(row)

    async def get_tenant_entitlements(self, tenant_slug: str) -> TenantEntitlementsOut | None:
        """Resolve effective limits and features for a tenant."""
        await self._assert_tenant_exists(tenant_slug)
        subscription = await self.get_subscription(tenant_slug)
        if not subscription:
            return None
        plan = await self.repository.get_plan_by_code(subscription.plan_code)
        if not plan:
            raise ValueError(f"No billing plan configured for plan_code '{subscription.plan_code}'")

        limit_map: dict[str, dict[str, Any]] = {
            item["metric_key"]: dict(item) for item in plan.get("limits", [])
        }
        feature_map: dict[str, dict[str, Any]] = {
            item["feature_key"]: dict(item) for item in plan.get("features", [])
        }
        overrides = await self.repository.list_tenant_overrides(tenant_slug)
        for override in overrides:
            metric_key = override.get("metric_key")
            feature_key = override.get("feature_key")
            if metric_key and metric_key in limit_map:
                if override.get("override_limit_value") is not None:
                    limit_map[metric_key]["limit_value"] = int(override["override_limit_value"])
                if override.get("window"):
                    limit_map[metric_key]["window"] = override["window"]
                if override.get("enforcement_mode"):
                    limit_map[metric_key]["enforcement_mode"] = override["enforcement_mode"]
            elif metric_key and metric_key not in limit_map:
                limit_map[metric_key] = {
                    "metric_key": metric_key,
                    "limit_value": int(override.get("override_limit_value") or 0),
                    "window": override.get("window") or BillingLimitWindow.MONTH,
                    "enforcement_mode": (
                        override.get("enforcement_mode") or BillingEnforcementMode.HARD_BLOCK
                    ),
                }

            if feature_key and feature_key in feature_map:
                if override.get("override_enabled") is not None:
                    feature_map[feature_key]["enabled"] = bool(override["override_enabled"])
            elif feature_key and feature_key not in feature_map:
                feature_map[feature_key] = {
                    "feature_key": feature_key,
                    "enabled": bool(override.get("override_enabled", False)),
                    "included_units": Decimal("0"),
                    "unit_price": Decimal("0"),
                }

        limits = [
            TenantEffectiveLimit.model_validate(item)
            for item in sorted(limit_map.values(), key=lambda row: str(row["metric_key"]))
        ]
        features = [
            TenantEffectiveFeature.model_validate(item)
            for item in sorted(feature_map.values(), key=lambda row: str(row["feature_key"]))
        ]
        return TenantEntitlementsOut(
            tenant_slug=tenant_slug,
            plan_code=subscription.plan_code,
            limits=limits,
            features=features,
        )

    async def upsert_tenant_overrides(
        self,
        tenant_slug: str,
        overrides: list[TenantEntitlementOverrideInput],
    ) -> TenantEntitlementsOut:
        """Replace tenant override set then resolve effective entitlements."""
        await self._assert_tenant_exists(tenant_slug)
        rows = [item.model_dump() for item in overrides]
        for row in rows:
            if not row.get("metric_key") and not row.get("feature_key"):
                raise ValueError("Each override must include metric_key or feature_key")
        await self.repository.replace_tenant_overrides(tenant_slug, rows)
        return await self.get_tenant_entitlements(tenant_slug)

    async def get_usage_snapshot(self, tenant_slug: str) -> TenantUsageSnapshot:
        """Return usage counters for tenant."""
        await self._assert_tenant_exists(tenant_slug)
        rows = await self.repository.list_usage_counters(tenant_slug)
        return TenantUsageSnapshot(
            tenant_slug=tenant_slug,
            rows=[UsageCounterRow.model_validate(row) for row in rows],
        )

    async def enforce_tenant_user_capacity(self, tenant_slug: str) -> None:
        """Raise when tenant user cap would be exceeded."""
        entitlements = await self.get_tenant_entitlements(tenant_slug)
        if not entitlements:
            return
        row = next(
            (item for item in entitlements.limits if item.metric_key == BillingLimitMetricKey.TENANT_USERS),
            None,
        )
        if not row:
            return
        current = await self.repository.count_tenant_users(tenant_slug)
        if current >= row.limit_value:
            raise ValueError(
                f"CAP_LIMIT_EXCEEDED metric=tenant_users limit={row.limit_value} current={current}"
            )

    async def enforce_tenant_lab_capacity(self, tenant_slug: str) -> None:
        """Raise when tenant laboratory cap would be exceeded."""
        entitlements = await self.get_tenant_entitlements(tenant_slug)
        if not entitlements:
            return
        row = next(
            (item for item in entitlements.limits if item.metric_key == BillingLimitMetricKey.TENANT_LABS),
            None,
        )
        if not row:
            return
        current = await self.repository.count_tenant_labs(tenant_slug)
        if current >= row.limit_value:
            raise ValueError(
                f"CAP_LIMIT_EXCEEDED metric=tenant_labs limit={row.limit_value} current={current}"
            )

    async def assert_feature_enabled(self, tenant_slug: str, feature_key: str) -> None:
        """Raise when a billable feature is disabled for tenant."""
        entitlements = await self.get_tenant_entitlements(tenant_slug)
        if not entitlements:
            return
        row = next((item for item in entitlements.features if item.feature_key == feature_key), None)
        if not row or not row.enabled:
            raise ValueError(
                f"FEATURE_NOT_ENTITLED feature={feature_key} tenant={tenant_slug} plan={entitlements.plan_code}"
            )

    async def check_and_increment_request_limit(
        self,
        *,
        tenant_slug: str,
        metric_key: BillingLimitMetricKey,
        scope_user_uid: str | None = None,
        scope_lab_uid: str | None = None,
    ) -> tuple[int, int] | None:
        """Validate request metric cap and increment usage counter."""
        entitlements = await self.get_tenant_entitlements(tenant_slug)
        if not entitlements:
            return None
        limit_row = next((item for item in entitlements.limits if item.metric_key == metric_key), None)
        if not limit_row:
            return None
        if limit_row.window == BillingLimitWindow.INSTANT:
            return None
        window_start, window_end = self._window_bounds(limit_row.window)
        current = await self.repository.get_usage_counter_value(
            tenant_slug=tenant_slug,
            metric_key=str(metric_key),
            window_start=window_start,
            scope_user_uid=scope_user_uid,
            scope_lab_uid=scope_lab_uid,
        )
        if current + 1 > limit_row.limit_value:
            raise ValueError(
                "CAP_LIMIT_EXCEEDED "
                f"metric={metric_key} limit={limit_row.limit_value} current={current} "
                f"window={limit_row.window}"
            )
        await self.repository.increment_usage_counter(
            tenant_slug=tenant_slug,
            metric_key=str(metric_key),
            window_start=window_start,
            window_end=window_end,
            scope_user_uid=scope_user_uid,
            scope_lab_uid=scope_lab_uid,
            delta=1,
        )
        return current + 1, limit_row.limit_value

    def _window_bounds(self, window: BillingLimitWindow) -> tuple[datetime, datetime]:
        now = datetime.now(UTC)
        if window == BillingLimitWindow.MINUTE:
            start = now.replace(second=0, microsecond=0)
            end = start.replace(second=59, microsecond=999999)
            return start, end
        if window == BillingLimitWindow.HOUR:
            start = now.replace(minute=0, second=0, microsecond=0)
            end = start.replace(minute=59, second=59, microsecond=999999)
            return start, end
        if window == BillingLimitWindow.DAY:
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end = now.replace(hour=23, minute=59, second=59, microsecond=999999)
            return start, end
        # month fallback
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if start.month == 12:
            next_month = start.replace(year=start.year + 1, month=1, day=1)
        else:
            next_month = start.replace(month=start.month + 1, day=1)
        end = next_month.replace(microsecond=0) - timedelta(microseconds=1)
        return start, end
