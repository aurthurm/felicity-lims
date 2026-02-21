# Platform Billing (Tenant Subscription + Invoicing) Plan

## Summary
Implement a new platform-level billing domain (separate from tenant operational test billing) to manage tenant subscriptions, invoices, payments, and reconciliation in the platform control plane.

Selected defaults:
- Billing model: Hybrid (base subscription + usage overages)
- Payment mix: Invoice + bank transfer + card fallback
- Africa strategy: Stripe primary where available, Paystack fallback
- Scope: Platform billing only in this phase

## Goals
- Add tenant subscription lifecycle management in platform control plane
- Add invoice generation, finalization, sending, and reconciliation
- Add payment attempt tracking and webhook-driven status updates
- Keep existing tenant/patient/client test billing behavior unchanged

## Non-Goals (Phase 1)
- No changes to `beak/modules/core/billing/*` operational billing flow
- No mandatory PayPal integration at launch
- No multi-currency tax engine in this phase

## API and Interface Additions

### New backend package
Create:
- `beak/modules/platform/billing/entities.py`
- `beak/modules/platform/billing/schemas.py`
- `beak/modules/platform/billing/repository.py`
- `beak/modules/platform/billing/services.py`
- `beak/modules/platform/billing/providers/base.py`
- `beak/modules/platform/billing/providers/stripe.py`
- `beak/modules/platform/billing/providers/paystack.py`
- `beak/modules/platform/billing/webhooks.py`

### New platform REST endpoints
Under `/api/v1/platform/billing`:
- `GET /tenants/{slug}/profile`
- `PUT /tenants/{slug}/profile`
- `GET /tenants/{slug}/subscription`
- `PUT /tenants/{slug}/subscription`
- `POST /tenants/{slug}/invoices`
- `GET /tenants/{slug}/invoices`
- `GET /tenants/{slug}/invoices/{invoice_uid}`
- `POST /tenants/{slug}/invoices/{invoice_uid}/finalize`
- `POST /tenants/{slug}/invoices/{invoice_uid}/send`
- `POST /tenants/{slug}/invoices/{invoice_uid}/mark-paid`
- `GET /providers/health`
- `POST /webhooks/stripe`
- `POST /webhooks/paystack`

### Frontend changes
- Replace Billing placeholder in `webapp/views/platform/Dashboard.vue` with:
  - Tenant billing overview table (plan, status, AR aging, MRR snapshot)
  - Tenant billing detail drawer (subscription, invoices, payment attempts)
  - Provider health panel
- Extend `webapp/composables/platform_api.ts` with billing methods for all new endpoints

### Auth and RBAC
- Reuse platform JWT auth
- Billing routes:
  - write: `PlatformRole.BILLING` or `PlatformRole.ADMINISTRATOR`
  - read-only where needed: `PlatformRole.SUPPORT`

## Data Model (Platform Schema)

Create platform tables:
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

Status enums:
- Subscription: `trialing | active | past_due | paused | canceled`
- Invoice: `draft | open | paid | void | uncollectible`
- Payment attempt: `pending | succeeded | failed | action_required`

Constraints:
- `tenant_slug` unique in `billing_customer`
- idempotency key unique on webhook event table
- invoice number unique platform-wide
- no PCI card data persisted

## Architecture and Flow

### 1) Domain isolation
- Keep platform billing isolated from operational billing domain
- No direct coupling to `TestBill`, `TestBillTransaction`, or voucher flows

### 2) Provider abstraction
- Define `BillingProviderAdapter` contract:
  - `create_or_sync_customer`
  - `create_subscription`
  - `change_subscription`
  - `create_invoice`
  - `finalize_invoice`
  - `collect_payment`
  - `parse_webhook`
- Implement Stripe adapter first
- Implement Paystack adapter for supported African rails
- Leave PayPal as optional phase 2 extension

### 3) Billing engine behavior
- Monthly billing cycle:
  - resolve base plan
  - compute usage overages
  - create draft invoice
  - finalize/send based on tenant billing settings
- Reconciliation:
  - webhook-first state updates
  - manual `mark-paid` for off-platform bank transfer
  - retry policy for failed payment attempts
- Aging buckets: `current`, `30`, `60`, `90+`

### 4) Platform UX behavior
- Billing tab default: portfolio list across tenants
- Tenant drawer:
  - plan and renewal window
  - unpaid/open invoices
  - recent payment attempts
  - actions: send reminder, mark paid, pause/cancel subscription

## Migration and Bootstrap
- Extend `bootstrap_platform_schema()` in `beak/migrations/env.py` with idempotent table creation for platform billing tables
- Avoid tenant-schema migration dependency for platform billing artifacts
- Keep compatibility with existing platform `tenant` registry bootstrap

## Testing Plan

### Backend unit tests
- Provider adapter contract tests (success/failure/action_required)
- Invoice total + rounding correctness
- Valid/invalid status transitions
- Webhook signature validation and idempotency

### Backend integration tests
- Billing endpoint auth/role enforcement
- Subscription lifecycle: create/change/pause/cancel
- Invoice lifecycle: create/finalize/send/mark-paid
- Payment retry and `past_due` transitions

### Frontend tests
- Billing tab renders real API data
- Drawer actions trigger API and update UI state
- Error-state handling and rollback behavior

## Acceptance Criteria
- Platform operator can configure tenant plan and billing profile
- System can generate and track invoices per tenant
- Payment and invoice status changes are fully auditable
- Existing tenant operational billing remains unaffected
- RBAC enforced for billing operations

## Rollout and Operations
- Feature flag: `PLATFORM_BILLING_ENABLED`
- Soft launch to internal/test tenants first
- Metrics:
  - invoice aging
  - collection rate
  - failed payment attempts
  - webhook processing lag
- Add reconciliation and provider outage runbooks

## Assumptions
- Date context for planning: February 21, 2026
- Platform REST remains primary integration surface for this phase
- Tenant billing currency is single-currency per tenant for phase 1
- PayPal not launch-critical for phase 1 given regional constraints

## References
- Stripe global availability: https://stripe.com/global
- Stripe invoicing payment methods: https://docs.stripe.com/invoicing/payment-methods
- Stripe bank-transfer invoicing: https://docs.stripe.com/invoicing/bank-transfer
- Stripe PayPal supported locales: https://docs.stripe.com/payments/paypal/supported-locales
- Paystack countries/channels/subscriptions:
  - https://support.paystack.com/en/articles/2130562
  - https://paystack.com/docs/payments/subscriptions/
  - https://docs-v2.production.paystack.co/docs/payments/payment-channels/
- PayPal worldwide availability: https://www.paypal.com/vn/webapps/mpp/country-worldwide
- LIMS market pricing signals:
  - https://qbench.com/pricing
  - https://cloudlims.com/cloudlims-no-upfront-cost/
