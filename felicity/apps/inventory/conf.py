"""Job Configs
This file is part of Felicity LIMS Software
"""


class Adjust:
    #  Adding
    PURCHASE = "purchase"
    PUSHED = "pushed"
    TRANSFER_IN = "transfer_in"
    # subtracting
    TRANSFER_OUT = "transfer_out"
    DAMAGED = "damaged"
    EXPIRED = "expired"
    THEFT = "theft"
    LOSS = "lost"


adjust = Adjust()


class OrderStates:
    PREPARATION = "preparation"
    SUBMITTED = "submitted"  # for approval
    PENDING = "pending"  # approved and pending issue
    PROCESSED = "processed"  # issued
    DECLINED = "declined"


order_states = OrderStates()
