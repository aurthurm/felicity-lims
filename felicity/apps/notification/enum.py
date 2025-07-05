import enum

import strawberry


class NotificationObject(enum.StrEnum):
    """Action Object"""
    SAMPLE = "sample"
    ANALYSIS_RESULT = "result"
    WORKSHEET = "worksheet"
    REPORT = "report"
    SHIPMENT = "shipment"


@strawberry.enum
class NotificationObjectType(enum.Enum):
    SAMPLE = "sample"
    ANALYSIS_RESULT = "result"
    WORKSHEET = "worksheet"
    REPORT = "report"
    SHIPMENT = "shipment"


class NotificationChannel(enum.StrEnum):
    ACTIVITIES = "activities"
    NOTIFICATIONS = "notifications"
    PROCESSING = "processing"
    JOBS = "jobs"


@strawberry.enum
class NotificationChannelType(enum.Enum):
    ACTIVITIES = "activities"
    NOTIFICATIONS = "notifications"
    PROCESSING = "processing"
    JOBS = "jobs"
