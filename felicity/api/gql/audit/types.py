from typing import Optional, Text

import strawberry  # noqa


@strawberry.type
class AuditLogType:
    uid: str
    user_id: str | None = None
    target_type: str | None = None
    target_id: str | None = None
    action: int | None = None
    state_before: Optional[Text] = None
    state_after: Optional[Text] = None
