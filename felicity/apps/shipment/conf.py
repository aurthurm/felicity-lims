"""Shipment Configs
This file is part of Felicity LIMS Software
"""



class ShipmentStates(object):
    """Shipment Workflow States
    empty -> preperation -> ready -> shipped
    Other:
    rejected, recalled, received
    """

    DUE = "due" # shipment recived from external labs
    EMPTY = "empty"  # shipment without samples
    PREPERATION = "preperation"  # shipment containing at least a single sample
    READY = "ready" # shipment finalised
    AWAITING = "awaiting" # shipment queued for dispatch
    FAILED = "failed" # shipment queued for dispatch, has at least a one dispatch trial 
    SHIPPED = "shipped" # shipment that was successfully send and acknowledged in the other system
    REJECTED = "rejected"  # shipment rejected by the receiving lab
    RECEIVED = "received"  # shipment receved by the receiving lab
    CANCELLED = "cancelled"  #


shipment_states = ShipmentStates()
