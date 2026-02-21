from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any

import pytest

from beak.modules.platform.billing.entities import (
    BillingInvoiceStatus,
    BillingPaymentAttemptStatus,
    BillingProvider,
    BillingSubscriptionStatus,
)
from beak.modules.platform.billing.schemas import (
    BillingInvoiceCreatePayload,
    BillingInvoiceLineCreate,
    SubscriptionUpdatePayload,
    TenantBillingProfileUpdate,
)
from beak.modules.platform.billing.services import PlatformBillingService


class FakeAdapter:
    def __init__(self) -> None:
        self.calls: list[tuple[str, dict[str, Any]]] = []
        self.customer_result: dict[str, Any] = {"provider_customer_id": "cus_fake"}
        self.subscription_result: dict[str, Any] = {
            "provider_subscription_id": "sub_fake",
            "provider_subscription_token": "tok_fake",
        }
        self.invoice_result: dict[str, Any] = {
            "provider_invoice_id": "pinv_fake",
            "provider_hosted_url": "https://example.test/invoice",
        }

    async def create_or_sync_customer(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.calls.append(("create_or_sync_customer", payload))
        return self.customer_result

    async def create_subscription(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.calls.append(("create_subscription", payload))
        return self.subscription_result

    async def change_subscription(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.calls.append(("change_subscription", payload))
        return self.subscription_result

    async def create_invoice(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.calls.append(("create_invoice", payload))
        return self.invoice_result

    async def finalize_invoice(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.calls.append(("finalize_invoice", payload))
        return {"status": "open"}

    async def collect_payment(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.calls.append(("collect_payment", payload))
        return {"status": "succeeded"}

    def parse_webhook(self, payload: dict[str, Any]) -> dict[str, Any]:
        data = payload.get("data") or {}
        return {
            "event_id": payload.get("id"),
            "event_type": payload.get("type", "unknown"),
            "tenant_slug": data.get("tenant_slug"),
            "invoice_uid": data.get("invoice_uid"),
            "amount": data.get("amount", 0),
            "currency": data.get("currency", "USD"),
            "status": data.get("status", "pending"),
            "provider_reference": data.get("provider_reference", "pref_1"),
        }


class FakeRepository:
    def __init__(self) -> None:
        self.profile: dict[str, Any] | None = None
        self.subscription: dict[str, Any] | None = None
        self.invoice: dict[str, Any] | None = None
        self.ensure_tenant_exists_result = True

        self.upsert_profile_calls: list[dict[str, Any]] = []
        self.upsert_subscription_calls: list[dict[str, Any]] = []
        self.update_invoice_metadata_calls: list[dict[str, Any]] = []
        self.update_invoice_status_calls: list[dict[str, Any]] = []
        self.create_payment_attempt_calls: list[dict[str, Any]] = []
        self.mark_webhook_processed_calls: list[tuple[Any, str]] = []

        self.upsert_webhook_event_result = True

    async def ensure_tenant_exists(self, tenant_slug: str) -> bool:
        return self.ensure_tenant_exists_result

    async def get_profile(self, tenant_slug: str) -> dict[str, Any] | None:
        return self.profile

    async def upsert_profile(self, tenant_slug: str, payload: dict[str, Any]) -> dict[str, Any]:
        self.upsert_profile_calls.append(payload)
        base = self.profile or {
            "tenant_slug": tenant_slug,
            "customer_uid": "cust_uid_1",
            "legal_name": None,
            "billing_email": None,
            "currency": "USD",
            "country": None,
            "provider_preference": "stripe",
            "auto_finalize_invoices": False,
            "auto_send_invoices": False,
            "payment_terms_days": 30,
            "metadata": {},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        if "metadata" in payload:
            merged_metadata = dict(base.get("metadata") or {})
            merged_metadata.update(payload.get("metadata") or {})
            base = {**base, "metadata": merged_metadata}
        for key, value in payload.items():
            if key != "metadata":
                base[key] = value
        self.profile = base
        return self.profile

    async def get_subscription(self, tenant_slug: str) -> dict[str, Any] | None:
        return self.subscription

    async def upsert_subscription(self, tenant_slug: str, payload: dict[str, Any]) -> dict[str, Any]:
        self.upsert_subscription_calls.append(payload)
        self.subscription = {
            "uid": "sub_uid_1",
            "tenant_slug": tenant_slug,
            "plan_code": payload["plan_code"],
            "status": payload["status"],
            "base_amount": payload["base_amount"],
            "usage_overage_amount": payload["usage_overage_amount"],
            "mrr_snapshot": payload["mrr_snapshot"],
            "next_billing_date": payload.get("next_billing_date"),
            "starts_at": payload.get("starts_at"),
            "ends_at": payload.get("ends_at"),
            "paused_at": payload.get("paused_at"),
            "canceled_at": payload.get("canceled_at"),
            "metadata": payload.get("metadata") or {},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        return self.subscription

    async def create_invoice(self, tenant_slug: str, payload: dict[str, Any]) -> dict[str, Any]:
        self.invoice = {
            "uid": "inv_uid_1",
            "tenant_slug": tenant_slug,
            "invoice_number": "INV-202602-000001",
            "status": "draft",
            "currency": payload.get("currency", "USD"),
            "subtotal": payload.get("subtotal", Decimal("0")),
            "tax_amount": payload.get("tax_amount", Decimal("0")),
            "total_amount": payload.get("subtotal", Decimal("0")) + payload.get("tax_amount", Decimal("0")),
            "amount_due": payload.get("subtotal", Decimal("0")) + payload.get("tax_amount", Decimal("0")),
            "amount_paid": Decimal("0"),
            "due_date": payload.get("due_date"),
            "issued_at": datetime.utcnow(),
            "finalized_at": None,
            "sent_at": None,
            "paid_at": None,
            "metadata": payload.get("metadata") or {},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        return self.invoice

    async def update_invoice_metadata(
        self,
        tenant_slug: str,
        invoice_uid: str,
        metadata: dict[str, Any],
    ) -> dict[str, Any] | None:
        self.update_invoice_metadata_calls.append(metadata)
        if not self.invoice:
            return None
        self.invoice["metadata"] = metadata
        return self.invoice

    async def get_invoice(self, tenant_slug: str, invoice_uid: str) -> dict[str, Any] | None:
        return self.invoice

    async def update_invoice_status(self, tenant_slug: str, invoice_uid: str, **kwargs: Any) -> dict[str, Any] | None:
        self.update_invoice_status_calls.append(kwargs)
        if not self.invoice:
            return None
        self.invoice["status"] = kwargs.get("status", self.invoice["status"])
        if kwargs.get("paid_at"):
            self.invoice["paid_at"] = kwargs["paid_at"]
        if kwargs.get("amount_paid") is not None:
            self.invoice["amount_paid"] = kwargs["amount_paid"]
        return self.invoice

    async def create_payment_attempt(self, **kwargs: Any) -> dict[str, Any]:
        self.create_payment_attempt_calls.append(kwargs)
        return kwargs

    async def list_payment_attempts(self, tenant_slug: str, *, limit: int = 20) -> list[dict[str, Any]]:
        return []

    async def compute_aging(self, tenant_slug: str, *, as_of: Any) -> dict[str, Decimal]:
        return {
            "current": Decimal("0"),
            "bucket_30": Decimal("0"),
            "bucket_60": Decimal("0"),
            "bucket_90_plus": Decimal("0"),
        }

    async def upsert_webhook_event(self, **kwargs: Any) -> bool:
        return self.upsert_webhook_event_result

    async def mark_webhook_processed(self, provider: Any, event_id: str) -> None:
        self.mark_webhook_processed_calls.append((provider, event_id))


@pytest.fixture
def service_with_fakes() -> tuple[PlatformBillingService, FakeRepository, FakeAdapter]:
    service = PlatformBillingService()
    repo = FakeRepository()
    adapter = FakeAdapter()
    service.repository = repo  # type: ignore[assignment]
    service._providers = {
        BillingProvider.STRIPE: adapter,
        BillingProvider.PAYSTACK: adapter,
    }
    return service, repo, adapter


@pytest.mark.asyncio
async def test_update_profile_persists_provider_customer_id(
    service_with_fakes: tuple[PlatformBillingService, FakeRepository, FakeAdapter],
) -> None:
    service, repo, _ = service_with_fakes
    repo.profile = {
        "tenant_slug": "acme",
        "customer_uid": "cust_uid_1",
        "legal_name": "Acme",
        "billing_email": "billing@acme.test",
        "currency": "USD",
        "country": "US",
        "provider_preference": "stripe",
        "auto_finalize_invoices": False,
        "auto_send_invoices": False,
        "payment_terms_days": 30,
        "metadata": {},
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await service.update_profile(
        "acme",
        TenantBillingProfileUpdate(legal_name="Acme Labs", billing_email="billing@acme.test"),
    )

    assert result.metadata["provider_customer_id"] == "cus_fake"
    assert len(repo.upsert_profile_calls) == 2
    assert repo.upsert_profile_calls[1]["metadata"]["provider_customer_id"] == "cus_fake"


@pytest.mark.asyncio
async def test_update_subscription_rejects_invalid_transition(
    service_with_fakes: tuple[PlatformBillingService, FakeRepository, FakeAdapter],
) -> None:
    service, repo, _ = service_with_fakes
    repo.subscription = {
        "uid": "sub_uid_1",
        "tenant_slug": "acme",
        "plan_code": "starter",
        "status": BillingSubscriptionStatus.CANCELED,
        "base_amount": Decimal("10"),
        "usage_overage_amount": Decimal("0"),
        "mrr_snapshot": Decimal("10"),
        "next_billing_date": None,
        "starts_at": None,
        "ends_at": None,
        "paused_at": None,
        "canceled_at": None,
        "metadata": {},
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    with pytest.raises(ValueError, match="Invalid subscription transition"):
        await service.update_subscription(
            "acme",
            SubscriptionUpdatePayload(
                plan_code="pro",
                status=BillingSubscriptionStatus.ACTIVE,
                base_amount=Decimal("20"),
                usage_overage_amount=Decimal("0"),
                mrr_snapshot=Decimal("20"),
            ),
        )


@pytest.mark.asyncio
async def test_update_subscription_persists_provider_subscription_metadata(
    service_with_fakes: tuple[PlatformBillingService, FakeRepository, FakeAdapter],
) -> None:
    service, repo, _ = service_with_fakes
    repo.profile = {
        "tenant_slug": "acme",
        "customer_uid": "cust_uid_1",
        "legal_name": "Acme",
        "billing_email": "billing@acme.test",
        "currency": "USD",
        "country": "US",
        "provider_preference": "stripe",
        "auto_finalize_invoices": False,
        "auto_send_invoices": False,
        "payment_terms_days": 30,
        "metadata": {"provider_customer_id": "cus_123"},
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await service.update_subscription(
        "acme",
        SubscriptionUpdatePayload(
            plan_code="pro",
            status=BillingSubscriptionStatus.ACTIVE,
            base_amount=Decimal("100"),
            usage_overage_amount=Decimal("10"),
            mrr_snapshot=Decimal("110"),
            metadata={"seed": "x"},
        ),
    )

    assert result.metadata["provider_subscription_id"] == "sub_fake"
    assert result.metadata["provider_subscription_token"] == "tok_fake"
    assert repo.upsert_subscription_calls[0]["metadata"]["seed"] == "x"


@pytest.mark.asyncio
async def test_create_invoice_persists_provider_invoice_metadata(
    service_with_fakes: tuple[PlatformBillingService, FakeRepository, FakeAdapter],
) -> None:
    service, repo, _ = service_with_fakes
    repo.profile = {
        "tenant_slug": "acme",
        "customer_uid": "cust_uid_1",
        "legal_name": "Acme",
        "billing_email": "billing@acme.test",
        "currency": "USD",
        "country": "US",
        "provider_preference": "stripe",
        "auto_finalize_invoices": False,
        "auto_send_invoices": False,
        "payment_terms_days": 30,
        "metadata": {"provider_customer_id": "cus_123"},
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    invoice = await service.create_invoice(
        "acme",
        BillingInvoiceCreatePayload(
            currency="USD",
            lines=[
                BillingInvoiceLineCreate(
                    description="Base plan",
                    quantity=Decimal("1"),
                    unit_price=Decimal("100"),
                    amount=Decimal("100"),
                )
            ],
            tax_amount=Decimal("0"),
        ),
    )

    assert invoice.metadata["provider_invoice_id"] == "pinv_fake"
    assert len(repo.update_invoice_metadata_calls) == 1


@pytest.mark.asyncio
async def test_process_webhook_duplicate_event_short_circuits(
    service_with_fakes: tuple[PlatformBillingService, FakeRepository, FakeAdapter],
) -> None:
    service, repo, _ = service_with_fakes
    repo.upsert_webhook_event_result = False

    result = await service.process_webhook(
        provider=BillingProvider.STRIPE,
        payload={"id": "evt_1", "type": "invoice.paid", "data": {}},
    )

    assert result.duplicate is True
    assert repo.mark_webhook_processed_calls == []


@pytest.mark.asyncio
async def test_process_webhook_paid_updates_invoice_and_attempt(
    service_with_fakes: tuple[PlatformBillingService, FakeRepository, FakeAdapter],
) -> None:
    service, repo, _ = service_with_fakes
    repo.invoice = {
        "uid": "inv_uid_1",
        "tenant_slug": "acme",
        "invoice_number": "INV-202602-000001",
        "status": BillingInvoiceStatus.OPEN,
        "currency": "USD",
        "subtotal": Decimal("100"),
        "tax_amount": Decimal("0"),
        "total_amount": Decimal("100"),
        "amount_due": Decimal("100"),
        "amount_paid": Decimal("0"),
        "due_date": None,
        "issued_at": datetime.utcnow(),
        "finalized_at": None,
        "sent_at": None,
        "paid_at": None,
        "metadata": {},
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await service.process_webhook(
        provider=BillingProvider.STRIPE,
        payload={
            "id": "evt_2",
            "type": "invoice.paid",
            "data": {
                "tenant_slug": "acme",
                "invoice_uid": "inv_uid_1",
                "amount": 100,
                "currency": "USD",
                "status": "paid",
                "provider_reference": "ch_123",
            },
        },
    )

    assert result.accepted is True
    assert repo.update_invoice_status_calls[0]["status"] == BillingInvoiceStatus.PAID
    assert repo.create_payment_attempt_calls[0]["status"] == BillingPaymentAttemptStatus.SUCCEEDED
    assert repo.mark_webhook_processed_calls[0] == (BillingProvider.STRIPE, "evt_2")
