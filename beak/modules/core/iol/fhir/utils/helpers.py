from datetime import datetime

from beak.core.dtz import format_datetime


def safe_fhir_datetime(value: datetime | str | None) -> str:
    if not value:
        return ""
    return format_datetime(value, with_time=True)
