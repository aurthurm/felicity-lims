from typing import Optional, Text

import strawberry  # noqa


@strawberry.type
class AuditLogType:
    uid: int
    user_id: Optional[int]
    target_type: Optional[str]
    target_id: Optional[int]
    action: Optional[int]
    state_before: Optional[Text]
    state_after: Optional[Text]
