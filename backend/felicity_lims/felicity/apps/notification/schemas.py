from typing import List, Optional

from felicity.apps import BaseAuditModel
from felicity.apps.setup.schemas import Department
from felicity.apps.user.schemas import Group, User


#
# Notification Schemas
#
class NotificationBase(BaseAuditModel):
    departments: Optional[List[Department]] = []
    groups: Optional[List[Group]] = []
    users: Optional[List[User]] = []
    message: Optional[str] = ""
    viewers: Optional[List[User]] = []


class Notification(NotificationBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(NotificationBase):
    pass
