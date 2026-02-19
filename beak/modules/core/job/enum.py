from enum import IntEnum, StrEnum, auto


class JobState(StrEnum):
    PENDING = auto()
    RUNNING = auto()
    FAILED = auto()
    FINISHED = auto()


class JobPriority(IntEnum):
    NORMAL = 0
    MEDIUM = 1
    HIGH = 2


class JobAction(StrEnum):
    WORKSHEET_ASSIGN = auto()
    WORKSHEET_MANUAL_ASSIGN = auto()
    WORKSHEET_UN_ASSIGN = auto()
    RESULT_APPROVE = auto()
    RESULT_SUBMIT = auto()
    GENERATE_REPORT = auto()
    IMPRESS_REPORT = auto()
    SHIPMENT_MANUAL_ASSIGN = auto()
    SHIPMENT_DISPATCH = auto()
    SHIPMENT_RECEIVE = auto()
    SHIPPED_REPORT = auto()
    DIAGNOSTIC_REPORT = auto()
    BILLING_INIT = auto()


class JobCategory(StrEnum):
    SHIPMENT = auto()
    WORKSHEET = auto()
    RESULT = auto()
    REPORT = auto()
    IMPRESS = auto()
    BILLING = auto()
