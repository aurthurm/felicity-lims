# Organisation-as-Tenant With Dual Isolation (Schema/Database)

## Summary
Convert `organisation` into the physical tenant boundary while preserving existing lab-scoped LIMS behavior (`laboratory_uid` context, lab filters, lab switching).  
Provisioning becomes the only place tenant migrations run (`alembic upgrade head` per tenant target).  
A platform registry in a dedicated `platform` schema tracks tenants and their connection/isolation metadata.

## Confirmed Decisions
- Organisation is the tenant root; labs belong to organisations.
- Tenant resolution: header-based.
- Default isolation mode: schema-per-tenant.
- Platform registry location: `platform` schema in the same Postgres DB.
- Legacy rollout: no immediate data move; current install continues as-is, future tenants are provisioned explicitly.

## Public/API/Interface Changes
- New request header contract:
  - `X-Tenant-ID` (required on protected tenant routes; compatibility alias from `X-Organization-ID` initially).
  - `X-Laboratory-ID` remains unchanged for lab context.
- New platform provisioning interface (CLI + optional REST/GraphQL admin mutation):
  - `provision_tenant(tenant_id, organization_name, isolation_mode, schema_name?, database_name?, run_seeds=true)`
- New platform registry schema/table (example):
  - `platform.tenant_registry`
  - fields: `tenant_id`, `organization_uid`, `organization_setup_name`, `isolation_mode` (`schema|database`), `db_host`, `db_port`, `db_name`, `db_user`, `db_secret_ref`, `schema_name`, `status`, `created_at`, `updated_at`.
- Runtime context extension:
  - `TenantContext` adds `tenant_id` and resolved connection target metadata.

## Implementation Plan

1. Platform Registry Foundation
- Add `platform` schema bootstrap and `tenant_registry` model/repository/service.
- Keep platform metadata outside tenant lab data.
- Add unique constraints for `tenant_id`, `organization_uid`, and `(db_name, schema_name)` where relevant.

2. Split Migration Responsibility
- Introduce tenant-aware Alembic execution via `-x` args or config attributes:
  - `tenant_url`
  - `tenant_schema` (for schema mode)
- Update `beak/migrations/env.py` to:
  - use target tenant URL at runtime,
  - set schema context for tenant migrations (search path).
- Enforce rule: app startup does not run tenant migrations automatically.
- Keep migration invocation only in provisioning workflow and explicit admin/ops commands.

3. Tenant-Aware DB Session Routing
- Replace single global session binding with tenant-resolved session factory:
  - schema mode: shared engine + per-session `SET LOCAL search_path=<tenant_schema>,public`.
  - database mode: engine/sessionmaker cache keyed by tenant DB URL.
- Ensure repository/service usage remains compatible with existing interfaces.
- Keep existing lab-level filtering (`LabScopedEntity`, `MaybeLabScopedEntity`) intact.

4. Middleware and Context Resolution
- Add/adjust middleware order:
  1. Tenant resolution middleware (reads `X-Tenant-ID` / compatibility alias).
  2. Existing tenant context middleware for user/lab/org validation.
- Resolve tenant from platform registry before DB session usage.
- Preserve existing `X-Laboratory-ID` membership checks against the selected tenant.

5. Provisioning Workflow (Authoritative Path)
- New provisioning service flow:
  1. Validate tenant request + uniqueness.
  2. Create physical target:
     - schema mode: create schema if missing.
     - database mode: create database and credentials (or use pre-provisioned).
  3. Run `alembic upgrade head` against that tenant target.
  4. Seed required tenant baseline:
     - organization + organization settings,
     - laboratory and lab settings,
     - required other lab tables baseline seeds.
  5. Register/activate tenant in `platform.tenant_registry`.
- Failures roll back registry status to `failed` with error metadata.

6. Backward Compatibility Strategy
- Keep current single-tenant data untouched.
- Register it as a legacy tenant record pointing to current storage target.
- Continue honoring current LIMS behavior for active laboratory and lab-scoped data access.
- Keep compatibility for `X-Organization-ID` during transition; deprecate later.

7. Operational Controls
- Add explicit tenant migration command:
  - `beak-lims tenant migrate --tenant-id <id> --revision head`
- Add tenant health command:
  - verifies connectivity + `alembic_version` for a tenant.
- Add guardrails to prevent accidental global migration command paths in runtime boot flow.

## Test Cases and Scenarios

1. Provisioning
- Provision schema-mode tenant creates schema, migrates, seeds, and registers active status.
- Provision database-mode tenant creates DB target, migrates, seeds, and registers active status.
- Duplicate tenant IDs or organization IDs fail safely.

2. Migration Isolation
- Running provisioning for tenant A does not modify tenant B tables/data.
- `alembic_version` is correct per tenant target.

3. Runtime Routing
- Requests with valid `X-Tenant-ID` + `X-Laboratory-ID` read/write only that tenant data.
- Cross-tenant laboratory access is rejected.
- Missing/invalid tenant header on protected routes returns clear error.

4. Compatibility
- Existing legacy deployment continues functioning without data move.
- Existing lab-scoped behavior (queries/inserts with `laboratory_uid`) unchanged.

5. Security/Validation
- User membership checks remain enforced per selected tenant.
- Superuser override behavior remains explicit and auditable.

6. Regression
- Core workflows (sample registration, analysis, billing, reporting, user auth) pass under at least one schema-mode and one database-mode tenant.

## Assumptions and Defaults
- Organisation is always the tenant root; laboratories are children of organisations.
- No lab exists outside an organisation tenant.
- No cross-organisation lab access.
- Default isolation for new tenants: schema mode.
- Platform registry is stored in `platform` schema in current DB.
- Tenant identity comes from header (`X-Tenant-ID`), not JWT claim changes in this phase.
- No immediate migration of existing live tenant data; onboarding is additive.
- Other lab tables are provisioned per tenant after per-tenant migration, not globally.
