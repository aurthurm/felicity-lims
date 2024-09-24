from dataclasses import field
from datetime import datetime
from typing import List, Optional

from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.setup.schemas import Department
from felicity.apps.user.schemas import Group, User


#
# Notice Schemas
#
class NoticeBase(BaseAuditModel):
    departments: Optional[List[Department]] = field(default_factory=list)
    groups: Optional[List[Group]] = field(default_factory=list)
    title: str | None = ""
    body: str | None = ""
    viewers: Optional[List[User]] = field(default_factory=list)
    expiry: datetime | None = None


class Notice(NoticeBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class NoticeCreate(NoticeBase):
    pass


class NoticeUpdate(NoticeBase):
    pass
