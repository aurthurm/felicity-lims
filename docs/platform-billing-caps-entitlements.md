# Platform Billing Caps & Entitlements

## Scope
This document covers the caps/limits and billable feature entitlement system introduced on top of platform billing.

This is part of platform control-plane billing (`/api/v1/platform/billing/*`) and is separate from tenant operational billing.

## Behavior Model
Default behavior is hard enforcement.

- If a cap is reached, requests/mutations are blocked.
- If a feature is not entitled, guarded API fields/routes are blocked.
- Usage counters are tracked in platform schema per metric/window/scope.

## Feature Flag
Caps/entitlements enforcement is active when:

- `PLATFORM_BILLING_ENABLED=True`

When disabled, platform billing routes return `404` and cap/entitlement checks are bypassed.

## New API Endpoints
All under `/api/v1/platform/billing`.

### Plans
- `GET /plans`
- `POST /plans`
- `PUT /plans/{plan_code}`

### Tenant Entitlements
- `GET /tenants/{slug}/entitlements`
- `PUT /tenants/{slug}/entitlements`

### Tenant Usage
- `GET /tenants/{slug}/usage`

## Request/Response Shapes
### Plan create payload (example)
```json
{
  "plan_code": "starter",
  "name": "Starter",
  "active": true,
  "currency": "USD",
  "base_amount": "49.00",
  "limits": [
    {
      "metric_key": "tenant_users",
      "limit_value": 25,
      "window": "month",
      "enforcement_mode": "hard_block"
    },
    {
      "metric_key": "api_requests_tenant",
      "limit_value": 60000,
      "window": "month",
      "enforcement_mode": "hard_block"
    }
  ],
  "features": [
    {"feature_key": "inventory", "enabled": true, "included_units": "0", "unit_price": "0"},
    {"feature_key": "storage", "enabled": true, "included_units": "0", "unit_price": "0"},
    {"feature_key": "billing", "enabled": false, "included_units": "0", "unit_price": "0"}
  ]
}
```

### Tenant override payload (example)
```json
[
  {
    "metric_key": "tenant_users",
    "override_limit_value": 50,
    "window": "month",
    "enforcement_mode": "hard_block",
    "metadata": {"reason": "enterprise contract"}
  },
  {
    "feature_key": "billing",
    "override_enabled": true,
    "metadata": {"ticket": "SUP-1234"}
  }
]
```

## Metric Keys
- `tenant_users`
- `tenant_labs`
- `api_requests_user`
- `api_requests_lab`
- `api_requests_tenant`

## Feature Keys
- `billing`
- `inventory`
- `storage`
- `grind`
- `document`
- `shipment`
- `worksheet`
- `reflex`

## Window Values
- `instant`
- `minute`
- `hour`
- `day`
- `month`

## Enforcement Points
### Tenant capacity (hard cap)
- User creation is blocked when `tenant_users` cap is reached.
  - `beak/modules/core/api/gql/user/mutations.py`
- Lab creation is blocked when `tenant_labs` cap is reached.
  - `beak/modules/core/api/gql/setup/mutations.py`
  - `beak/modules/platform/services.py` (platform add-lab path)

### Feature entitlement guards
GraphQL root fields are mapped to features and denied if feature is disabled for the tenant.

- `beak/modules/platform/feature_graphql_fields.py`
- `beak/lims/middleware/module_guard.py`

### API request caps
Request caps are checked in rate-limit middleware using tenant context and billing limits:

- `api_requests_user` (user scope)
- `api_requests_lab` (lab scope)
- `api_requests_tenant` (tenant scope)

Implementation:
- `beak/lims/middleware/ratelimit.py`
- `beak/modules/platform/billing/services.py`
- `beak/modules/platform/billing/repository.py`

## Data Model Additions
Platform schema tables:

- `billing_plan`
- `billing_plan_limit`
- `billing_plan_feature`
- `billing_tenant_override`
- `billing_usage_counter`

Defined in:
- bootstrap path: `beak/migrations/env.py`
- revision: `beak/migrations/versions/2026_02_21_1330-f7b2c1d4e9aa_add_billing_caps_entitlements.py`

## Error Semantics
Current hard-block semantics:

- Cap exceeded: message contains `CAP_LIMIT_EXCEEDED ...`
- Feature disabled: message contains `FEATURE_NOT_ENTITLED ...`

Typical HTTP outcomes:
- `429` for request-rate cap denials in middleware
- `403` for feature/operation entitlement denials

## Platform UI
Platform dashboard now includes management and visibility for these additions:

- plans CRUD
- tenant effective entitlements
- tenant override submission
- tenant usage counters

Files:
- `webapp/composables/platform_api.ts`
- `webapp/views/platform/Dashboard.vue`

## Tests
- existing: `beak/tests/unit/platform/billing/test_platform_billing_service.py`
- added: `beak/tests/unit/platform/billing/test_platform_billing_entitlements.py`

Run billing unit tests:

```bash
.venv/bin/pytest -q beak/tests/unit/platform/billing
```

## Operator Runbook (First-Time Setup)
This runbook assumes:

- Platform API is reachable at `/api/v1/platform`
- `PLATFORM_BILLING_ENABLED=True`
- You are authenticated with a platform user that has `administrator` or `billing` role

### 1. Create a baseline plan
Create a plan with at least:

- `tenant_users`
- `tenant_labs`
- request caps (`api_requests_user`, `api_requests_lab`, `api_requests_tenant`)
- feature flags for all billable features

Example:
```bash
curl -X POST "$BASE/api/v1/platform/billing/plans" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_code": "starter",
    "name": "Starter",
    "active": true,
    "currency": "USD",
    "base_amount": "49.00",
    "limits": [
      {"metric_key":"tenant_users","limit_value":25,"window":"month","enforcement_mode":"hard_block"},
      {"metric_key":"tenant_labs","limit_value":3,"window":"month","enforcement_mode":"hard_block"},
      {"metric_key":"api_requests_user","limit_value":2000,"window":"hour","enforcement_mode":"hard_block"},
      {"metric_key":"api_requests_lab","limit_value":30000,"window":"hour","enforcement_mode":"hard_block"},
      {"metric_key":"api_requests_tenant","limit_value":120000,"window":"hour","enforcement_mode":"hard_block"}
    ],
    "features": [
      {"feature_key":"billing","enabled":true},
      {"feature_key":"inventory","enabled":true},
      {"feature_key":"storage","enabled":true},
      {"feature_key":"grind","enabled":true},
      {"feature_key":"document","enabled":true},
      {"feature_key":"shipment","enabled":true},
      {"feature_key":"worksheet","enabled":true},
      {"feature_key":"reflex","enabled":true}
    ]
  }'
```

### 2. Attach tenant subscription to plan
Set tenant subscription `plan_code` to the plan created above.

```bash
curl -X PUT "$BASE/api/v1/platform/billing/tenants/$TENANT/subscription" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_code":"starter",
    "status":"active",
    "base_amount":"49.00",
    "usage_overage_amount":"0",
    "mrr_snapshot":"49.00",
    "metadata":{}
  }'
```

### 3. Verify effective entitlements
```bash
curl -X GET "$BASE/api/v1/platform/billing/tenants/$TENANT/entitlements" \
  -H "Authorization: Bearer $TOKEN"
```

Confirm:
- limits are present with expected values/windows
- features reflect plan defaults (plus overrides if any)

### 4. Apply tenant-specific overrides (optional)
```bash
curl -X PUT "$BASE/api/v1/platform/billing/tenants/$TENANT/entitlements" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"metric_key":"tenant_users","override_limit_value":50,"window":"month","enforcement_mode":"hard_block"},
    {"feature_key":"billing","override_enabled":true}
  ]'
```

### 5. Smoke test hard enforcement
Do the following in tenant app scope:

- attempt creating users until over `tenant_users` cap
- attempt creating labs until over `tenant_labs` cap
- call guarded feature APIs/GraphQL fields for disabled features

Expected:
- cap errors with `CAP_LIMIT_EXCEEDED`
- feature errors with `FEATURE_NOT_ENTITLED`

### 6. Validate usage counters
```bash
curl -X GET "$BASE/api/v1/platform/billing/tenants/$TENANT/usage" \
  -H "Authorization: Bearer $TOKEN"
```

Confirm counters exist for request metrics and increase over traffic.

### 7. Platform dashboard checks
In `webapp/views/platform/Dashboard.vue` billing tab, verify:

- plans list includes your plan
- entitlements panel matches API data
- usage panel shows non-empty counters after traffic
