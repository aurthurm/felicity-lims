from typing import Optional, List
from datetime import datetime

from felicity.apps import BaseAuditModel
from felicity.apps.setup.schemas import Department
from felicity.apps.user.schemas import User, Group


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
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class NoticeCreate(NoticeBase):
    pass


class NoticeUpdate(NoticeBase):
    pass
