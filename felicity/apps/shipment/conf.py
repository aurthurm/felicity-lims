"""Shipment Configs
This file is part of Felicity LIMS Software
"""



class ShipmentStates(object):
    """Shipment Workflow States
    empty -> preperation -> ready -> shipped
    Other:
    rejected, recalled, received
    """

    EMPTY = "empty"  # shipment without samples
    PREPERATION = "preperation"  # shipment containing at least a single sample
    READY = "ready" # shipment finalised
    AWAITING = "awaiting" # shipment queued for dispatch
    SHIPPED = "shipped" # shipment that was successfully send and acknowledged in the other system
    REJECTED = "rejected"  # shipment rejected by the receiving lab
    RECEIVED = "received"  # shipment receved by the receiving lab


shipment_states = ShipmentStates()
