from typing import Optional, Text

import strawberry  # noqa
from core.uid_gen import FelicityID


@strawberry.type
class AuditLogType:
    uid: FelicityID
    user_id: Optional[FelicityID]
    target_type: Optional[str]
    target_id: Optional[FelicityID]
    action: Optional[int]
    state_before: Optional[Text]
    state_after: Optional[Text]
