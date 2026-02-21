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
