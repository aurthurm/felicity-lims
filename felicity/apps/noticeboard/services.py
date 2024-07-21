from domain.exceptions import AlreadyExistsError
from domain.noticeboard.ports.repository import INoticeRepository
from domain.noticeboard.ports.service import INoticeService
from domain.noticeboard.schemas import Notice, NoticeCreate, NoticeUpdate
from domain.setup.ports.service import IDepartmentService
from domain.setup.schemas import Department
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.ports.service import IGroupService, IUserService
from domain.user.schemas import User, Group


class NoticeService(BaseService[Notice], INoticeService):
    def __init__(
            self,
            repository: INoticeRepository,
            group_service: IGroupService,
            department_service: IDepartmentService,
            user_service: IUserService,
    ):
        self.repository = repository
        self.group_service = group_service
        self.department_service = department_service
        self.user_service = user_service

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

        return await self.repository.filter(filters, ["-created_at"])

    async def create(
            self,
            title: str,
            body: str,
            expiry: str,
            groups: list[str] | None,
            departments: list[str] | None,
            user: User,
    ) -> Notice:
        payload = locals()

        exists = await self.get(title=title)
        if exists:
            raise AlreadyExistsError(
                "Notice title Duplication not Allowed Change the notice title"
            )

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        if groups:
            incoming["groups"] = []
            for g_uid in groups:
                _gr = await self.group_service.get(uid=g_uid)
                if _gr:
                    incoming["groups"].append(_gr)

        if departments:
            incoming["departments"] = []
            for dept_uid in departments:
                _gr = await self.department_service.get(uid=dept_uid)
                if _gr:
                    incoming["departments"].append(_gr)

        obj_in = NoticeCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
            self,
            uid: str,
            title: str,
            body: str,
            expiry: str,
            groups: list[str] | None,
            departments: list[str] | None,
            user: User,
    ) -> Notice:
        payload = locals()

        notice = await self.get(uid=uid)

        notice_data = notice.to_dict()
        for field in notice_data:
            if field in payload.__dict__:
                try:
                    setattr(notice, field, payload.__dict__[field])
                except Exception as e:
                    pass

        if groups:
            _groups = []
            for g_uid in groups:
                _gr = self.group_service.get(uid=g_uid)
                if _gr:
                    _groups.append(_gr)
            setattr(notice, "groups", _groups)

        if departments:
            _departments = []
            for dept_uid in departments:
                _dp = self.department_service.get(uid=dept_uid)
                if _dp:
                    _departments.append(_dp)
            setattr(notice, "departments", _departments)

        setattr(notice, "update_by_uid", user.uid)

        notice_in = NoticeUpdate(**marshal(notice))
        return await notice.update(notice, **marshal(notice_in))

    async def view(self, uid: str, viewer_uid: str) -> Notice:

        notice = await self.get(uid=uid)
        _viewer = await self.user_service.get(uid=viewer_uid)
        return await self.add_viewer(notice, _viewer)

    async def delete(self, uid: str):
        notice = await self.get(uid=uid)
        await super().delete(notice)

    async def reset_views(self, notice: Notice) -> Notice:
        notice.viewers.clear()
        return await super().update(notice, **marshal(notice))

    async def remove_viewer(self, notice: Notice, user: User) -> Notice:
        notice.viewers.remove(user)
        return await super().update(notice, **marshal(notice))

    async def add_viewer(self, notice: Notice, user: User) -> Notice:
        if user not in notice.viewers:
            notice.viewers.append(user)
            return await super().update(notice, **marshal(notice))
        return notice

    async def reset_departments(self, notice: Notice) -> Notice:
        notice.departments.clear()
        return await super().update(notice, **marshal(notice))

    async def remove_department(self, notice: Notice, department: Department) -> Notice:
        notice.departments.remove(department)
        return await super().update(notice, **marshal(notice))

    async def add_department(self, notice: Notice, department: Department) -> Notice:
        if department not in notice.departments:
            notice.departments.append(department)
            return await super().update(notice, **marshal(notice))
        return notice

    async def reset_groups(self, notice: Notice) -> Notice:
        notice.groups.clear()
        return await super().update(notice, **marshal(notice))

    async def remove_group(self, notice: Notice, group: Group) -> Notice:
        notice.groups.remove(group)
        return await super().update(notice, **marshal(notice))

    async def add_group(self, notice: Notice, group: Group) -> Notice:
        if group not in notice.groups:
            notice.groups.append(group)
            return await super().update(notice, **marshal(notice))
        return notice
