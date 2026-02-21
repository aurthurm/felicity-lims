"""Paystack billing adapter for platform billing."""

from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP
from typing import Any

import httpx

from beak.core.config import get_settings
from beak.modules.platform.billing.providers.base import BillingProviderAdapter

settings = get_settings()


class PaystackBillingAdapter(BillingProviderAdapter):
    """Paystack adapter using REST endpoints."""

    provider_name = "paystack"
    api_base = "https://api.paystack.co"
    timeout_seconds = 20.0

    def _require_secret_key(self) -> str:
        secret = settings.PAYSTACK_SECRET_KEY
        if not secret:
            raise ValueError("PAYSTACK_SECRET_KEY is not configured")
        return secret

    @staticmethod
    def _as_subunit(amount: str | int | float | Decimal) -> int:
        value = Decimal(str(amount))
        subunit = (value * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        return int(subunit)

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json_payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        secret = self._require_secret_key()
        url = f"{self.api_base}{path}"
        headers = {
            "Authorization": f"Bearer {secret}",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=json_payload,
            )

        if response.status_code >= 400:
            try:
                payload = response.json()
                message = str(payload.get("message") or response.text)
            except ValueError:
                message = response.text
            raise ValueError(f"Paystack API error ({response.status_code}): {message}")

        parsed = response.json()
        if not isinstance(parsed, dict):
            raise ValueError("Paystack API returned non-object response")
        if parsed.get("status") is False:
            raise ValueError(f"Paystack API error: {parsed.get('message')}")
        return parsed

    async def create_or_sync_customer(self, payload: dict[str, Any]) -> dict[str, Any]:
        customer_code = payload.get("provider_customer_id")
        if customer_code:
            fetched = await self._request("GET", f"/customer/{customer_code}")
            customer = fetched.get("data") or {}
            return {
                "provider": self.provider_name,
                "provider_customer_id": customer.get("customer_code") or customer_code,
                "email": customer.get("email"),
                "name": customer.get("first_name") or customer.get("last_name") or payload.get("legal_name"),
                "synced": True,
                "raw": customer,
            }

        billing_email = payload.get("billing_email")
        if not billing_email:
            raise ValueError("Paystack customer sync requires billing_email")

        body = {
            "email": billing_email,
            "first_name": payload.get("legal_name") or payload.get("tenant_slug") or "",
            "metadata": {
                "tenant_slug": payload.get("tenant_slug"),
                "customer_uid": payload.get("customer_uid"),
            },
        }
        created = await self._request("POST", "/customer", json_payload=body)
        customer = created.get("data") or {}
        return {
            "provider": self.provider_name,
            "provider_customer_id": customer.get("customer_code"),
            "email": customer.get("email"),
            "name": customer.get("first_name") or customer.get("last_name"),
            "synced": True,
            "raw": customer,
        }

    async def create_subscription(self, payload: dict[str, Any]) -> dict[str, Any]:
        customer_ref = payload.get("provider_customer_id") or payload.get("billing_email")
        if not customer_ref:
            raise ValueError("Paystack subscription requires provider_customer_id or billing_email")

        plan_code = payload.get("plan_code")
        if not plan_code:
            raise ValueError("Paystack subscription requires plan_code mapped to a Paystack plan code")

        body = {
            "customer": customer_ref,
            "plan": str(plan_code),
            "metadata": {
                "tenant_slug": payload.get("tenant_slug"),
                "plan_code": payload.get("plan_code"),
            },
        }
        created = await self._request("POST", "/subscription", json_payload=body)
        subscription = created.get("data") or {}
        return {
            "provider": self.provider_name,
            "provider_subscription_id": subscription.get("subscription_code"),
            "provider_subscription_token": subscription.get("email_token"),
            "status": subscription.get("status") or "active",
            "raw": subscription,
        }

    async def change_subscription(self, payload: dict[str, Any]) -> dict[str, Any]:
        subscription_code = payload.get("provider_subscription_id")
        email_token = payload.get("provider_subscription_token")
        target_status = str(payload.get("status") or "active")

        if not subscription_code:
            return await self.create_subscription(payload)

        if target_status in {"paused", "canceled"}:
            if not email_token:
                raise ValueError(
                    "Paystack status change to paused/canceled requires provider_subscription_token"
                )
            disabled = await self._request(
                "POST",
                "/subscription/disable",
                json_payload={
                    "code": subscription_code,
                    "token": email_token,
                },
            )
            return {
                "provider": self.provider_name,
                "provider_subscription_id": subscription_code,
                "provider_subscription_token": email_token,
                "status": "paused" if target_status == "paused" else "canceled",
                "raw": disabled.get("data") or {},
            }

        if target_status == "active" and email_token:
            enabled = await self._request(
                "POST",
                "/subscription/enable",
                json_payload={
                    "code": subscription_code,
                    "token": email_token,
                },
            )
            return {
                "provider": self.provider_name,
                "provider_subscription_id": subscription_code,
                "provider_subscription_token": email_token,
                "status": "active",
                "raw": enabled.get("data") or {},
            }

        return {
            "provider": self.provider_name,
            "provider_subscription_id": subscription_code,
            "provider_subscription_token": email_token,
            "status": target_status,
            "raw": {},
        }

    async def create_invoice(self, payload: dict[str, Any]) -> dict[str, Any]:
        customer_ref = payload.get("provider_customer_id")
        if not customer_ref:
            raise ValueError("Paystack invoice requires provider_customer_id")

        amount = self._as_subunit(payload.get("amount_due") or 0)
        line_items = []
        for line in payload.get("lines") or []:
            line_items.append(
                {
                    "name": str(line.get("description") or "Charge"),
                    "amount": self._as_subunit(line.get("amount") or 0),
                    "quantity": int(Decimal(str(line.get("quantity") or 1))),
                }
            )

        body: dict[str, Any] = {
            "customer": customer_ref,
            "amount": amount,
            "description": f"Invoice {payload.get('invoice_number')}",
            "line_items": line_items,
            "draft": True,
            "metadata": {
                "tenant_slug": payload.get("tenant_slug"),
                "invoice_uid": payload.get("invoice_uid"),
                "invoice_number": payload.get("invoice_number"),
            },
        }
        if payload.get("due_date"):
            body["due_date"] = payload.get("due_date")

        created = await self._request("POST", "/paymentrequest", json_payload=body)
        payment_request = created.get("data") or {}
        return {
            "provider": self.provider_name,
            "provider_invoice_id": payment_request.get("request_code"),
            "provider_hosted_url": payment_request.get("offline_reference") or payment_request.get("invoice_url"),
            "status": payment_request.get("status") or "draft",
            "raw": payment_request,
        }

    async def finalize_invoice(self, payload: dict[str, Any]) -> dict[str, Any]:
        provider_invoice_id = payload.get("provider_invoice_id")
        if not provider_invoice_id:
            raise ValueError("Paystack invoice finalization requires provider_invoice_id")

        finalized = await self._request(
            "POST",
            f"/paymentrequest/finalize/{provider_invoice_id}",
            json_payload={"send_notification": False},
        )
        invoice = finalized.get("data") or {}
        return {
            "provider": self.provider_name,
            "provider_invoice_id": provider_invoice_id,
            "provider_hosted_url": invoice.get("invoice_url") or invoice.get("offline_reference"),
            "status": invoice.get("status") or "open",
            "raw": invoice,
        }

    async def collect_payment(self, payload: dict[str, Any]) -> dict[str, Any]:
        billing_email = payload.get("billing_email")
        if not billing_email:
            raise ValueError("Paystack payment collection requires billing_email")

        body = {
            "email": billing_email,
            "amount": self._as_subunit(payload.get("amount") or 0),
            "currency": str(payload.get("currency") or "NGN").upper(),
            "reference": payload.get("reference") or payload.get("provider_invoice_id"),
            "metadata": payload.get("metadata") or {},
        }
        initialized = await self._request("POST", "/transaction/initialize", json_payload=body)
        data = initialized.get("data") or {}
        return {
            "provider": self.provider_name,
            "provider_payment_id": data.get("reference"),
            "status": "pending",
            "authorization_url": data.get("authorization_url"),
            "raw": data,
        }

    def parse_webhook(self, payload: dict[str, Any]) -> dict[str, Any]:
        event_type = str(payload.get("event") or payload.get("type") or "unknown")
        data = payload.get("data", {}) if isinstance(payload.get("data", {}), dict) else {}
        metadata = data.get("metadata", {}) if isinstance(data.get("metadata", {}), dict) else {}

        status = str(data.get("status") or "pending")
        if event_type in {"charge.success", "paymentrequest.success"}:
            status = "paid"
        elif event_type in {"charge.failed", "paymentrequest.pending"}:
            status = "failed" if event_type == "charge.failed" else "pending"

        return {
            "event_id": str(data.get("id") or payload.get("id") or payload.get("event") or ""),
            "event_type": event_type,
            "invoice_uid": metadata.get("invoice_uid"),
            "tenant_slug": metadata.get("tenant_slug"),
            "amount": data.get("amount") or 0,
            "currency": str(data.get("currency") or "NGN").upper(),
            "status": status,
            "provider_reference": data.get("reference") or data.get("request_code"),
        }
