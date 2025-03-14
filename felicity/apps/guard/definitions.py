import logging
from enum import StrEnum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FGroup(StrEnum):  # (KEYWORD, NAME)
    ADMINISTRATOR = "ADMINISTRATOR"
    LAB_MANAGER = "LAB_MANAGER"
    SCIENTIST = "SCIENTIST"
    TECHNOLOGIST = "TECHNOLOGIST"
    LAB_HAND = "LABORATORY HAND"
    GUEST = "GUEST"
    STORES = "STORES"
    ACCOUNTING = "ACCOUNTING"


class FObject(StrEnum):
    ANALYTICS = "ANALYTICS"
    CLIENT = "CLIENT"
    PATIENT = "PATIENT"
    SAMPLE = "SAMPLE"
    RESULT = "RESULT"
    WORKSHEET = "WORKSHEET"
    PRODUCT = "PRODUCT"
    SHIPMENT = "SHIPMENT"
    STORAGE = "STORAGE"
    NOTICE = "NOTICE"
    BILLING = "BILLING"
    SCHEMES = "SCHEMES"
    DOCUMENT = "DOCUMENT"


class FAction(StrEnum):
    CREATE = "CREATE"
    READ = "READ"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    SUBMIT = "SUBMIT"
    VERIFY = "VERIFY"
    CANCEL = "CANCEL"
    INVALIDATE = "INVALIDATE"
    REJECT = "REJECT"
    RETEST = "RETEST"
    ORDER = "ORDER"
    ISSUE = "ISSUE"


PERMISSION_GROUPS = [
    FGroup.ADMINISTRATOR,
    FGroup.LAB_MANAGER,
    FGroup.SCIENTIST,
    FGroup.TECHNOLOGIST,
    FGroup.LAB_HAND,
    FGroup.GUEST,
    FGroup.STORES,
    FGroup.ACCOUNTING,
]
