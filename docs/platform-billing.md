# Platform Billing (Control Plane)

## Scope
This document describes the platform-level billing implementation for tenant subscriptions and invoicing.

It is intentionally isolated from operational test billing under `beak/modules/core/billing/*`.

For caps/limits and billable feature entitlements, see:

- `docs/platform-billing-caps-entitlements.md`

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
- `GET /tenants/{slug}/invoices/{invoice_uid}/payment-proofs`
- `POST /tenants/{slug}/payment-proofs/{proof_uid}/review`
- `GET /tenants/{slug}/payment-proofs/{proof_uid}/download`

### Portfolio and Reconciliation
- `GET /tenants/{slug}/overview`
- `GET /tenants/{slug}/payment-attempts`

### Plans, Entitlements, Usage
- `GET /plans`
- `POST /plans`
- `PUT /plans/{plan_code}`
- `GET /tenants/{slug}/entitlements`
- `PUT /tenants/{slug}/entitlements`
- `GET /tenants/{slug}/usage`

### Providers and Webhooks
- `GET /providers/health`
- `POST /webhooks/stripe`
- `POST /webhooks/paystack`

### Tenant Self-Service (Authenticated Tenant User)
All routes are under `/api/v1/billing/self-service`.

- `GET /subscription`
- `GET /overview`
- `GET /entitlements`
- `GET /invoices`
- `GET /payment-attempts`
- `POST /invoices/{invoice_uid}/payment-proofs` (multipart upload)
- `GET /invoices/{invoice_uid}/payment-proofs`
- `GET /payment-proofs/{proof_uid}/download`

Platform reviewers can approve/reject proof uploads and optionally settle invoices from proof review.

## RBAC
Uses platform JWT auth and platform roles:

- Write operations: `administrator` or `billing`
- Read operations: `administrator`, `billing`, or `support`

## Data Model
Platform schema bootstrap now creates these tables idempotently via:

- ORM models in `beak/modules/platform/models.py`
- ORM models in `beak/modules/platform/billing/models.py`
- bootstrap executor in `beak/migrations/platform_bootstrap.py`
- platform revision path `beak/migrations/platform_versions/`

- `billing_customer`
- `billing_subscription`
- `billing_subscription_item`
- `billing_usage_record_daily`
- `billing_invoice`
- `billing_invoice_line`
- `billing_payment_attempt`
- `billing_payment_proof`
- `billing_payment_allocation`
- `billing_webhook_event`
- `billing_provider_account_config`
- `billing_audit_log`
- `billing_plan`
- `billing_plan_limit`
- `billing_plan_feature`
- `billing_tenant_override`
- `billing_usage_counter`

Implemented constraints include:

- primary key `billing_customer.tenant_slug`
- unique `billing_invoice.invoice_number`
- unique `billing_webhook_event.idempotency_key`

### Schema Evolution Rule
- Additive platform table/index additions should be captured in platform revisions under `beak/migrations/platform_versions/`.
- Structural mutations (rename/drop/alter type/nullability/default/constraints) also require explicit platform revisions in `beak/migrations/platform_versions/`.
- Tenant revisions remain in `beak/migrations/versions/` and are applied only when `TENANT_SCHEMA` is set.

## Provider Adapters
Adapters are implemented with `httpx`:

- Stripe: `beak/modules/platform/billing/providers/stripe.py`
- Paystack: `beak/modules/platform/billing/providers/paystack.py`

### Stripe and Paystack Positioning
- Stripe announced the Paystack acquisition on October 15, 2020.
- Paystack continues to operate with its own API surface and credentials (`https://api.paystack.co`, `PAYSTACK_SECRET_KEY`).
- For this codebase, Stripe and Paystack remain separate provider adapters. Paystack is not managed through Stripe API objects in this implementation.

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
- invoice payment proof visibility (tenant uploads)
- provider health panel

Tenant app billing page (`webapp/views/billing/BillingSubscription.vue`) now includes:

- subscription details (plan/status/MRR/next billing)
- invoice list with provider hosted payment links (when available)
- off-platform proof upload and secure download
- entitlement visibility

API client methods are in `webapp/composables/platform_api.ts`.

## Tests
Unit tests:

- `beak/tests/unit/platform/billing/test_provider_adapters.py`
- `beak/tests/unit/platform/billing/test_platform_billing_service.py`
- `beak/tests/unit/platform/billing/test_platform_billing_entitlements.py`

Run:

```bash
.venv/bin/pytest -q beak/tests/unit/platform/billing
```
