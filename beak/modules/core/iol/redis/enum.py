from enum import StrEnum, auto


class TrackableObject(StrEnum):
    WORKSHEET = auto()
    SAMPLE = auto()
    RESULT = auto()
    SHIPMENT = auto()
