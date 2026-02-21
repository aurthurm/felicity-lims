# API Ownership Matrix

Status legend:
- `legacy`: implemented only in `beak/api/...`
- `module-owned`: module-owned and consumed directly by registry/manifest
- `verified`: module-owned + contract checks completed

| surface | contract path/field | owner module | status | tests/notes |
|---|---|---|---|---|
| REST | `/health/*` | `api-composition` | `module-owned` | implemented in `beak/api/rest/system.py` |
| REST | `/version/*` | `api-composition` | `module-owned` | implemented in `beak/api/rest/system.py` |
| REST | `/jobs/*` | `core` | `module-owned` | implemented in `beak/modules/core/api/rest/jobs.py` |
| REST | `/setup/*` | `core` | `module-owned` | implemented in `beak/modules/core/api/rest/setup.py` |
| REST | `/reports/*` | `core` | `module-owned` | implemented in `beak/modules/core/api/rest/reports.py` |
| REST | `/platform/*` | `platform` | `module-owned` | implemented in `beak/modules/platform/api/rest.py` |
| REST | `/fhir/*` | `clinical` | `module-owned` | implemented in `beak/modules/clinical/api/rest/fhir_r4.py` |
| GraphQL | `PlatformMutations` | `platform` | `module-owned` | implemented in `beak/modules/platform/api/gql/mutations.py` |
| GraphQL | `AuditLogQuery`, `audit_types` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/audit/*` |
| GraphQL | `Analysis*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/analysis/*` |
| GraphQL | `Analytics*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/analytics/*` |
| GraphQL | `Billing*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/billing/*` |
| GraphQL | `Client*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/client/*` |
| GraphQL | `Commune*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/commune/*` |
| GraphQL | `Document*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/document/*` |
| GraphQL | `Grind*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/grind/*` |
| GraphQL | `Impress*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/impress/*` |
| GraphQL | `Instrument*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/instrument/*` |
| GraphQL | `Inventory*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/inventory/*` |
| GraphQL | `Messaging*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/messaging/*` |
| GraphQL | `Noticeboard*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/noticeboard/*` |
| GraphQL | `Notification*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/notification/*` |
| GraphQL | `Reflex*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/reflex/*` |
| GraphQL | `Setup*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/setup/*` |
| GraphQL | `Shipment*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/shipment/*` |
| GraphQL | `Storage*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/storage/*` |
| GraphQL | `User*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/user/*` |
| GraphQL | `Worksheet*` | `core` | `module-owned` | implemented in `beak/modules/core/api/gql/worksheet/*` |
| GraphQL | `Patient*` | `clinical` | `module-owned` | implemented in `beak/modules/clinical/api/gql/patient/*` |
| GraphQL | `Microbiology*` | `clinical` | `module-owned` | implemented in `beak/modules/clinical/api/gql/multiplex/microbiology/*` |
| GraphQL | `IOL*` | `clinical` | `module-owned` | implemented in `beak/modules/clinical/api/gql/iol/*` |
