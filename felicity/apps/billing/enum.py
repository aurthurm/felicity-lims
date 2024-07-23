from enum import StrEnum, auto

class DiscountType(StrEnum):
    SALE = auto()
    VOUCHER = auto()


class DiscountValueType(StrEnum):
    PERCENTATE = auto()
    AMOUNT = auto()


class TransactionKind(StrEnum):
    CASH = auto()
    MEDICAL_AID = auto()
    E_PAYMENT = auto()
    AUTO_DISCOUNT = auto()
