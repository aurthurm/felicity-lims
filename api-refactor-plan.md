# API Refactor Plan: Modular REST + GraphQL Composition

## Objective
Refactor API organization so each domain module owns its REST and GraphQL surfaces, while keeping a thin global composition layer for app bootstrapping and cross-cutting concerns.

Success criteria:
- API code is discoverable by feature under `beak/modules/<module>/api/`.
- REST and GraphQL contracts remain backward compatible during migration.
- `beak/api/` remains only as composition/bootstrap (not feature implementation).
- CI/lint/tests pass at every phase.

## Non-Goals
- No API version bump in this refactor.
- No breaking path changes for existing REST endpoints.
- No GraphQL schema field removals/renames unless explicitly planned in a separate deprecation cycle.

## Target Architecture

### Module-local API ownership
Each module owns API artifacts close to application logic:

```text
beak/modules/<module>/
  api/
    __init__.py
    rest.py                # APIRouter for module routes
    gql/
      __init__.py
      query.py             # module query fields
      mutations.py         # module mutation fields
      types.py             # module GQL types (if needed)
      subscription.py      # optional
    contracts/
      rest/                # optional DTOs/schemas for REST
      gql/                 # optional GraphQL inputs/responses
```

### Thin global composition layer

```text
beak/api/
  rest/
    registry.py            # imports module routers and mounts them
    app.py                 # creates FastAPI app, middleware, auth deps, exception handlers
  gql/
    registry.py            # imports module GraphQL query/mutation/subscription contributors
    schema.py              # final schema assembly only
```

Global layer owns:
- app startup/shutdown wiring
- auth middleware/dependencies
- exception normalization
- logging/tracing/metrics
- API docs/OpenAPI config
- GraphQL schema assembly

Module layer owns:
- route handlers/resolvers
- feature-specific permissions and validation
- feature DTOs/inputs/types
- mapping domain errors to API errors (via shared helpers)

## Refactor Principles
1. Module first: new API work goes only under `beak/modules/<module>/api`.
2. Strangler migration: move one module at a time; leave compatibility adapters.
3. No circular imports: registry imports modules; modules never import registry.
4. Shared concerns extracted once: dependencies/helpers live in shared API support package, not copied per module.
5. Contract safety: snapshot REST routes + GraphQL schema diff before/after each phase.

## Concrete Migration Phases

## Phase 0: Baseline and inventory (1-2 days)
Tasks:
- Inventory current REST endpoints in `beak/api/rest/api_v1/endpoints/`.
- Inventory GraphQL modules under `beak/api/gql/` and map each to owning domain module.
- Generate current GraphQL schema snapshot (`schema.graphql`) and store as baseline artifact.
- Record route map (method + path + auth requirement).

Deliverables:
- `docs/api-inventory.md` with ownership mapping.
- Baseline schema snapshot committed.
- Baseline route snapshot committed.

Exit criteria:
- Every endpoint/resolver has a target module owner.

## Phase 1: Create module API skeleton + registries (1 day)
Tasks:
- Add `api/` packages in top 3-5 highest-traffic modules first.
- Implement `beak/api/rest/registry.py` to compose routers from module exports.
- Implement `beak/api/gql/registry.py` to compose query/mutation/subscription contributors.
- Keep existing `beak/api/rest/api_v1/endpoints/*` and `beak/api/gql/*` as source of truth for now.

Deliverables:
- New registries wired into startup.
- No behavior change.

Exit criteria:
- App boots with registries and identical route/schema output.

## Phase 2: REST migration module-by-module (3-5 days)
Execution pattern per module:
1. Create `beak/modules/<module>/api/rest.py`.
2. Move endpoint handlers from `beak/api/rest/api_v1/endpoints/*.py` into module.
3. Keep temporary shim in old location importing from new module.
4. Register module router in `beak/api/rest/registry.py`.
5. Run tests and route snapshot diff.

Priority order (proposed):
1. `platform`, `health`, `version` (low risk)
2. `setup`, `jobs`
3. `reports`
4. `fhir` (last among REST due to integration sensitivity)

Deliverables:
- Module-local REST routers for migrated modules.
- Old endpoint files reduced to compatibility shims or removed once fully migrated.

Exit criteria:
- No REST feature code remains in `beak/api/rest/api_v1/endpoints/` except bootstrap/shims pending deletion.

## Phase 3: GraphQL migration module-by-module (5-8 days)
Execution pattern per module:
1. Create `beak/modules/<module>/api/gql/` package.
2. Move `query.py`, `mutations.py`, `types.py` from `beak/api/gql/<module>/`.
3. Export module GraphQL contributors via module API package.
4. Update `beak/api/gql/registry.py` to compose from module exports.
5. Leave temporary adapter in old `beak/api/gql/<module>/` imports.
6. Run schema diff and resolver tests.

Priority order (proposed):
1. `platform`, `audit`, `auth`, `client` (simple)
2. `setup`, `billing`, `storage`, `inventory`
3. `analysis`, `worksheet`, `patient`
4. `multiplex/microbiology`, `iol`, `document`, `analytics` (complex)

Deliverables:
- Module-local GraphQL implementations.
- Stable `beak/api/gql/schema.py` as composition only.

Exit criteria:
- `beak/api/gql/*` contains only composition, shared utilities, and temporary adapters.

## Phase 4: Shared concerns consolidation (2-3 days)
Tasks:
- Move common auth/dependency helpers from scattered locations into:
  - `beak/api/shared/deps.py`
  - `beak/api/shared/errors.py`
  - `beak/api/shared/pagination.py`
  - `beak/api/shared/permissions.py`
- Replace duplicated module logic with shared helpers.
- Ensure no module imports another module's API internals.

Deliverables:
- Shared API support package.
- Reduced duplication and import coupling.

Exit criteria:
- Cross-cutting concerns centralized; feature logic remains module-local.

## Phase 5: Remove legacy adapters + enforce boundaries (1-2 days)
Tasks:
- Delete old shims in `beak/api/rest/api_v1/endpoints/` and `beak/api/gql/<module>/` once all consumers migrated.
- Add import boundary checks (lint/test) to prevent new feature logic in `beak/api/*` composition layer.
- Update contributor docs and templates.

Deliverables:
- Clean final tree.
- Guardrails preventing regression.

Exit criteria:
- No feature implementations live in global API composition paths.

## Testing and Safety Gates (Required per phase)

### Automated checks
- `bash ./beak/scripts/format.sh`
- `bash ./beak/scripts/lint.sh`
- `pnpm server:test`
- Any GraphQL codegen/schema validation used in CI

### Contract checks
- REST route snapshot comparison (method/path unchanged unless explicitly approved).
- GraphQL schema diff (no accidental field/type deletions).
- Auth behavior checks on representative endpoints/resolvers.

### Rollback strategy
- Keep shim imports until module migration is validated.
- Migrate in small PRs (1-2 modules each) for easy reverts.

## Concrete Ownership Matrix

Create and maintain `docs/api-ownership-matrix.md` with columns:
- surface (`REST` | `GraphQL`)
- contract path/field
- owner module
- status (`legacy`, `migrating`, `module-owned`, `verified`)
- tests covering contract

This matrix is the source of truth for migration progress and review.

## PR Strategy
- PR 1: inventory + registries + no-op wiring
- PR 2..N: module migrations in small batches
- Final PR: legacy deletion + guardrails

PR acceptance checklist:
- route/schema diffs attached
- tests/lint green
- no new feature logic under `beak/api/rest/api_v1/endpoints` or legacy `beak/api/gql/<module>`
- ownership matrix updated

## Suggested File Moves (Examples)

REST example:
- from `beak/api/rest/api_v1/endpoints/reports.py`
- to `beak/modules/core/api/rest/reports.py`

GraphQL example:
- from `beak/api/gql/inventory/query.py`
- to `beak/modules/core/api/gql/inventory/query.py`

GraphQL composition stays:
- `beak/api/gql/schema.py` (assemble only)

## Risks and Mitigations
- Risk: hidden import cycles during move.
  - Mitigation: strict module export points and registry-only wiring.
- Risk: accidental contract drift.
  - Mitigation: route/schema snapshots required in every migration PR.
- Risk: large-bang refactor stalls.
  - Mitigation: strangler pattern + small PR batches.

## Definition of Done
- All REST and GraphQL feature code resides in `beak/modules/<module>/api/`.
- `beak/api/` contains only composition/bootstrap/shared cross-cutting utilities.
- Route map and GraphQL schema remain backward compatible (or approved deltas documented).
- Boundary checks prevent regressions.
- Team docs updated for new module API conventions.
