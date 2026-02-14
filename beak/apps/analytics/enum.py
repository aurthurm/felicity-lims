from enum import StrEnum, auto


class ReportTypes(StrEnum):
    LINE_LISTING = auto()


class ReportState(StrEnum):
    PENDING = auto()
    FAILED = auto()
    READY = auto()
