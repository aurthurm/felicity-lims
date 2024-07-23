from enum import StrEnum, auto


class AdjustType(StrEnum):
    #  Adding
    PURCHASE = auto()
    PUSHED = auto()
    TRANSFER_IN = auto()
    # subtracting
    ISSUE = auto()
    TRANSFER_OUT = auto()
    DAMAGED = auto()
    EXPIRED = auto()
    THEFT = auto()
    LOSS = auto()


class OrderState(StrEnum):
    PREPARATION = auto()
    SUBMITTED = auto()  # for approval
    PENDING = auto()  # approved and pending issue
    PROCESSED = auto()  # issued
    DECLINED = auto()

