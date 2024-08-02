from typing import Optional

import strawberry  # noqa

from felicity.api.gql.types import JSONScalar


@strawberry.type
class AuditLogType:
    uid: str
    user_uid: str | None = None
    target_type: str | None = None
    target_uid: str | None = None
    action: int | None = None
    state_before: Optional[JSONScalar] = None
    state_after: Optional[JSONScalar] = None
