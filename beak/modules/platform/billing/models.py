"""SQLAlchemy models for platform billing control-plane tables."""

from __future__ import annotations

from sqlalchemy import BigInteger, Boolean, Column, Date, DateTime, Index, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from beak.core.config import get_settings
from beak.modules.shared.abstract.entity.base import Base

settings = get_settings()
_PLATFORM_TABLE = {"schema": settings.PLATFORM_SCHEMA}


class BillingCustomer(Base):
    __tablename__ = "billing_customer"
    __table_args__ = _PLATFORM_TABLE

    tenant_slug = Column(String(128), primary_key=True, nullable=False, unique=True, index=True)
    customer_uid = Column(String(64), nullable=False)
    legal_name = Column(String(255), nullable=True)
    billing_email = Column(String(255), nullable=True)
    currency = Column(String(8), nullable=False, default="USD")
    country = Column(String(8), nullable=True)
    provider_preference = Column(String(32), nullable=False, default="stripe")
    auto_finalize_invoices = Column(Boolean, nullable=False, default=False)
    auto_send_invoices = Column(Boolean, nullable=False, default=False)
    payment_terms_days = Column(Integer, nullable=False, default=30)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingSubscription(Base):
    __tablename__ = "billing_subscription"
    __table_args__ = _PLATFORM_TABLE

    tenant_slug = Column(String(128), nullable=False, index=True)
    plan_code = Column(String(64), nullable=False)
    status = Column(String(32), nullable=False)
    base_amount = Column(Numeric(18, 2), nullable=False, default=0)
    usage_overage_amount = Column(Numeric(18, 2), nullable=False, default=0)
    mrr_snapshot = Column(Numeric(18, 2), nullable=False, default=0)
    next_billing_date = Column(Date, nullable=True)
    starts_at = Column(DateTime, nullable=True)
    ends_at = Column(DateTime, nullable=True)
    paused_at = Column(DateTime, nullable=True)
    canceled_at = Column(DateTime, nullable=True)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingSubscriptionItem(Base):
    __tablename__ = "billing_subscription_item"
    __table_args__ = _PLATFORM_TABLE

    subscription_uid = Column(String(64), nullable=False, index=True)
    tenant_slug = Column(String(128), nullable=False, index=True)
    item_code = Column(String(128), nullable=False)
    quantity = Column(Numeric(18, 4), nullable=False, default=0)
    unit_price = Column(Numeric(18, 4), nullable=False, default=0)
    amount = Column(Numeric(18, 2), nullable=False, default=0)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingPlan(Base):
    __tablename__ = "billing_plan"
    __table_args__ = _PLATFORM_TABLE

    plan_code = Column(String(64), nullable=False, unique=True)
    name = Column(String(128), nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    currency = Column(String(8), nullable=False, default="USD")
    base_amount = Column(Numeric(18, 2), nullable=False, default=0)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingPlanLimit(Base):
    __tablename__ = "billing_plan_limit"
    __table_args__ = _PLATFORM_TABLE

    plan_uid = Column(String(64), nullable=False, index=True)
    metric_key = Column(String(64), nullable=False)
    limit_value = Column(Integer, nullable=False)
    limit_window = Column(String(16), nullable=False)
    enforcement_mode = Column(String(32), nullable=False, default="hard_block")
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingPlanFeature(Base):
    __tablename__ = "billing_plan_feature"
    __table_args__ = _PLATFORM_TABLE

    plan_uid = Column(String(64), nullable=False, index=True)
    feature_key = Column(String(64), nullable=False)
    enabled = Column(Boolean, nullable=False, default=True)
    included_units = Column(Numeric(18, 4), nullable=False, default=0)
    unit_price = Column(Numeric(18, 4), nullable=False, default=0)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingTenantOverride(Base):
    __tablename__ = "billing_tenant_override"
    __table_args__ = _PLATFORM_TABLE

    tenant_slug = Column(String(128), nullable=False, index=True)
    metric_key = Column(String(64), nullable=True)
    feature_key = Column(String(64), nullable=True)
    override_limit_value = Column(Integer, nullable=True)
    override_enabled = Column(Boolean, nullable=True)
    limit_window = Column(String(16), nullable=True)
    enforcement_mode = Column(String(32), nullable=True)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingUsageCounter(Base):
    __tablename__ = "billing_usage_counter"
    __table_args__ = _PLATFORM_TABLE

    tenant_slug = Column(String(128), nullable=False, index=True)
    metric_key = Column(String(64), nullable=False)
    window_start = Column(DateTime, nullable=False)
    window_end = Column(DateTime, nullable=False)
    scope_user_uid = Column(String(64), nullable=True)
    scope_lab_uid = Column(String(64), nullable=True)
    quantity = Column(BigInteger, nullable=False, default=0)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingUsageRecordDaily(Base):
    __tablename__ = "billing_usage_record_daily"
    __table_args__ = _PLATFORM_TABLE

    tenant_slug = Column(String(128), nullable=False, index=True)
    usage_date = Column(Date, nullable=False)
    metric_key = Column(String(128), nullable=False)
    quantity = Column(Numeric(18, 4), nullable=False, default=0)
    unit_price = Column(Numeric(18, 4), nullable=False, default=0)
    amount = Column(Numeric(18, 2), nullable=False, default=0)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingInvoice(Base):
    __tablename__ = "billing_invoice"
    __table_args__ = (
        Index("uq_billing_invoice_invoice_number", "invoice_number", unique=True),
        _PLATFORM_TABLE,
    )

    tenant_slug = Column(String(128), nullable=False, index=True)
    invoice_number = Column(String(64), nullable=False)
    status = Column(String(32), nullable=False)
    currency = Column(String(8), nullable=False, default="USD")
    subtotal = Column(Numeric(18, 2), nullable=False, default=0)
    tax_amount = Column(Numeric(18, 2), nullable=False, default=0)
    total_amount = Column(Numeric(18, 2), nullable=False, default=0)
    amount_due = Column(Numeric(18, 2), nullable=False, default=0)
    amount_paid = Column(Numeric(18, 2), nullable=False, default=0)
    due_date = Column(Date, nullable=True)
    issued_at = Column(DateTime, nullable=True)
    finalized_at = Column(DateTime, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingInvoiceLine(Base):
    __tablename__ = "billing_invoice_line"
    __table_args__ = _PLATFORM_TABLE

    invoice_uid = Column(String(64), nullable=False, index=True)
    line_index = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    quantity = Column(Numeric(18, 4), nullable=False, default=0)
    unit_price = Column(Numeric(18, 4), nullable=False, default=0)
    amount = Column(Numeric(18, 2), nullable=False, default=0)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingPaymentAttempt(Base):
    __tablename__ = "billing_payment_attempt"
    __table_args__ = _PLATFORM_TABLE

    invoice_uid = Column(String(64), nullable=False, index=True)
    tenant_slug = Column(String(128), nullable=False, index=True)
    provider = Column(String(32), nullable=False)
    status = Column(String(32), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False, default=0)
    currency = Column(String(8), nullable=False, default="USD")
    provider_reference = Column(String(255), nullable=True)
    failure_reason = Column(Text, nullable=True)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingPaymentProof(Base):
    __tablename__ = "billing_payment_proof"
    __table_args__ = _PLATFORM_TABLE

    tenant_slug = Column(String(128), nullable=False, index=True)
    invoice_uid = Column(String(64), nullable=False, index=True)
    status = Column(String(32), nullable=False, default="submitted")
    amount = Column(Numeric(18, 2), nullable=True)
    currency = Column(String(8), nullable=True)
    payment_method = Column(String(64), nullable=True)
    payment_reference = Column(String(255), nullable=True)
    note = Column(Text, nullable=True)
    original_filename = Column(String(255), nullable=False)
    content_type = Column(String(128), nullable=False)
    size_bytes = Column(BigInteger, nullable=False, default=0)
    bucket_name = Column(String(128), nullable=False)
    object_name = Column(String(512), nullable=False)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingPaymentAllocation(Base):
    __tablename__ = "billing_payment_allocation"
    __table_args__ = _PLATFORM_TABLE

    payment_attempt_uid = Column(String(64), nullable=False, index=True)
    invoice_uid = Column(String(64), nullable=False, index=True)
    tenant_slug = Column(String(128), nullable=False, index=True)
    amount = Column(Numeric(18, 2), nullable=False, default=0)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingWebhookEvent(Base):
    __tablename__ = "billing_webhook_event"
    __table_args__ = (
        Index("uq_billing_webhook_event_idempotency_key", "idempotency_key", unique=True),
        _PLATFORM_TABLE,
    )

    provider = Column(String(32), nullable=False)
    idempotency_key = Column(String(255), nullable=False)
    event_type = Column(String(128), nullable=False)
    payload = Column(JSONB, nullable=False)
    processed = Column(Boolean, nullable=False, default=False)
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingProviderAccountConfig(Base):
    __tablename__ = "billing_provider_account_config"
    __table_args__ = _PLATFORM_TABLE

    provider = Column(String(32), nullable=False)
    account_name = Column(String(128), nullable=True)
    account_reference = Column(String(255), nullable=True)
    enabled = Column(Boolean, nullable=False, default=False)
    metadata_json = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class BillingAuditLog(Base):
    __tablename__ = "billing_audit_log"
    __table_args__ = _PLATFORM_TABLE

    tenant_slug = Column(String(128), nullable=True, index=True)
    actor_identifier = Column(String(255), nullable=True)
    action = Column(String(128), nullable=False)
    resource_type = Column(String(128), nullable=False)
    resource_uid = Column(String(64), nullable=True)
    details = Column(JSONB, nullable=True)
    created_at = Column(DateTime, nullable=True)


# Keep noqa marker used by static import side effects in metadata registration.
__all__ = [
    "BillingCustomer",
    "BillingSubscription",
    "BillingSubscriptionItem",
    "BillingPlan",
    "BillingPlanLimit",
    "BillingPlanFeature",
    "BillingTenantOverride",
    "BillingUsageCounter",
    "BillingUsageRecordDaily",
    "BillingInvoice",
    "BillingInvoiceLine",
    "BillingPaymentAttempt",
    "BillingPaymentProof",
    "BillingPaymentAllocation",
    "BillingWebhookEvent",
    "BillingProviderAccountConfig",
    "BillingAuditLog",
]
