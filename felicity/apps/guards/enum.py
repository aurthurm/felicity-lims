from enum import IntEnum, StrEnum, auto


class Role(StrEnum):
    ADMINISTRATOR = auto()
    LAB_MANAGER = "LAB MANAGER"
    SCIENTIST = auto()
    TECHNOLOGIST = auto()
    LAB_HAND = "LABORATORY HAND"
    GUEST = auto()
    STORES = auto()
    ACCOUNTING = auto()


class Resource(StrEnum):
    ANALYTICS = auto()
    CLIENT = auto()
    PATIENT = auto()
    SAMPLE = auto()
    RESULT = auto()
    WORKSHEET = auto()
    PRODUCT = auto()
    SHIPMENT = auto()
    STORAGE = auto()
    NOTICE = auto()
    BILLING = auto()


class Access(StrEnum):
    CREATE = auto()
    READ = auto()
    UPDATE = auto()
    DELETE = auto()
    SUBMIT = auto()
    VERIFY = auto()
    CANCEL = auto()
    INVALIDATE = auto()
    REJECT = auto()
    RETEST = auto()
    ORDER = auto()
    ISSUE = auto()
