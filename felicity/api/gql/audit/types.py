from typing import Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import JSONScalar
from felicity.api.gql.user import UserType


@strawberry.type
class AuditLogType:
    uid: str
    user_uid: str | None = None
    target_type: str | None = None
    target_uid: str | None = None
    action: int | None = None
    state_before: Optional[JSONScalar] = None
    state_after: Optional[JSONScalar] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
