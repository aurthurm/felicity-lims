from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import pytest

import beak.modules.platform.billing.providers.paystack as paystack_module
import beak.modules.platform.billing.providers.stripe as stripe_module
from beak.modules.platform.billing.providers.paystack import PaystackBillingAdapter
from beak.modules.platform.billing.providers.stripe import StripeBillingAdapter


@dataclass
class MockResponse:
    status_code: int
    payload: dict[str, Any]

    @property
    def text(self) -> str:
        return str(self.payload)

    def json(self) -> dict[str, Any]:
        return self.payload


class MockAsyncClient:
    def __init__(self, *, queue: list[MockResponse], calls: list[dict[str, Any]], **_: Any) -> None:
        self._queue = queue
        self._calls = calls

    async def __aenter__(self) -> MockAsyncClient:
        return self

    async def __aexit__(self, exc_type: Any, exc: Any, tb: Any) -> bool:
        return False

    async def request(self, method: str, url: str, **kwargs: Any) -> MockResponse:
        self._calls.append({"method": method, "url": url, **kwargs})
        if not self._queue:
            raise AssertionError(f"No queued mock response for {method} {url}")
        return self._queue.pop(0)


@pytest.mark.asyncio
async def test_stripe_create_or_sync_customer_creates_customer(monkeypatch: pytest.MonkeyPatch) -> None:
    queue = [
        MockResponse(
            status_code=200,
            payload={"id": "cus_123", "email": "billing@acme.test", "name": "Acme Labs"},
        )
    ]
    calls: list[dict[str, Any]] = []
    monkeypatch.setattr(stripe_module.settings, "STRIPE_SECRET_KEY", "sk_test_123")
    monkeypatch.setattr(
        stripe_module.httpx,
        "AsyncClient",
        lambda **kwargs: MockAsyncClient(queue=queue, calls=calls, **kwargs),
    )

    adapter = StripeBillingAdapter()
    result = await adapter.create_or_sync_customer(
        {
            "tenant_slug": "acme",
            "customer_uid": "cust_uid_1",
            "billing_email": "billing@acme.test",
            "legal_name": "Acme Labs",
        }
    )

    assert result["provider_customer_id"] == "cus_123"
    assert result["synced"] is True
    assert calls[0]["url"].endswith("/v1/customers")


@pytest.mark.asyncio
async def test_stripe_request_raises_on_api_error(monkeypatch: pytest.MonkeyPatch) -> None:
    queue = [
        MockResponse(
            status_code=400,
            payload={"error": {"message": "Bad request from Stripe"}},
        )
    ]
    calls: list[dict[str, Any]] = []
    monkeypatch.setattr(stripe_module.settings, "STRIPE_SECRET_KEY", "sk_test_123")
    monkeypatch.setattr(
        stripe_module.httpx,
        "AsyncClient",
        lambda **kwargs: MockAsyncClient(queue=queue, calls=calls, **kwargs),
    )

    adapter = StripeBillingAdapter()
    with pytest.raises(ValueError, match="Stripe API error"):
        await adapter.create_or_sync_customer(
            {
                "tenant_slug": "acme",
                "customer_uid": "cust_uid_1",
                "billing_email": "billing@acme.test",
            }
        )


@pytest.mark.asyncio
async def test_stripe_missing_secret_key_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(stripe_module.settings, "STRIPE_SECRET_KEY", None)

    adapter = StripeBillingAdapter()
    with pytest.raises(ValueError, match="STRIPE_SECRET_KEY"):
        await adapter.create_or_sync_customer({"billing_email": "billing@acme.test"})


@pytest.mark.asyncio
async def test_stripe_create_invoice_creates_invoice_items_and_invoice(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    queue = [
        MockResponse(status_code=200, payload={"id": "ii_1"}),
        MockResponse(status_code=200, payload={"id": "ii_2"}),
        MockResponse(
            status_code=200,
            payload={
                "id": "in_1",
                "status": "draft",
                "hosted_invoice_url": "https://stripe.test/in_1",
            },
        ),
    ]
    calls: list[dict[str, Any]] = []
    monkeypatch.setattr(stripe_module.settings, "STRIPE_SECRET_KEY", "sk_test_123")
    monkeypatch.setattr(
        stripe_module.httpx,
        "AsyncClient",
        lambda **kwargs: MockAsyncClient(queue=queue, calls=calls, **kwargs),
    )

    adapter = StripeBillingAdapter()
    result = await adapter.create_invoice(
        {
            "tenant_slug": "acme",
            "invoice_uid": "inv_uid_1",
            "invoice_number": "INV-001",
            "provider_customer_id": "cus_123",
            "currency": "USD",
            "lines": [
                {"description": "Base", "amount": "100.00", "quantity": "1"},
                {"description": "Overage", "amount": "20.00", "quantity": "1"},
            ],
        }
    )

    assert result["provider_invoice_id"] == "in_1"
    assert len(calls) == 3
    assert calls[0]["url"].endswith("/v1/invoiceitems")
    assert calls[1]["url"].endswith("/v1/invoiceitems")
    assert calls[2]["url"].endswith("/v1/invoices")


def test_stripe_parse_webhook_maps_paid_status() -> None:
    adapter = StripeBillingAdapter()
    normalized = adapter.parse_webhook(
        {
            "id": "evt_1",
            "type": "invoice.paid",
            "data": {
                "object": {
                    "id": "in_1",
                    "metadata": {"tenant_slug": "acme", "invoice_uid": "inv_uid_1"},
                    "amount_paid": 12000,
                    "currency": "usd",
                    "status": "paid",
                }
            },
        }
    )

    assert normalized["event_id"] == "evt_1"
    assert normalized["status"] == "paid"
    assert normalized["tenant_slug"] == "acme"
    assert normalized["invoice_uid"] == "inv_uid_1"


@pytest.mark.asyncio
async def test_paystack_create_or_sync_customer_creates_customer(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    queue = [
        MockResponse(
            status_code=200,
            payload={
                "status": True,
                "message": "Customer created",
                "data": {"customer_code": "CUS_xxx", "email": "billing@acme.test", "first_name": "Acme"},
            },
        )
    ]
    calls: list[dict[str, Any]] = []
    monkeypatch.setattr(paystack_module.settings, "PAYSTACK_SECRET_KEY", "sk_paystack_123")
    monkeypatch.setattr(
        paystack_module.httpx,
        "AsyncClient",
        lambda **kwargs: MockAsyncClient(queue=queue, calls=calls, **kwargs),
    )

    adapter = PaystackBillingAdapter()
    result = await adapter.create_or_sync_customer(
        {
            "tenant_slug": "acme",
            "customer_uid": "cust_uid_1",
            "billing_email": "billing@acme.test",
            "legal_name": "Acme Labs",
        }
    )

    assert result["provider_customer_id"] == "CUS_xxx"
    assert calls[0]["url"].endswith("/customer")


@pytest.mark.asyncio
async def test_paystack_change_subscription_requires_token_for_pause(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(paystack_module.settings, "PAYSTACK_SECRET_KEY", "sk_paystack_123")

    adapter = PaystackBillingAdapter()
    with pytest.raises(ValueError, match="provider_subscription_token"):
        await adapter.change_subscription(
            {
                "provider_subscription_id": "SUB_001",
                "status": "paused",
            }
        )


@pytest.mark.asyncio
async def test_paystack_create_invoice_calls_payment_request(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    queue = [
        MockResponse(
            status_code=200,
            payload={
                "status": True,
                "message": "Payment request created",
                "data": {
                    "request_code": "PRQ_123",
                    "status": "pending",
                    "invoice_url": "https://paystack.test/prq_123",
                },
            },
        )
    ]
    calls: list[dict[str, Any]] = []
    monkeypatch.setattr(paystack_module.settings, "PAYSTACK_SECRET_KEY", "sk_paystack_123")
    monkeypatch.setattr(
        paystack_module.httpx,
        "AsyncClient",
        lambda **kwargs: MockAsyncClient(queue=queue, calls=calls, **kwargs),
    )

    adapter = PaystackBillingAdapter()
    result = await adapter.create_invoice(
        {
            "tenant_slug": "acme",
            "invoice_uid": "inv_uid_1",
            "invoice_number": "INV-001",
            "provider_customer_id": "CUS_xxx",
            "amount_due": "120.00",
            "currency": "NGN",
            "lines": [{"description": "Base", "amount": "120.00", "quantity": "1"}],
        }
    )

    assert result["provider_invoice_id"] == "PRQ_123"
    assert calls[0]["url"].endswith("/paymentrequest")


@pytest.mark.asyncio
async def test_paystack_missing_secret_key_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(paystack_module.settings, "PAYSTACK_SECRET_KEY", None)

    adapter = PaystackBillingAdapter()
    with pytest.raises(ValueError, match="PAYSTACK_SECRET_KEY"):
        await adapter.create_or_sync_customer({"billing_email": "billing@acme.test"})


def test_paystack_parse_webhook_maps_paid_status() -> None:
    adapter = PaystackBillingAdapter()
    normalized = adapter.parse_webhook(
        {
            "event": "charge.success",
            "data": {
                "id": 44,
                "reference": "pay_ref_1",
                "amount": 12000,
                "currency": "NGN",
                "status": "success",
                "metadata": {"tenant_slug": "acme", "invoice_uid": "inv_uid_1"},
            },
        }
    )

    assert normalized["event_type"] == "charge.success"
    assert normalized["status"] == "paid"
    assert normalized["tenant_slug"] == "acme"
    assert normalized["invoice_uid"] == "inv_uid_1"
