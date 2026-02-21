"""Pydantic schemas for platform billing APIs."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from beak.modules.platform.billing.entities import (
    BillingInvoiceStatus,
    BillingPaymentAttemptStatus,
    BillingProvider,
    BillingSubscriptionStatus,
)


class TenantBillingProfile(BaseModel):
    """Tenant billing profile in platform control plane."""

    tenant_slug: str
    customer_uid: str
    legal_name: str | None = None
    billing_email: str | None = None
    currency: str = "USD"
    country: str | None = None
    provider_preference: BillingProvider = BillingProvider.STRIPE
    auto_finalize_invoices: bool = False
    auto_send_invoices: bool = False
    payment_terms_days: int = 30
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class TenantBillingProfileUpdate(BaseModel):
    """Mutable fields for tenant billing profile."""

    legal_name: str | None = None
    billing_email: str | None = None
    currency: str | None = None
    country: str | None = None
    provider_preference: BillingProvider | None = None
    auto_finalize_invoices: bool | None = None
    auto_send_invoices: bool | None = None
    payment_terms_days: int | None = None
    metadata: dict[str, Any] | None = None


class SubscriptionUpdatePayload(BaseModel):
    """Request payload for tenant subscription upsert/change."""

    plan_code: str
    status: BillingSubscriptionStatus = BillingSubscriptionStatus.ACTIVE
    base_amount: Decimal = Decimal("0")
    usage_overage_amount: Decimal = Decimal("0")
    mrr_snapshot: Decimal = Decimal("0")
    next_billing_date: date | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    paused_at: datetime | None = None
    canceled_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class SubscriptionResponse(BaseModel):
    """Tenant subscription projection."""

    uid: str
    tenant_slug: str
    plan_code: str
    status: BillingSubscriptionStatus
    base_amount: Decimal
    usage_overage_amount: Decimal
    mrr_snapshot: Decimal
    next_billing_date: date | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    paused_at: datetime | None = None
    canceled_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None


class BillingInvoiceLineCreate(BaseModel):
    """A line item for invoice creation."""

    description: str
    quantity: Decimal = Decimal("1")
    unit_price: Decimal = Decimal("0")
    amount: Decimal = Decimal("0")
    metadata: dict[str, Any] = Field(default_factory=dict)


class BillingInvoiceCreatePayload(BaseModel):
    """Create a draft invoice for a tenant."""

    currency: str = "USD"
    due_date: date | None = None
    lines: list[BillingInvoiceLineCreate] = Field(default_factory=list)
    tax_amount: Decimal = Decimal("0")
    metadata: dict[str, Any] = Field(default_factory=dict)


class BillingInvoice(BaseModel):
    """Invoice projection."""

    uid: str
    tenant_slug: str
    invoice_number: str
    status: BillingInvoiceStatus
    currency: str
    subtotal: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    amount_due: Decimal
    amount_paid: Decimal
    due_date: date | None = None
    issued_at: datetime | None = None
    finalized_at: datetime | None = None
    sent_at: datetime | None = None
    paid_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class BillingPaymentAttempt(BaseModel):
    """Payment attempt projection."""

    uid: str
    invoice_uid: str
    tenant_slug: str
    provider: BillingProvider
    status: BillingPaymentAttemptStatus
    amount: Decimal
    currency: str
    provider_reference: str | None = None
    failure_reason: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None


class BillingProviderHealth(BaseModel):
    """Provider connectivity/config status."""

    provider: BillingProvider
    healthy: bool
    details: str


class BillingProviderHealthResponse(BaseModel):
    """Collection of provider health entries."""

    providers: list[BillingProviderHealth]


class InvoiceMarkPaidPayload(BaseModel):
    """Manual mark-paid payload for off-platform reconciliation."""

    amount: Decimal | None = None
    payment_reference: str | None = None
    note: str | None = None


class BillingWebhookResult(BaseModel):
    """Webhook processing outcome."""

    provider: BillingProvider
    event_id: str
    accepted: bool
    duplicate: bool = False
    detail: str


class BillingAgingSnapshot(BaseModel):
    """A/R aging buckets for tenant receivables."""

    current: Decimal = Decimal("0")
    bucket_30: Decimal = Decimal("0")
    bucket_60: Decimal = Decimal("0")
    bucket_90_plus: Decimal = Decimal("0")


class TenantBillingOverview(BaseModel):
    """Combined overview row for platform UI."""

    tenant_slug: str
    plan_code: str | None = None
    subscription_status: BillingSubscriptionStatus | None = None
    mrr_snapshot: Decimal = Decimal("0")
    aging: BillingAgingSnapshot
