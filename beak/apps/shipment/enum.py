from enum import StrEnum, auto


class ShipmentState(StrEnum):
    """Shipment Workflow States
    empty -> preperation -> ready -> shipped
    Other:
    rejected, recalled, received
    """

    DUE = auto()  # shipment recived from external labs
    EMPTY = auto()  # shipment without samples
    PREPERATION = auto()  # shipment containing at least a single sample
    READY = auto()  # shipment finalised
    AWAITING = auto()  # shipment queued for dispatch
    FAILED = auto()  # shipment queued for dispatch, has at least a one dispatch trial
    SHIPPED = (
        auto()
    )  # shipment that was successfully send and acknowledged in the other system
    REJECTED = auto()  # shipment rejected by the receiving lab
    RECEIVED = auto()  # shipment receved by the receiving lab
    CANCELLED = auto()  #
