from datetime import datetime
from typing import List, Optional

from apps.common.schemas import BaseAuditModel
from apps.setup.schemas import Department
from apps.user.schemas import Group, User
from core.uid_gen import FelicityIDType


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
