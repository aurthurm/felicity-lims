# Platform Schema Standardization

## Goal
Unify platform schema ownership so platform table structure is defined in code (ORM entities), not duplicated ad-hoc SQL blocks.

## What Changed
1. Shared abstract layer introduced under `beak/modules/shared/abstract/*`.
2. `beak/modules/core/abstract/*` now acts as compatibility wrappers to the shared layer.
3. Platform entities are now first-class SQLAlchemy models:
- `beak/modules/platform/models.py`
- `beak/modules/platform/billing/models.py`
4. Platform bootstrap logic moved to a single module:
- `beak/migrations/platform_bootstrap.py`
5. `beak/migrations/env.py` now delegates bootstrap to `platform_bootstrap.py`.

## Migration Flow
When `TENANT_SCHEMA` is not set:
- Alembic bootstraps platform schema through `bootstrap_platform_schema`.
- Bootstrap runs the platform-only revision stream from:
  - `beak/migrations/platform_versions/`
  - via `beak/migrations/platform_bootstrap.py`
- Applied platform revisions are tracked in:
  - `"platform".alembic_version_platform`

When `TENANT_SCHEMA` is set:
- Tenant schema migration flow remains revision-driven under tenant search_path.
- Tenant revisions continue to run from:
  - `beak/migrations/versions/`

## Why This Fixes the Previous Drift
Before this change, platform table DDL lived in multiple places and repositories often relied on manual SQL-first table definitions.
Now:
- Platform table definitions are centralized in ORM entities.
- Bootstrap references metadata from those entities.
- `env.py` no longer carries a second copy of platform DDL.

## Notes
- Existing repositories may still use SQL statements for query behavior, but table shape ownership is now model-driven.
- The `billing_plan_limit` reserved-keyword issue is resolved by using `limit_window` (not `window`).

## Platform Audit FK Pitfall (Resolved)
Platform tables must not inherit `BaseEntity` because `BaseEntity` includes audit fields with foreign keys to tenant `"user"`:

- `created_by_uid -> user.uid`
- `updated_by_uid -> user.uid`

That causes bootstrap failures in the platform schema (`relation "user" does not exist`).

Platform models now inherit shared `Base` instead:

- `beak/modules/platform/models.py`
- `beak/modules/platform/billing/models.py`

## Will New Platform Changes "Just Work"?
Short answer: partially.

- New platform revision added under `beak/migrations/platform_versions/`: yes, it runs automatically when `TENANT_SCHEMA` is not set.
- Additive table/index creation in a platform revision: yes.
- Changed existing column type/nullability/default, dropped/renamed columns, dropped constraints/indexes: no, `create_all` will not mutate existing structures.

For non-additive or structural platform changes, add a platform revision module under:

- `beak/migrations/platform_versions/`

and execute:

```bash
alembic upgrade head
```

Implementation checklist for new platform tables:

1. Add/modify model in `beak/modules/platform/models.py` or `beak/modules/platform/billing/models.py`.
2. Ensure model is imported in `beak/database/base.py` so metadata sees it.
3. Add a platform revision in `beak/migrations/platform_versions/` for explicit schema evolution (especially `ALTER`/`DROP`/rename/data migration).
