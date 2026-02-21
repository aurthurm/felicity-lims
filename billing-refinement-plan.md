# Platform Billing Caps, Limits, and Entitlements Refinement Plan

## Summary
Implement platform-enforced billing controls for:
- Tenant user caps
- Tenant laboratory caps
- API request caps per user, lab, and tenant
- Billable feature entitlements: `billing`, `inventory`, `storage`, `grind`, `document`, `shipment`, `worksheet`, `reflex`

Decisions:
- Enforcement: hard-block on cap breach
- Storage: dedicated normalized plan/entitlement tables
- Module strategy: feature entitlements under core (no runtime module-ID remap)

## Scope
In scope:
- Platform schema changes for plans, limits, features, overrides, usage counters
- Backend services to resolve entitlements and meter usage
- Enforcement wiring in middleware and critical mutation flows
- Platform REST API additions for plans, entitlements, usage views
- Platform webapp updates for plan/entitlement/usage management
- Tests for entitlement resolution and cap/feature enforcement

Out of scope (initial pass):
- New pricing calculators for soft-overage billing
- Changing runtime module registry architecture
- Tenant-side self-service billing plan edits

## Data Model Changes (platform schema)
Add tables:
1. `billing_plan`
- `uid`, `plan_code` (unique), `name`, `active`, `currency`, `base_amount`, timestamps

2. `billing_plan_limit`
- `uid`, `plan_uid`, `metric_key`, `limit_value`, `window`, `enforcement_mode`, timestamps
- Metric keys:
  - `tenant_users`
  - `tenant_labs`
  - `api_requests_user`
  - `api_requests_lab`
  - `api_requests_tenant`

3. `billing_plan_feature`
- `uid`, `plan_uid`, `feature_key`, `enabled`, optional `included_units`, optional `unit_price`, timestamps
- Feature keys:
  - `billing`, `inventory`, `storage`, `grind`, `document`, `shipment`, `worksheet`, `reflex`

4. `billing_tenant_override`
- `uid`, `tenant_slug`, `metric_key` (nullable), `feature_key` (nullable),
  `override_limit_value` (nullable), `override_enabled` (nullable),
  `window` (nullable), `enforcement_mode` (nullable), metadata, timestamps
- Constraint: at least one of `metric_key` or `feature_key` is set

5. `billing_usage_counter`
- `uid`, `tenant_slug`, `metric_key`, `window_start`, `window_end`,
  `scope_user_uid` (nullable), `scope_lab_uid` (nullable), `quantity`, timestamps
- Unique key on (`tenant_slug`, `metric_key`, `window_start`, `scope_user_uid`, `scope_lab_uid`)

Compatibility updates:
- Extend `bootstrap_platform_schema` in `beak/migrations/env.py` with `CREATE TABLE IF NOT EXISTS` for new tables
- Add dedicated Alembic migration in `beak/migrations/versions/`

## Domain + Service Layer
Add new entities/schemas/services under `beak/modules/platform/billing/`:

### Entities
- `BillingLimitMetricKey` enum
- `BillingFeatureKey` enum
- `BillingLimitWindow` enum
- `BillingEnforcementMode` enum (start with `hard_block`)

### Schemas
- Plan CRUD: `BillingPlanCreate`, `BillingPlanUpdate`, `BillingPlanOut`
- Limit schemas: `BillingPlanLimitInput`, `BillingPlanLimitOut`
- Feature schemas: `BillingPlanFeatureInput`, `BillingPlanFeatureOut`
- Effective entitlement output:
  - `TenantEffectiveLimit`
  - `TenantEffectiveFeature`
  - `TenantEntitlementsOut`
- Usage output:
  - `UsageCounterRow`
  - `TenantUsageSnapshot`

### Repository additions
- Plan CRUD + upsert children (limits/features)
- Tenant override CRUD
- Usage counter read/increment (atomic upsert)
- Count helpers:
  - users in tenant schema
  - labs in tenant schema

### Services
1. `PlatformEntitlementService`
- Resolve effective entitlements by:
  1. active subscription (`plan_code`)
  2. plan limits/features
  3. tenant overrides
- TTL cache keyed by `tenant_slug`

2. `PlatformUsageMeteringService`
- Resolve current window bucket (`minute`, `hour`, `day`, `month`)
- Atomic increment usage counters
- Read usage snapshots

3. `PlatformCapEnforcementService`
- `assert_limit_not_exceeded(...)`
- `assert_feature_enabled(...)`
- Explicit exception contracts for API mapping

## Enforcement Integration
### API rate limits (`beak/lims/middleware/ratelimit.py`)
- Replace static limits with entitlement-resolved values:
  - user scope from `api_requests_user`
  - lab scope from `api_requests_lab`
  - tenant scope from `api_requests_tenant`
- Keep IP limits as infrastructure safety fallback
- Return consistent 429 payload/header when dynamic cap is exceeded

### Feature entitlements
- Add feature guard utility and dependency wrappers
- Apply to selected feature entrypoints:
  - billing GraphQL/REST
  - inventory
  - storage
  - grind
  - document
  - shipment
  - worksheet
  - reflex
- For GraphQL, extend field-to-feature mapping for guarded roots

### Tenant user cap
- Enforce before:
  - `create_user`
  - `create_user_with_laboratory`
  - bulk assignment paths that can create effective billable users
- Count distinct users in tenant scope

### Tenant lab cap
- Enforce before:
  - tenant lab creation in setup mutations
  - platform lab add endpoint flow

## Platform REST API Additions
Under `beak/modules/platform/api/rest.py`:
1. `GET /platform/billing/plans`
2. `POST /platform/billing/plans`
3. `PUT /platform/billing/plans/{plan_code}`
4. `GET /platform/billing/tenants/{slug}/entitlements`
5. `PUT /platform/billing/tenants/{slug}/entitlements` (override write)
6. `GET /platform/billing/tenants/{slug}/usage`

Role policy:
- Read: `ADMINISTRATOR`, `BILLING`, `SUPPORT`
- Write: `ADMINISTRATOR`, `BILLING`

## Webapp Changes
### `webapp/composables/platform_api.ts`
Add types + methods for:
- Plan list/create/update
- Tenant entitlements get/update
- Usage snapshot fetch

### `webapp/views/platform/Dashboard.vue`
Add sections:
- Plans (CRUD)
- Tenant Entitlements (effective + overrides)
- Usage (metric counters vs limits)

## Error Contract
Introduce structured errors:
- `CAP_LIMIT_EXCEEDED`
  - fields: `metric_key`, `limit`, `current`, `scope`, `window`
- `FEATURE_NOT_ENTITLED`
  - fields: `feature_key`, `tenant_slug`, `plan_code`

Status codes:
- 429 for request-rate caps
- 403 for business caps and feature entitlement denial

## Tests
### Unit
- Entitlement resolution precedence (plan vs override)
- Feature guard pass/fail
- Cap threshold behavior at boundary

### Integration
- Create user blocked at `tenant_users` cap
- Create lab blocked at `tenant_labs` cap
- Rate middleware enforces entitlement limits

### API
- Plan endpoints behavior and validation
- Tenant entitlement and usage endpoints

## Rollout
1. Apply the schema and service changes as one cutover.
2. Seed baseline plans and map current subscriptions by `plan_code`.
3. Enforce limits and entitlements immediately after deployment.

## Assumptions
- `shipmet` interpreted as `shipment`.
- Existing `enabled_modules` remains for module architecture; billable feature entitlements are additional enforcement.
- Initial enforcement mode is hard-block globally, from initial deployment.
