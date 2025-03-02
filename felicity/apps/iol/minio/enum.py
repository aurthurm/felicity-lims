from enum import StrEnum


class MinioBucket(StrEnum):
    GRIND_MEDIA = "grind-media"
    DIAGNOSTIC_REPORT = "diagnostic-report"
    SHIPMENT_MANIFEST = "shipment-manifest"
    INVOICE = "invoice"
    SHIPMENT = "shipment"
