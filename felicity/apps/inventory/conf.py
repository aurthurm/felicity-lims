"""Job Configs
This file is part of Felicity LIMS Software
"""


CATEGORIES = ["Consumables", "Reagents", "Durables"]

HAZARDS = [
    "Caution",
    "Toxic",
    "Very Toxic",
    "Corrosive",
    "Irritant",
    "Harmful",
    "Flammable",
    "Highly Flammable",
    "Biological",
    "Electrical",
    "Explosive",
    "Oxidising",
    "Environmental",
    "Reactive",
    "Physical",
    "Mechanical",
]

UNITS = [
    ("l", "liter"),
    ("ml", "milliliter"),
    ("kg", "kilogramme"),
    ("g", "gramme"),
    ("mg", "milligramme"),
    ("ea", "each"),
    ("pc", "piece"),
    ("t", "tonne"),
    ("in", "inch"),
    ("cm", "centimeter"),
    ("m", "meter"),
    ("g", "gallon"),
    ("tests", "tests"),
    ("kit", "kit"),
]

PACKAGES = [
    "box",
    "container",
    "bag",
    "plastic",
    "bottle",
    "bucket",
    "tray",
    "crate",
    "bin",
    "pouche",
    "envelope",
    "kit",
    "cardboard",
]


class Adjust:
    TRANSFER_IN = "transfer_in"
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
