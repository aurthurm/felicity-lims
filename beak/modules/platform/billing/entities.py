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


class BillingProvider(StrEnum):
    """Supported billing providers."""

    STRIPE = "stripe"
    PAYSTACK = "paystack"
