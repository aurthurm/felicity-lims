from typing import List, Optional

import strawberry  # noqa
from strawberry.permission import PermissionExtension

from beak.api.gql.noticeboard.types import NoticeType
from beak.api.gql.permissions import IsAuthenticated, HasPermission
from beak.modules.core.guard import FAction, FObject
from beak.modules.core.noticeboard.services import NoticeService
from beak.modules.core.identity.caches import get_current_user_preferences
from beak.core.dtz import timenow_dt


async def _get_department_uids() -> list[str]:
    preferences = await get_current_user_preferences(None)
    if not preferences or not preferences.departments:
        return []

    return [
        department.uid
        for department in preferences.departments
        if department and department.uid
    ]


@strawberry.type
class NoticeQuery:
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.NOTICE),
                ]
            )
        ]
    )
    async def notice_by_uid(self, info, uid: str) -> Optional[NoticeType]:
        department_uids = await _get_department_uids()
        if department_uids:
            return await NoticeService().get(
                uid=uid, departments__uid__in=department_uids
            )
        return await NoticeService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.ANALYTICS),
                ]
            )
        ]
    )
    async def notices_by_creator(self, info, uid: str) -> Optional[List[NoticeType]]:
        department_uids = await _get_department_uids()
        if department_uids:
            return await NoticeService().get_all(
                created_by_uid=uid,
                expiry__gt=timenow_dt(),
                departments___uid__in=department_uids,
            )
        return await NoticeService().get_all(created_by_uid=uid, expiry__gt=timenow_dt())

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.ANALYTICS),
                ]
            )
        ]
    )
    async def notice_filter(
            self,
            info,
            group_uid: str | None,
            department_uid: str | None,
    ) -> List[NoticeType]:
        filters = {}
        department_uids = await _get_department_uids()

        if group_uid:
            filters["groups__uid__in"] = [group_uid]

        if department_uids:
            filters["departments__uid__in"] = department_uids
        if department_uid:
            if department_uids and department_uid not in department_uids:
                return []
            filters["departments__uid__in"] = [department_uid]

        return await NoticeService().repository.filter(
            filters=filters, sort_attrs=["-created_at"]
        )
