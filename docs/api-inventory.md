# API Inventory (Refactor Baseline)

This inventory reflects current ownership in this repository (`beak/modules/...`), not `beak/apps/...`.

## REST Surface

Current API root: `/api/v1`

### Core module-owned (migrated)
- `/jobs/*` -> `beak/modules/core/api/rest/jobs.py`
- `/setup/*` -> `beak/modules/core/api/rest/setup.py`
- `/reports/*` -> `beak/modules/core/api/rest/reports.py`

### Composition-level system REST (outer API)
- `/health/*` -> `beak/api/rest/system.py`
- `/version/*` -> `beak/api/rest/system.py`

### Platform module-owned (migrated)
- `/platform/*` -> `beak/modules/platform/api/rest.py`

### Clinical module-owned (migrated)
- `/fhir/*` -> `beak/modules/clinical/api/rest/fhir_r4.py`

### Legacy REST adapters
- Removed.
- `beak/api/rest/api_v1/` now only contains composition bootstrap (`__init__.py`).

## GraphQL Surface

Current endpoint: `/beak-gql`

### Module-owned (migrated)
- `PlatformMutations` -> `beak/modules/platform/api/gql/mutations.py`
- `AuditLogQuery` + `audit_types` -> `beak/modules/core/api/gql/audit/*`
- `AnalysisQuery`, `AnalysisMutations`, `analysis_types` -> `beak/modules/core/api/gql/analysis/*`
- `AnalyticsQuery`, `analytics_types` -> `beak/modules/core/api/gql/analytics/*`
- `ClientQuery`, `ClientMutations`, `client_types` -> `beak/modules/core/api/gql/client/*`
- `CommuneQuery`, `CommuneMutations`, `commune_types` -> `beak/modules/core/api/gql/commune/*`
- `DocumentQuery`, `DocumentMutations`, `document_types` -> `beak/modules/core/api/gql/document/*`
- `GrindQuery`, `GrindMutations`, `grind_types` -> `beak/modules/core/api/gql/grind/*`
- `ReportImpressQuery`, `impress_types` -> `beak/modules/core/api/gql/impress/*`
- `InstrumentQuery`, `InstrumentMutations`, `instrument_types` -> `beak/modules/core/api/gql/instrument/*`
- `InventoryQuery`, `InventoryMutations`, `inventory_types` -> `beak/modules/core/api/gql/inventory/*`
- `MessageQuery`, `MessageMutations`, `messaging_types` -> `beak/modules/core/api/gql/messaging/*`
- `NoticeQuery`, `NoticeMutations`, `noticeboard_types` -> `beak/modules/core/api/gql/noticeboard/*`
- `StreamNotificationQuery`, `StreamSubscription`, `notification_types` -> `beak/modules/core/api/gql/notification/*`
- `ReflexRuleQuery`, `ReflexRuleMutations`, `reflex_types` -> `beak/modules/core/api/gql/reflex/*`
- `SetupQuery`, `SetupMutations`, `setup_types` -> `beak/modules/core/api/gql/setup/*`
- `ShipmentQuery`, `ShipmentMutations`, `shipment_types` -> `beak/modules/core/api/gql/shipment/*`
- `BillingQuery`, `BillingMutations`, `billing_types` -> `beak/modules/core/api/gql/billing/*`
- `StorageQuery`, `StorageMutations`, `storage_types` -> `beak/modules/core/api/gql/storage/*`
- `UserQuery`, `UserMutations`, `user_types` -> `beak/modules/core/api/gql/user/*`
- `WorkSheetQuery`, `WorkSheetMutations`, `worksheet_types` -> `beak/modules/core/api/gql/worksheet/*`
- `PatientQuery`, `PatientMutations`, `patient_types` -> `beak/modules/clinical/api/gql/patient/*`
- `MicrobiologyQuery`, `MicrobiologyMutations`, `microbiology_types` -> `beak/modules/clinical/api/gql/multiplex/microbiology/*`
- `IOLMutations`, `iol_types` -> `beak/modules/clinical/api/gql/iol/*`

### Still legacy-owned (by design)
- GraphQL composition utilities remain under `beak/api/gql/*` by design:
  - `beak/api/gql/registry.py`
  - `beak/api/gql/schema.py`
  - `beak/api/gql/schema.graphql`
  - `beak/api/gql/integration_guide.md`
- Shared GraphQL primitives were moved to:
  - `beak/modules/shared/api/gql/auth.py`
  - `beak/modules/shared/api/gql/permissions.py`
  - `beak/modules/shared/api/gql/decorators.py`
  - `beak/modules/shared/api/gql/types/*`

### Legacy GraphQL adapters
- Removed.
- GraphQL feature modules now live only in `beak/modules/core/api/gql/*`, `beak/modules/clinical/api/gql/*`, and `beak/modules/platform/api/gql/*`.

## Composition Layer

- REST composition:
  - `beak/api/rest/registry.py`
  - `beak/api/rest/api_v1/__init__.py` (uses registry composer)
- GraphQL composition:
  - `beak/api/gql/registry.py`
  - `beak/api/gql/schema.py` (uses registry collector)

## Next Migration Targets

Remaining work to complete the refactor:
1. Add contract verification snapshots (REST route map + GraphQL schema diff) to CI.
2. Add import-boundary lint/checks to prevent new feature code in legacy `beak/api/gql/<module>` paths.
3. Keep `beak/api/gql` limited to composition and shared primitives only.
