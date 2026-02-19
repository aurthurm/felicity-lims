# Patient Management

## Overview

Patient management in Beak LIMS handles patient registry, demographics, and HIPAA-compliant data handling with field-level encryption and searchable encryption indices.

## Architecture

- **Entities**: `beak/modules/clinical/patient/entities.py` — Patient, PatientIdentification
- **Repository**: `beak/modules/clinical/patient/repository.py` — CRUD, encrypted search
- **Services**: `beak/modules/clinical/patient/services.py` — PatientService, search logic
- **Search Indices**: `beak/modules/clinical/patient/search_indices.py` — PatientSearchIndex, PhoneSearchIndex, DateSearchIndex
- **Search Service**: `beak/modules/clinical/patient/search_service.py` — SearchableEncryptionService

## Encrypted Fields (PII)

- first_name, middle_name, last_name
- phone_mobile, phone_home
- email
- date_of_birth
- PatientIdentification.value

## Search Methods

| Method | Use Case | Performance |
|--------|----------|-------------|
| `search()` | General search by query string | Uses both encrypted and non-encrypted fields |
| `search_by_encrypted_fields()` | Memory-based encrypted search | O(n), suitable for &lt;1,000 patients |
| `search_by_encrypted_indices()` | Index-based search | O(log n), recommended for large datasets |
| `hipaa_compliant_search()` | Explicit field-based search | Combines encrypted + non-encrypted |
| `high_performance_search()` | Index-based with fuzzy matching | Best for production |

## Non-Encrypted Fields (Analytics)

- gender, age (derived)
- patient_id, client_patient_id (identifiers)

## GraphQL

Patient queries and mutations are exposed via `beak/api/gql/patient/`. See the schema for available operations.

## See Also

- [HIPAA_COMPLIANCE.md](HIPAA_COMPLIANCE.md)
- [HIPAA_MIGRATION_STRATEGY.md](HIPAA_MIGRATION_STRATEGY.md)
