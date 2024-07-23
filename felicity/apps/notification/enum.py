from enum import StrEnum, auto


class NotificationObject(StrEnum):
    """Action Object"""
    SAMPLE = auto()
    ANALYSIS_RESULT = auto()
    WORKSHEET = auto()
    REPORT = auto()


class NotificationChannel(StrEnum):
    ACTIVITIES = auto()
    NOTIFICATIONS = auto()
    JOBS = auto()

