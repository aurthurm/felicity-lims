import logging
from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.orm import relationship

from felicity.apps.user.models import User, Group
from felicity.apps.setup.models import Department
from . import schemas
from felicity.apps import BaseAuditDBModel, DBModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
 Many to Many Link between Users and Notification
"""
user_notification = Table('user_notification', DBModel.metadata,
                          Column("notification_uid", ForeignKey('notification.uid'), primary_key=True),
                          Column("user_uid", ForeignKey('user.uid'), primary_key=True)
                          )

"""
 Many to Many Link between Users and Notification
"""
notification_view = Table('notification_view', DBModel.metadata,
                          Column("notification_uid", ForeignKey('notification.uid'), primary_key=True),
                          Column("user_uid", ForeignKey('user.uid'), primary_key=True)
                          )

"""
 Many to Many Link between Group and Notification
"""
group_notification = Table('group_notification', DBModel.metadata,
                           Column("notification_uid", ForeignKey('notification.uid'), primary_key=True),
                           Column("group_uid", ForeignKey('group.uid'), primary_key=True)
                           )

"""
 Many to Many Link between Department and Notification
"""
department_notification = Table('department_notification', DBModel.metadata,
                                Column("notification_uid", ForeignKey('notification.uid'), primary_key=True),
                                Column("department_uid", ForeignKey('department.uid'), primary_key=True)
                                )


class Notification(BaseAuditDBModel):
    """Notification
    Custom messages about system status. These are more like activity streams only that they are very specific
    messages to notify users about something important
    examples:
        32 samples are due in 4 days, today, etc ....
        7 open worksheets have been lying idle for 3 weeks plus with 137 samples past their duw date.
        2 worksheets have no samples, consider deleting them to avoid cluttering your dashboard
        ...
    """
    # target audiences
    departments = relationship('Department', secondary=department_notification, lazy="selectin")
    groups = relationship('Group', secondary=group_notification, lazy="selectin")
    users = relationship('User', secondary=user_notification, lazy="selectin")
    #
    message = Column(String, nullable=False)
    #
    viewers = relationship('User', secondary=notification_view, lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.NotificationCreate) -> schemas.Notification:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.NotificationUpdate) -> schemas.Notification:
        data = self._import(obj_in)
        return await super().update(**data)

    async def reset_views(self) -> schemas.Notification:
        self.viewers.clear()
        return await self.save()

    async def remove_viewer(self, user: User) -> schemas.Notification:
        self.viewers.remove(user)
        return await self.save()

    async def add_viewer(self, user: User) -> schemas.Notification:
        if user not in self.viewers:
            self.viewers.append(user)
            return await self.save()
        return self

    async def reset_departments(self) -> schemas.Notification:
        self.departments.clear()
        return await self.save()

    async def remove_department(self, department: Department) -> schemas.Notification:
        self.departments.remove(department)
        return await self.save()

    async def add_department(self, department: Department) -> schemas.Notification:
        if department not in self.departments:
            self.departments.append(department)
            return await self.save()
        return self

    async def reset_groups(self) -> schemas.Notification:
        self.groups.clear()
        return await self.save()

    async def remove_group(self, group: Group) -> schemas.Notification:
        self.groups.remove(group)
        return await self.save()

    async def add_group(self, group: Group) -> schemas.Notification:
        if group not in self.groups:
            self.groups.append(group)
            return await self.save()
        return self

    async def reset_users(self) -> schemas.Notification:
        self.users.clear()
        return await self.save()

    async def remove_users(self, user: User) -> schemas.Notification:
        self.users.remove(user)
        return await self.save()

    async def add_user(self, user: Group) -> schemas.Notification:
        if user not in self.users:
            self.users.append(user)
            return await self.save()
        return self
