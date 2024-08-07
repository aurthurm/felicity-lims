from enum import StrEnum


class MinioBucket(StrEnum):
    DIAGNOSTIC_REPORT = "diagnostic-report"
    SHIPMENT_MANIFEST = "shipment-manifest"
    INVOICE = "invoice"
    SHIPMENT = "shipment"
