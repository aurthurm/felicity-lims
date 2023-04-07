from datetime import datetime
from typing import List, Optional

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.setup.schemas import Department
from felicity.apps.user.schemas import Group, User
from felicity.core.uid_gen import FelicityIDType


#
# Notice Schemas
#
class NoticeBase(BaseAuditModel):
    departments: Optional[List[Department]] = []
    groups: Optional[List[Group]] = []
    title: Optional[str] = ""
    body: Optional[str] = ""
    viewers: Optional[List[User]] = []
    expiry: Optional[datetime] = None


class Notice(NoticeBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


class NoticeCreate(NoticeBase):
    pass


class NoticeUpdate(NoticeBase):
    pass
