from typing import Optional, Text

import strawberry  # noqa


@strawberry.type
class AuditLogType:
    uid: str
    user_id: str | None
    target_type: str | None
    target_id: str | None
    action: int | None
    state_before: Optional[Text]
    state_after: Optional[Text]
