"""Stripe billing adapter for platform billing."""

from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP
from typing import Any

import httpx

from beak.core.config import get_settings
from beak.modules.platform.billing.providers.base import BillingProviderAdapter

settings = get_settings()


class StripeBillingAdapter(BillingProviderAdapter):
    """Stripe adapter using REST endpoints.

    This adapter intentionally uses `httpx` instead of Stripe SDK to keep
    dependencies minimal and consistent with the current project stack.
    """

    provider_name = "stripe"
    api_base = "https://api.stripe.com/v1"
    timeout_seconds = 20.0

    def _require_secret_key(self) -> str:
        secret = settings.STRIPE_SECRET_KEY
        if not secret:
            raise ValueError("STRIPE_SECRET_KEY is not configured")
        return secret

    @staticmethod
    def _as_minor_units(amount: str | int | float | Decimal) -> int:
        value = Decimal(str(amount))
        cents = (value * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        return int(cents)

    async def _request(
        self,
        method: str,
        path: str,
        *,
        data: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        secret = self._require_secret_key()
        url = f"{self.api_base}{path}"
        headers = {
            "Authorization": f"Bearer {secret}",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.request(method=method, url=url, headers=headers, data=data)

        if response.status_code >= 400:
            try:
                payload = response.json()
            except ValueError:
                payload = {"error": {"message": response.text}}
            message = str(payload.get("error", {}).get("message") or "Stripe request failed")
            raise ValueError(f"Stripe API error ({response.status_code}): {message}")

        parsed = response.json()
        if not isinstance(parsed, dict):
            raise ValueError("Stripe API returned non-object response")
        return parsed

    async def create_or_sync_customer(self, payload: dict[str, Any]) -> dict[str, Any]:
        customer_id = payload.get("provider_customer_id")
        data: dict[str, Any] = {
            "email": payload.get("billing_email") or "",
            "name": payload.get("legal_name") or payload.get("tenant_slug") or "",
            "metadata[tenant_slug]": payload.get("tenant_slug") or "",
            "metadata[customer_uid]": payload.get("customer_uid") or "",
        }
        if customer_id:
            customer = await self._request("POST", f"/customers/{customer_id}", data=data)
        else:
            customer = await self._request("POST", "/customers", data=data)

        return {
            "provider": self.provider_name,
            "provider_customer_id": customer.get("id"),
            "email": customer.get("email"),
            "name": customer.get("name"),
            "synced": True,
            "raw": customer,
        }

    async def create_subscription(self, payload: dict[str, Any]) -> dict[str, Any]:
        customer_id = payload.get("provider_customer_id")
        plan_code = payload.get("plan_code")
        if not customer_id:
            raise ValueError("Stripe subscription requires provider_customer_id")
        if not plan_code:
            raise ValueError("Stripe subscription requires plan_code mapped to a Stripe price ID")

        data = {
            "customer": customer_id,
            "items[0][price]": str(plan_code),
            "metadata[tenant_slug]": payload.get("tenant_slug") or "",
            "metadata[plan_code]": str(plan_code),
        }
        subscription = await self._request("POST", "/subscriptions", data=data)
        return {
            "provider": self.provider_name,
            "provider_subscription_id": subscription.get("id"),
            "status": subscription.get("status"),
            "raw": subscription,
        }

    async def change_subscription(self, payload: dict[str, Any]) -> dict[str, Any]:
        subscription_id = payload.get("provider_subscription_id")
        target_status = str(payload.get("status") or "active")

        if not subscription_id:
            return await self.create_subscription(payload)

        if target_status == "canceled":
            canceled = await self._request("DELETE", f"/subscriptions/{subscription_id}")
            return {
                "provider": self.provider_name,
                "provider_subscription_id": canceled.get("id"),
                "status": canceled.get("status") or "canceled",
                "raw": canceled,
            }

        if target_status == "paused":
            paused = await self._request(
                "POST",
                f"/subscriptions/{subscription_id}",
                data={"pause_collection[behavior]": "keep_as_draft"},
            )
            return {
                "provider": self.provider_name,
                "provider_subscription_id": paused.get("id"),
                "status": "paused",
                "raw": paused,
            }

        update_data: dict[str, Any] = {"cancel_at_period_end": "false", "pause_collection": ""}
        plan_code = payload.get("plan_code")
        if plan_code:
            current = await self._request("GET", f"/subscriptions/{subscription_id}")
            items = current.get("items", {}).get("data", [])
            if items:
                update_data["items[0][id]"] = items[0].get("id")
                update_data["items[0][price]"] = str(plan_code)
        updated = await self._request("POST", f"/subscriptions/{subscription_id}", data=update_data)
        return {
            "provider": self.provider_name,
            "provider_subscription_id": updated.get("id"),
            "status": updated.get("status") or target_status,
            "raw": updated,
        }

    async def create_invoice(self, payload: dict[str, Any]) -> dict[str, Any]:
        customer_id = payload.get("provider_customer_id")
        if not customer_id:
            raise ValueError("Stripe invoice requires provider_customer_id")

        currency = str(payload.get("currency") or "USD").lower()
        for idx, line in enumerate(payload.get("lines") or []):
            amount = self._as_minor_units(line.get("amount") or 0)
            item_data = {
                "customer": customer_id,
                "amount": amount,
                "currency": currency,
                "description": str(line.get("description") or f"Line {idx + 1}"),
                "metadata[tenant_slug]": payload.get("tenant_slug") or "",
                "metadata[invoice_uid]": payload.get("invoice_uid") or "",
            }
            await self._request("POST", "/invoiceitems", data=item_data)

        invoice_data: dict[str, Any] = {
            "customer": customer_id,
            "collection_method": "send_invoice",
            "auto_advance": "false",
            "metadata[tenant_slug]": payload.get("tenant_slug") or "",
            "metadata[invoice_uid]": payload.get("invoice_uid") or "",
            "metadata[invoice_number]": payload.get("invoice_number") or "",
        }
        due_date = payload.get("due_date")
        if due_date:
            invoice_data["due_date"] = str(due_date)

        invoice = await self._request("POST", "/invoices", data=invoice_data)
        return {
            "provider": self.provider_name,
            "provider_invoice_id": invoice.get("id"),
            "provider_hosted_url": invoice.get("hosted_invoice_url"),
            "status": invoice.get("status") or "draft",
            "raw": invoice,
        }

    async def finalize_invoice(self, payload: dict[str, Any]) -> dict[str, Any]:
        provider_invoice_id = payload.get("provider_invoice_id")
        if not provider_invoice_id:
            raise ValueError("Stripe invoice finalization requires provider_invoice_id")

        invoice = await self._request(
            "POST",
            f"/invoices/{provider_invoice_id}/finalize",
            data={"auto_advance": "false"},
        )
        return {
            "provider": self.provider_name,
            "provider_invoice_id": invoice.get("id"),
            "provider_hosted_url": invoice.get("hosted_invoice_url"),
            "status": invoice.get("status") or "open",
            "raw": invoice,
        }

    async def collect_payment(self, payload: dict[str, Any]) -> dict[str, Any]:
        provider_invoice_id = payload.get("provider_invoice_id")
        if not provider_invoice_id:
            raise ValueError("Stripe payment collection requires provider_invoice_id")

        paid = await self._request("POST", f"/invoices/{provider_invoice_id}/pay", data={})
        status = "succeeded" if str(paid.get("status")) == "paid" else str(paid.get("status") or "pending")
        return {
            "provider": self.provider_name,
            "provider_payment_id": paid.get("charge") or paid.get("payment_intent"),
            "status": status,
            "raw": paid,
        }

    def parse_webhook(self, payload: dict[str, Any]) -> dict[str, Any]:
        event_type = str(payload.get("type") or "unknown")
        data_object = payload.get("data", {}).get("object", {})
        metadata = data_object.get("metadata", {}) if isinstance(data_object, dict) else {}

        status = str(data_object.get("status") or "pending")
        if event_type in {"invoice.paid", "payment_intent.succeeded", "charge.succeeded"}:
            status = "paid"
        elif event_type in {"invoice.payment_failed", "payment_intent.payment_failed", "charge.failed"}:
            status = "failed"
        elif event_type in {"invoice.finalized"}:
            status = "open"

        return {
            "event_id": str(payload.get("id") or ""),
            "event_type": event_type,
            "invoice_uid": metadata.get("invoice_uid"),
            "tenant_slug": metadata.get("tenant_slug"),
            "amount": data_object.get("amount_paid") or data_object.get("amount_due") or 0,
            "currency": str(data_object.get("currency") or "usd").upper(),
            "status": status,
            "provider_reference": data_object.get("id"),
        }
