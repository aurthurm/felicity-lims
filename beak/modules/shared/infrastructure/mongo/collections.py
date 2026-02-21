"""MongoDB collection names."""

from enum import StrEnum


class MongoCollection(StrEnum):
    DIAGNOSTIC_REPORT = "diagnostic-report"
    INVOICE = "invoice"
    AUDIT_LOG = "audit-log"
    SHIPMENT = "shipment"
