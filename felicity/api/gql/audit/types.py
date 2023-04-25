from typing import Optional, Text

import strawberry  # noqa
from core.uid_gen import FelicityID


@strawberry.type
class AuditLogType:
    uid: FelicityID
    user_id: FelicityID | None
    target_type: str | None
    target_id: FelicityID | None
    action: int | None
    state_before: Optional[Text]
    state_after: Optional[Text]
