"""Pydantic schemas for platform billing APIs."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from beak.modules.platform.billing.entities import (
    BillingEnforcementMode,
    BillingFeatureKey,
    BillingInvoiceStatus,
    BillingLimitMetricKey,
    BillingLimitWindow,
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


class BillingPlanLimitInput(BaseModel):
    """Input row for a plan limit definition."""

    metric_key: BillingLimitMetricKey
    limit_value: int
    window: BillingLimitWindow
    enforcement_mode: BillingEnforcementMode = BillingEnforcementMode.HARD_BLOCK


class BillingPlanFeatureInput(BaseModel):
    """Input row for a plan feature entitlement definition."""

    feature_key: BillingFeatureKey
    enabled: bool = True
    included_units: Decimal = Decimal("0")
    unit_price: Decimal = Decimal("0")


class BillingPlanCreate(BaseModel):
    """Create payload for billing plans."""

    plan_code: str
    name: str
    active: bool = True
    currency: str = "USD"
    base_amount: Decimal = Decimal("0")
    limits: list[BillingPlanLimitInput] = Field(default_factory=list)
    features: list[BillingPlanFeatureInput] = Field(default_factory=list)


class BillingPlanUpdate(BaseModel):
    """Mutable plan fields plus optional child replacement."""

    name: str | None = None
    active: bool | None = None
    currency: str | None = None
    base_amount: Decimal | None = None
    limits: list[BillingPlanLimitInput] | None = None
    features: list[BillingPlanFeatureInput] | None = None


class BillingPlanLimitOut(BaseModel):
    """Plan limit projection."""

    metric_key: BillingLimitMetricKey
    limit_value: int
    window: BillingLimitWindow
    enforcement_mode: BillingEnforcementMode


class BillingPlanFeatureOut(BaseModel):
    """Plan feature projection."""

    feature_key: BillingFeatureKey
    enabled: bool
    included_units: Decimal = Decimal("0")
    unit_price: Decimal = Decimal("0")


class BillingPlanOut(BaseModel):
    """Billing plan projection."""

    uid: str
    plan_code: str
    name: str
    active: bool = True
    currency: str = "USD"
    base_amount: Decimal = Decimal("0")
    limits: list[BillingPlanLimitOut] = Field(default_factory=list)
    features: list[BillingPlanFeatureOut] = Field(default_factory=list)
    created_at: datetime | None = None
    updated_at: datetime | None = None


class TenantEntitlementOverrideInput(BaseModel):
    """Per-tenant override payload for limit or feature values."""

    metric_key: BillingLimitMetricKey | None = None
    feature_key: BillingFeatureKey | None = None
    override_limit_value: int | None = None
    override_enabled: bool | None = None
    window: BillingLimitWindow | None = None
    enforcement_mode: BillingEnforcementMode | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class TenantEffectiveLimit(BaseModel):
    """Resolved effective limit for a tenant metric."""

    metric_key: BillingLimitMetricKey
    limit_value: int
    window: BillingLimitWindow
    enforcement_mode: BillingEnforcementMode = BillingEnforcementMode.HARD_BLOCK


class TenantEffectiveFeature(BaseModel):
    """Resolved effective feature entitlement for a tenant."""

    feature_key: BillingFeatureKey
    enabled: bool
    included_units: Decimal = Decimal("0")
    unit_price: Decimal = Decimal("0")


class TenantEntitlementsOut(BaseModel):
    """Resolved tenant entitlement state."""

    tenant_slug: str
    plan_code: str
    limits: list[TenantEffectiveLimit] = Field(default_factory=list)
    features: list[TenantEffectiveFeature] = Field(default_factory=list)


class UsageCounterRow(BaseModel):
    """Single usage counter row."""

    metric_key: BillingLimitMetricKey
    quantity: int
    window_start: datetime
    window_end: datetime
    scope_user_uid: str | None = None
    scope_lab_uid: str | None = None


class TenantUsageSnapshot(BaseModel):
    """Tenant usage projection for a time window."""

    tenant_slug: str
    rows: list[UsageCounterRow] = Field(default_factory=list)
