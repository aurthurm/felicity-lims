"""Entities and enums for platform billing domain."""

from __future__ import annotations

from enum import StrEnum


class BillingSubscriptionStatus(StrEnum):
    """Allowed platform subscription lifecycle states."""

    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    PAUSED = "paused"
    CANCELED = "canceled"


class BillingInvoiceStatus(StrEnum):
    """Allowed platform invoice states."""

    DRAFT = "draft"
    OPEN = "open"
    PAID = "paid"
    VOID = "void"
    UNCOLLECTIBLE = "uncollectible"


class BillingPaymentAttemptStatus(StrEnum):
    """Allowed payment attempt states."""

    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    ACTION_REQUIRED = "action_required"


class BillingPaymentProofStatus(StrEnum):
    """Allowed status values for tenant-submitted payment proofs."""

    SUBMITTED = "submitted"
    REVIEWED = "reviewed"
    REJECTED = "rejected"


class BillingProvider(StrEnum):
    """Supported billing providers."""

    STRIPE = "stripe"
    PAYSTACK = "paystack"


class BillingLimitMetricKey(StrEnum):
    """Supported cap metric identifiers."""

    TENANT_USERS = "tenant_users"
    TENANT_LABS = "tenant_labs"
    API_REQUESTS_USER = "api_requests_user"
    API_REQUESTS_LAB = "api_requests_lab"
    API_REQUESTS_TENANT = "api_requests_tenant"


class BillingFeatureKey(StrEnum):
    """Supported billable feature identifiers."""

    BILLING = "billing"
    INVENTORY = "inventory"
    STORAGE = "storage"
    GRIND = "grind"
    DOCUMENT = "document"
    SHIPMENT = "shipment"
    WORKSHEET = "worksheet"
    REFLEX = "reflex"


class BillingLimitWindow(StrEnum):
    """Window semantics for capped metrics."""

    INSTANT = "instant"
    MINUTE = "minute"
    HOUR = "hour"
    DAY = "day"
    MONTH = "month"


class BillingEnforcementMode(StrEnum):
    """Limit enforcement modes."""

    HARD_BLOCK = "hard_block"
