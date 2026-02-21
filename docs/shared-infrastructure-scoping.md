# Shared Infrastructure Scoping (Redis, MinIO, Mongo, Postgres)

## Summary
`beak/modules/shared/infrastructure/*` centralizes cross-cutting clients for:
- MinIO object storage
- Redis cache/locks/tracking
- Mongo document storage

Scoping is handled with `TenantStorageScope` and `resolve_storage_scope(...)` in:
- `beak/modules/shared/infrastructure/scope.py`

## What Must Be Scoped by Tenant/Lab
- Business/domain data tied to tenant ownership must be scoped by `tenant_slug`.
- Data tied to a specific laboratory must also include `laboratory_uid`.
- Audit/event data should be at least tenant scoped.
- Request throttling and processing locks should include tenant and, when available, lab/user identifiers.

## What Can Stay Global
- Infrastructure-level safety controls not tied to tenant ownership (for example coarse IP safety limits).
- Shared static assets intentionally global for all tenants.
- One-off platform-only maintenance keys that are not tenant data.

## Service-by-Service Guidance
### Postgres (primary relational source of truth)
- Keep strict schema-level tenant isolation where the domain already uses tenant schemas.
- Platform control-plane tables (for example platform billing) remain in platform schema, keyed by tenant slug where applicable.

### Mongo
- Treat collections as shared infra; apply scope filters for tenant-owned documents.
- In this repo, `MongoService` now accepts `scope` and merges tenant/lab/org filters.
- Use explicit indexes for high-volume scoped fields (`tenant_slug`, `laboratory_uid`) per collection.

### Redis
- Redis is shared infra and should be treated as keyspace-agnostic infrastructure.
- Tenant/lab ownership is enforced by key naming conventions, not Redis schemas.
- Use scoped key builders (`processing_key`) so domain code cannot accidentally create unscoped business locks/counters.

### MinIO
- MinIO is shared infra and bucket-level schemas are not required for tenant separation.
- Tenant/lab ownership is enforced by object path prefixes (`tenants/{tenant}/labs/{lab}/...`).
- Use scoped path builders (`build_scoped_object_name`) for all tenant-owned object writes/reads.

## Do These Have Schemas?
- Postgres: Yes, explicit database schemas and tables.
- Mongo: No SQL schemas; use collection contracts, validation (optional), and indexes.
- Redis: No schemas; use strict key format contracts and TTL policies.
- MinIO: No schemas; use bucket policy + path prefix conventions.

## Operational Rule of Thumb
- If losing tenant context would risk cross-tenant data read/write, require `resolve_storage_scope(require_tenant=True)`.
- If data is lab-owned, require `resolve_storage_scope(require_tenant=True, require_lab=True)`.
- Only allow global scope when data is explicitly platform-global and non-tenant-owned.
