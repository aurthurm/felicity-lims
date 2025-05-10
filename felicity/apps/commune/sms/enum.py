from enum import StrEnum

import strawberry


@strawberry.enum
class SmsAudience(StrEnum):
    PATIENT = "patient"
    CLIENT = "client"


@strawberry.enum
class SmsStatus(StrEnum):
    SCHEDULED = "scheduled"
    SENT = "sent"
    FAILED = "failed"


@strawberry.enum
class SmsTrigger(StrEnum):
    NORMAL = "normal"  # Trigger when result is within normal range
    BELOW_NORMAL = "below_normal"  # Trigger when result is below normal but above warning
    ABOVE_NORMAL = "above_normal"  # Trigger when result is above normal but below warning
    BELOW_WARNING = "below_warning"  # Trigger when result is below warning threshold
    ABOVE_WARNING = "above_warning"  # Trigger when result is above warning threshold
    ANY_ABNORMAL = "any_abnormal"  # Trigger for any abnormal result (outside normal range)
    ANY_WARNING = "any_warning"  # Trigger for any warning result
    ANY_RESULT = "any_result"  # Trigger for any result regardless of value
    TEXTUAL_NORMAL = "textual_normal"  # For textual results matching normal_value
    TEXTUAL_WARNING = "textual_warning"  # For textual results matching warn_values
