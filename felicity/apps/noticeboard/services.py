from felicity.apps.abstract.service import BaseService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.noticeboard.entities import Notice
from felicity.apps.noticeboard.repository import NoticeRepository
from felicity.apps.noticeboard.schemas import NoticeCreate, NoticeUpdate
from felicity.apps.setup.entities.setup import Department
from felicity.apps.setup.services import DepartmentService
from felicity.apps.user.entities import Group, User
from felicity.apps.user.services import GroupService, UserService


class NoticeService(BaseService[Notice, NoticeCreate, NoticeUpdate]):
    def __init__(self):
        self.group_service = GroupService()
        self.department_service = DepartmentService()
        self.user_service = UserService()
        super().__init__(NoticeRepository)

    async def filter(
            self,
            group_uid: str | None,
            department_uid: str | None,
    ) -> list[Notice]:
        filters = {}

        if group_uid:
            filters["groups__uid__in"] = [group_uid]

        if department_uid:
            filters["departments__uid__in"] = [department_uid]

        return await super().filter(filters, ["-created_at"])

    async def view(self, uid: str, viewer_uid: str) -> Notice:
        notice = await self.get(uid=uid)
        _viewer = await self.user_service.get(uid=viewer_uid)
        return await self.add_viewer(notice, _viewer)

    async def delete(self, uid: str):
        await super().delete(uid)

    async def reset_views(self, uid: str) -> Notice:
        notice = await self.get(uid=uid)
        notice.viewers.clear()
        return await super().update(uid, **marshaller(notice))

    async def remove_viewer(self, uid: str, user: User) -> Notice:
        notice = await self.get(uid=uid)
        notice.viewers.remove(user)
        return await super().update(uid, **marshaller(notice))

    async def add_viewer(self, uid: str, user: User) -> Notice:
        notice = await self.get(uid=uid)
        if user not in notice.viewers:
            notice.viewers.append(user)
            return await super().update(uid, **marshaller(notice))
        return notice

    async def reset_departments(self, uid: str) -> Notice:
        notice = await self.get(uid=uid)
        notice.departments.clear()
        return await super().update(uid, **marshaller(notice))

    async def remove_department(self, uid: str, department: Department) -> Notice:
        notice = await self.get(uid=uid)
        notice.departments.remove(department)
        return await super().update(uid, **marshaller(notice))

    async def add_department(self, uid: str, department: Department) -> Notice:
        notice = await self.get(uid=uid)
        if department not in notice.departments:
            notice.departments.append(department)
            return await super().update(uid, **marshaller(notice))
        return notice

    async def reset_groups(self, uid: str) -> Notice:
        notice = await self.get(uid=uid)
        notice.groups.clear()
        return await super().update(uid, **marshaller(notice))

    async def remove_group(self, uid: str, group: Group) -> Notice:
        notice = await self.get(uid=uid)
        notice.groups.remove(group)
        return await super().update(uid, **marshaller(notice))

    async def add_group(self, uid: str, group: Group) -> Notice:
        notice = await self.get(uid=uid)
        if group not in notice.groups:
            notice.groups.append(group)
            return await super().update(uid, **marshaller(notice))
        return notice
