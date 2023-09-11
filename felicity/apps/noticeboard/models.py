import logging

from sqlalchemy import Column, DateTime, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from apps import BaseAuditDBModel, DBModel
from apps.setup.models import Department
from apps.user.models import Group, User
from . import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
 Many to Many Link between Users and Notices
"""
notice_view: Table = Table(
    "notice_view",
    DBModel.metadata,
    Column("notice_uid", ForeignKey("notice.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Group and Notices
"""
group_notice: Table = Table(
    "group_notice",
    DBModel.metadata,
    Column("notice_uid", ForeignKey("notice.uid"), primary_key=True),
    Column("group_uid", ForeignKey("group.uid"), primary_key=True),
)

"""
 Many to Many Link between Department and Notices
"""
department_notice: Table = Table(
    "department_notice",
    DBModel.metadata,
    Column("notice_uid", ForeignKey("notice.uid"), primary_key=True),
    Column("department_uid", ForeignKey("department.uid"), primary_key=True),
)


class Notice(BaseAuditDBModel):
    """Notice"""

    __tablename__ = "notice"

    departments = relationship(
        "Department", secondary=department_notice, lazy="selectin"
    )
    groups = relationship("Group", secondary=group_notice, lazy="selectin")
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    viewers = relationship("User", secondary=notice_view, lazy="selectin")
    expiry: bool = Column(DateTime, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.NoticeCreate) -> schemas.Notice:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.NoticeUpdate) -> schemas.Notice:
        data = self._import(obj_in)
        return await super().update(**data)

    async def reset_views(self) -> schemas.Notice:
        self.viewers.clear()
        return await self.save()

    async def remove_viewer(self, user: User) -> schemas.Notice:
        self.viewers.remove(user)
        return await self.save()

    async def add_viewer(self, user: User) -> schemas.Notice:
        if user not in self.viewers:
            self.viewers.append(user)
            return await self.save()
        return self

    async def reset_departments(self) -> schemas.Notice:
        self.departments.clear()
        return await self.save()

    async def remove_department(self, department: Department) -> schemas.Notice:
        self.departments.remove(department)
        return await self.save()

    async def add_department(self, department: Department) -> schemas.Notice:
        if department not in self.departments:
            self.departments.append(department)
            return await self.save()
        return self

    async def reset_groups(self) -> schemas.Notice:
        self.groups.clear()
        return await self.save()

    async def remove_group(self, group: Group) -> schemas.Notice:
        self.groups.remove(group)
        return await self.save()

    async def add_group(self, group: Group) -> schemas.Notice:
        if group not in self.groups:
            self.groups.append(group)
            return await self.save()
        return self
