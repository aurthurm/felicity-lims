# Interoperability

## Overview

Beak LIMS supports industry-standard protocols for instrument integration and health information exchange.

## Instrument Integration

### Protocols

- **ASTM E1381**: Laboratory instrument communication
- **HL7 v2.5+**: Health Level Seven messaging
- **Async TCP/IP**: Non-blocking I/O for 100+ concurrent instrument connections

### Instrument Interface Layer (IOL)

- Located in `beak/modules/core/iol/`
- Driver mapping and analyzer interfaces
- Message size limits (10 MB), timeouts (60s), checksum validation

### FHIR Support

- Extended FHIR resources for laboratory data
- See `beak/api/gql/integration_guide.md` for integration details

## Health Information Exchange

- **HL7**: Bi-directional instrument communication
- **FHIR**: RESTful API for external system integration
- **ASTM**: Laboratory-specific message formats

## References

- [integration_guide.md](../beak/api/gql/integration_guide.md)
- [DRIVER_MAPPING.md](../beak/modules/core/iol/analyzer/DRIVER_MAPPING.md)
