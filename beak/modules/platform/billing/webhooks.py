"""Webhook validation and parsing for platform billing providers."""

from __future__ import annotations

import hashlib
import hmac
import json
from typing import Any

from beak.core.config import get_settings
from beak.modules.platform.billing.entities import BillingProvider

settings = get_settings()


class BillingWebhookError(ValueError):
    """Raised when webhook payload or signature is invalid."""


def _secure_compare(left: str, right: str) -> bool:
    return hmac.compare_digest(left.encode("utf-8"), right.encode("utf-8"))


def verify_stripe_signature(raw_body: bytes, signature: str | None) -> None:
    """Validate Stripe-style webhook signature with HMAC SHA256."""
    secret = settings.STRIPE_WEBHOOK_SECRET
    if not secret:
        raise BillingWebhookError("Stripe webhook secret is not configured")
    if not signature:
        raise BillingWebhookError("Missing Stripe signature header")

    expected = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    provided = signature.strip()
    if provided.startswith("sha256="):
        provided = provided.split("=", maxsplit=1)[1]
    if not _secure_compare(expected, provided):
        raise BillingWebhookError("Invalid Stripe webhook signature")


def verify_paystack_signature(raw_body: bytes, signature: str | None) -> None:
    """Validate Paystack webhook signature with HMAC SHA512."""
    secret = settings.PAYSTACK_WEBHOOK_SECRET
    if not secret:
        raise BillingWebhookError("Paystack webhook secret is not configured")
    if not signature:
        raise BillingWebhookError("Missing Paystack signature header")

    expected = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha512).hexdigest()
    if not _secure_compare(expected, signature.strip()):
        raise BillingWebhookError("Invalid Paystack webhook signature")


def parse_webhook_json(raw_body: bytes) -> dict[str, Any]:
    """Decode raw JSON request body."""
    try:
        payload = json.loads(raw_body.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise BillingWebhookError("Invalid webhook JSON payload") from exc
    if not isinstance(payload, dict):
        raise BillingWebhookError("Webhook payload must be an object")
    return payload


def verify_provider_signature(
    provider: BillingProvider,
    *,
    raw_body: bytes,
    signature: str | None,
) -> None:
    """Dispatch signature verification for provider."""
    if provider == BillingProvider.STRIPE:
        verify_stripe_signature(raw_body, signature)
        return
    if provider == BillingProvider.PAYSTACK:
        verify_paystack_signature(raw_body, signature)
        return
    raise BillingWebhookError(f"Unsupported billing provider: {provider}")
