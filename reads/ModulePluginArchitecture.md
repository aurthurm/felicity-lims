# Core + Industry Module Plugin Architecture

This document explains the new architecture that separates broad, reusable LIMS capabilities from industry-specific capabilities, while keeping tenant lifecycle and governance in a dedicated platform control plane.

## Goals

- Keep shared LIMS functionality in a stable `core` module.
- Add industry packs (clinical, pharma, environment, industrial) without rewriting core.
- Allow tenant-specific module enablement and lifecycle management.
- Keep provisioning, migrations, and seeding deterministic and tenant-safe.
- Enforce runtime access boundaries for disabled modules.

## High-Level Architecture

The system is now composed of three layers:

1. Platform control plane (global)
- Owns tenant registry and platform IAM.
- Tracks tenant module profile and module state.
- Exposes CLI and REST control operations for tenant provisioning and module lifecycle.

2. Core module (tenant runtime)
- Shared LIMS capability used across industries.
- Always enabled for every tenant.

3. Industry modules (tenant runtime)
- Domain-specific capability packs.
- Enabled per tenant based on profile and entitlements.
- Current module ids: `clinical`, `pharma`, `environment`, `industrial`, `veterinary`, `food_safety`, `forensic`, `research`, `public_health`.

## Key Design Principle

A tenant has:

- one `primary_industry`
- one `enabled_modules` set, always including `core` and the primary industry
- optional extra modules where allowed by business policy

## Repository Structure (New/Updated)

### Module composition layer

- `beak/modules/contracts.py`
  - Module contract types (`ModuleManifest`, `GraphQLContrib`, `ModuleKind`)
- `beak/modules/registry.py`
  - Registry + dependency resolution (topological ordering)
- `beak/modules/default_registry.py`
  - Declares built-in modules and their composition contributions
- `beak/modules/__init__.py`
  - Default registry entrypoint
- `beak/modules/graphql_fields.py`
  - GraphQL field-to-module map for runtime guards

### Platform module governance

- `beak/modules/platform/module_catalog.py`
  - Valid module ids + normalization for tenant module selections
- `beak/modules/platform/repository.py`
  - Tenant persistence for module profile and status
- `beak/modules/platform/services.py`
  - Provision/migrate/activate/module enable-disable/list logic
- `beak/modules/platform/module_access.py`
  - Runtime module checks and dependency helpers

Legacy `beak/apps/*` paths were removed after migration; runtime now uses `beak/modules/*` paths only.

### Runtime wiring

- `beak/api/gql/schema.py`
  - GraphQL schema now composed through module registry
- `beak/api/rest/api_v1/__init__.py`
  - REST routers composed through module registry
- `beak/modules/events.py`
  - Event listeners composed through module registry
- `beak/lims/middleware/module_guard.py`
  - GraphQL POST module access guard
- `beak/lims/boot.py`
  - Registers module guard middleware

## Module Contract

Each module contributes through `ModuleManifest`:

- `module_id`: unique stable id (e.g., `core`, `clinical`)
- `kind`: `core` or `industry`
- `dependencies`: other module ids required first
- `graphql`: types + query/mutation/subscription mixins
- `rest_routers`: FastAPI routers
- `register_events`: optional event hook registration

This contract lets modules plug into the runtime without directly changing app boot logic.

## Composition Flow

At startup:

1. Build default registry (`core`, `clinical`, `pharma`, `environment`, `industrial`)
2. Resolve modules in dependency order
3. Compose:
- GraphQL schema (`query`, `mutation`, `subscription`, `types`)
- REST router inclusion
- event listener registration

## Tenant Module Data Model

Tenant records in platform schema now include:

- `primary_industry` (`VARCHAR(32)`)
- `enabled_modules` (`JSONB`)
- `module_state` (`JSONB`)

Backfill defaults for existing tenants:

- `primary_industry = 'clinical'`
- `enabled_modules = ['core','clinical']`
- `module_state = {}`

## Provisioning, Migration, and Seeding

### Provisioning

`tenant provision` now accepts industry/module profile inputs and persists them.

Provisioning flow:

1. create platform tenant row (`provisioning`)
2. create tenant schema
3. run tenant migrations
4. seed `core`
5. seed primary industry module
6. mark tenant `active` or `failed`

### Migration

`tenant migrate` supports module intent validation (`--module`) and still executes schema migration safely for the tenant.

### Seeding

Seed flows are split:

- `seed core`
- `seed industry --module <id>`
- `seed all` orchestrates tenant-enabled modules

## Runtime Module Guards

Runtime guards prevent disabled module access for a tenant.

### REST guard

- Applied at router inclusion time for non-core modules.
- Implemented via `module_dependency(module_id)`.
- Returns `403` when module is not enabled for tenant.

### GraphQL guard

- Middleware inspects GraphQL POST operation root fields.
- Maps root field -> module id.
- Returns `403` with GraphQL-style error for disabled module field access.

### Guard scope

Currently enforced for HTTP REST + GraphQL POST operations.
WebSocket subscription message-level guard can be extended similarly in the custom GraphQL WS router handlers.

## Platform API and CLI Surface

### Platform API

- `POST /api/v1/platform/tenants` supports module profile
- `GET /api/v1/platform/tenants/{slug}/modules`
- `POST /api/v1/platform/tenants/{slug}/modules/{module_id}:enable`
- `POST /api/v1/platform/tenants/{slug}/modules/{module_id}:disable`

### CLI

- `tenant provision --industry ... --enable-module ...`
- `tenant modules --slug ...`
- `tenant module-enable --slug ... --module ...`
- `tenant module-disable --slug ... --module ...`
- `seed core --tenant-slug ...`
- `seed industry --module ... --tenant-slug ...`
- `seed all --tenant-slug ...`

## How to Add a New Industry Module

1. Add module id to `beak/modules/platform/module_catalog.py`.
2. Add manifest in `beak/modules/default_registry.py` with:
- dependencies
- GraphQL mixins/types
- REST routers
- event registration hook (if needed)
3. Add migrations and seed logic for the module.
4. Add/adjust module guard mappings if new root GraphQL fields are introduced.
5. Add platform docs and CLI examples.

## Folder Migration Status (`apps/*` -> `modules/*`)

Completed slices:

- platform domain moved from `beak/modules/core/platform/*` to `beak/modules/platform/*`
- analysis domain moved from `beak/modules/core/analysis/*` to `beak/modules/core/analysis/*`
- billing domain moved from `beak/modules/core/billing/*` to `beak/modules/core/billing/*`
- client domain moved from `beak/modules/core/client/*` to `beak/modules/core/client/*`
- instrument domain moved from `beak/modules/core/instrument/*` to `beak/modules/core/instrument/*`
- inventory domain moved from `beak/modules/core/inventory/*` to `beak/modules/core/inventory/*`
- storage domain moved from `beak/modules/core/storage/*` to `beak/modules/core/storage/*`
- shipment domain moved from `beak/modules/core/shipment/*` to `beak/modules/core/shipment/*`
- worksheet domain moved from `beak/modules/core/worksheet/*` to `beak/modules/core/worksheet/*`
- reflex domain moved from `beak/modules/core/reflex/*` to `beak/modules/core/reflex/*`
- messaging domain moved from `beak/modules/core/messaging/*` to `beak/modules/core/messaging/*`
- notification domain moved from `beak/modules/core/notification/*` to `beak/modules/core/notification/*`
- noticeboard domain moved from `beak/modules/core/noticeboard/*` to `beak/modules/core/noticeboard/*`
- document domain moved from `beak/modules/core/document/*` to `beak/modules/core/document/*`
- commune domain moved from `beak/modules/core/commune/*` to `beak/modules/core/commune/*`
- grind domain moved from `beak/modules/core/grind/*` to `beak/modules/core/grind/*`
- analytics domain moved from `beak/modules/core/analytics/*` to `beak/modules/core/analytics/*`
- auditlog domain moved from `beak/modules/core/auditlog/*` to `beak/modules/core/auditlog/*`
- idsequencer domain moved from `beak/modules/core/idsequencer/*` to `beak/modules/core/idsequencer/*`
- job domain moved from `beak/modules/core/job/*` to `beak/modules/core/job/*`
- impress domain moved from `beak/modules/core/impress/*` to `beak/modules/core/impress/*`
- iol domain moved from `beak/modules/core/iol/*` to `beak/modules/core/iol/*`
- abstract foundation moved from `beak/modules/core/abstract/*` to `beak/modules/core/abstract/*`
- common foundation moved from `beak/modules/core/common/*` to `beak/modules/core/common/*`
- guard foundation moved from `beak/modules/core/guard/*` to `beak/modules/core/guard/*`
- appactivity foundation moved from `beak/modules/core/app/*` to `beak/modules/core/app/*`
- exceptions module moved from `beak/modules/core/exceptions.py` to `beak/modules/core/exceptions.py`
- event bootstrap moved to `beak/modules/events.py`
- setup domain now at `beak/modules/core/setup/*`
- tenant identity domain now at `beak/modules/core/identity/*`
- clinical patient domain now at `beak/modules/clinical/patient/*`
- clinical microbiology domain now at `beak/modules/clinical/microbiology/*`
- runtime imports switched to module-first paths in API, services, seeds, CLI, and DB model registration
- legacy `beak/apps/*` shims removed after full import cutover validation

Recommended migration pattern for other domains:

1. Move implementation package to `beak/modules/<module-name>/<domain>/`.
2. Update internal imports to module-first paths.
3. Switch runtime entrypoint imports to new paths.
4. Use temporary compatibility shims only during active migration.
5. Remove compatibility shims after imports are migrated and verified.

## Operational Guidance

- Use platform CLI/API only for tenant and module lifecycle operations.
- Keep `core` as the broad stable foundation; avoid duplicating core behaviors in industry modules.
- Treat `enabled_modules` as the source of truth for runtime feature access.
- Validate module profile before provisioning in automation pipelines.

## Always Required (Invariants)

- Every tenant must always have `core` enabled.
- Every tenant must always have exactly one `primary_industry`.
- The `primary_industry` must always be included in that tenant's `enabled_modules`.
- Module dependency rules must always resolve before runtime composition (dependency-first order).
- Platform lifecycle operations (provision, migrate, module enable/disable) must be performed through platform services/CLI/API, not ad-hoc SQL.
- Runtime access checks must always enforce `enabled_modules` for REST and GraphQL operations.
- Tenant-aware provisioning must always run in this order:
  1. create tenant record (`provisioning`)
  2. create tenant schema
  3. run tenant migrations
  4. seed `core`
  5. seed enabled industry modules
  6. mark `active` or `failed`
- Failed provisioning must never be marked `active` without successful migration/seed completion.
- New module introduction must always include:
  1. registry manifest
  2. module catalog update
  3. migration + seed path
  4. guard mapping (if new GraphQL/REST surface is added)
- Runtime and docs must remain module-first (`beak/modules/*`), with no new `beak/apps/*` imports introduced.

## Known Constraints and Next Improvements

- GraphQL guard currently targets root fields in POST operations; nested dynamic resolution can be expanded later if needed.
- WebSocket subscription module enforcement is not yet added at per-operation level.
- `module_state` is present for future per-module migration/seed version tracking and can be expanded for richer observability.

## Related Documents

- [TenantProvisioningAndCLI.md](TenantProvisioningAndCLI.md)
- [Introduction.md](Introduction.md)
- [README.md](../README.md)
