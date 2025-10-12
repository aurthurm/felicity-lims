from enum import StrEnum, auto
import strawberry

class DiscountType(StrEnum):
    SALE = auto()
    VOUCHER = auto()


class DiscountValueType(StrEnum):
    PERCENTAGE = auto()
    AMOUNT = auto()


class TransactionKind(StrEnum):
    CASH = auto()
    MEDICAL_AID = auto()
    E_PAYMENT = auto()
    AUTO_DISCOUNT = auto()


# Stamp Categories
PAYMENT_STATUS: list[str] = [
    'unpaid',
    'partial',
    'paid',
]

@strawberry.enum
class PaymentStatus(StrEnum):
    UNPAID = 'unpaid'
    PARTIAL = 'partial'
    PAID = 'paid'