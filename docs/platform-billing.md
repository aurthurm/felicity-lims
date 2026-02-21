# Platform Billing (Control Plane)

## Scope
This document describes the platform-level billing implementation for tenant subscriptions and invoicing.

It is intentionally isolated from operational test billing under `beak/modules/core/billing/*`.

## Feature Flag
Platform billing APIs are gated by:

- `PLATFORM_BILLING_ENABLED`

When disabled, platform billing routes return `404` with `Platform billing is disabled`.

## Configuration
Add these environment variables:

- `PLATFORM_BILLING_ENABLED` (`True|False`)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_WEBHOOK_SECRET`

`/api/v1/platform/billing/providers/health` reflects whether provider credentials are configured.

## API Surface
All routes are under `/api/v1/platform/billing`.

### Tenant Profile
- `GET /tenants/{slug}/profile`
- `PUT /tenants/{slug}/profile`

### Subscription Lifecycle
- `GET /tenants/{slug}/subscription`
- `PUT /tenants/{slug}/subscription`

### Invoice Lifecycle
- `POST /tenants/{slug}/invoices`
- `GET /tenants/{slug}/invoices`
- `GET /tenants/{slug}/invoices/{invoice_uid}`
- `POST /tenants/{slug}/invoices/{invoice_uid}/finalize`
- `POST /tenants/{slug}/invoices/{invoice_uid}/send`
- `POST /tenants/{slug}/invoices/{invoice_uid}/mark-paid`

### Portfolio and Reconciliation
- `GET /tenants/{slug}/overview`
- `GET /tenants/{slug}/payment-attempts`

### Providers and Webhooks
- `GET /providers/health`
- `POST /webhooks/stripe`
- `POST /webhooks/paystack`

## RBAC
Uses platform JWT auth and platform roles:

- Write operations: `administrator` or `billing`
- Read operations: `administrator`, `billing`, or `support`

## Data Model
Platform schema bootstrap now creates these tables idempotently in `beak/migrations/env.py`:

- `billing_customer`
- `billing_subscription`
- `billing_subscription_item`
- `billing_usage_record_daily`
- `billing_invoice`
- `billing_invoice_line`
- `billing_payment_attempt`
- `billing_payment_allocation`
- `billing_webhook_event`
- `billing_provider_account_config`
- `billing_audit_log`

Implemented constraints include:

- unique `billing_customer.tenant_slug`
- unique `billing_invoice.invoice_number`
- unique `billing_webhook_event.idempotency_key`

## Provider Adapters
Adapters are implemented with `httpx`:

- Stripe: `beak/modules/platform/billing/providers/stripe.py`
- Paystack: `beak/modules/platform/billing/providers/paystack.py`

The service stores provider object identifiers in metadata for later lifecycle operations:

- profile metadata: `provider_customer_id`
- subscription metadata: `provider_subscription_id`, `provider_subscription_token`
- invoice metadata: `provider_invoice_id`, `provider_hosted_url`

## Webhook Handling
Webhook processing flow:

1. verify signature (`billing/webhooks.py`)
2. normalize provider event via adapter `parse_webhook`
3. idempotency check via `billing_webhook_event`
4. invoice/payment status reconciliation
5. mark webhook event as processed

## Frontend
Platform dashboard billing tab (`webapp/views/platform/Dashboard.vue`) now includes:

- tenant billing portfolio table (plan/status/aging/MRR)
- tenant billing profile/subscription editing
- invoice workflow actions
- recent payment attempts
- provider health panel

API client methods are in `webapp/composables/platform_api.ts`.

## Tests
Unit tests:

- `beak/tests/unit/platform/billing/test_provider_adapters.py`
- `beak/tests/unit/platform/billing/test_platform_billing_service.py`

Run:

```bash
.venv/bin/pytest -q beak/tests/unit/platform/billing/test_provider_adapters.py beak/tests/unit/platform/billing/test_platform_billing_service.py
```
