from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.noticeboard.types import NoticeType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.apps.noticeboard.services import NoticeService
from felicity.core.dtz import timenow_dt


@strawberry.type
class NoticeQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def notice_by_uid(self, info, uid: str) -> Optional[NoticeType]:
        return await NoticeService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def notices_by_creator(self, info, uid: str) -> Optional[List[NoticeType]]:
        return await NoticeService().get_all(
            created_by_uid=uid, expiry__gt=timenow_dt()
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def notice_filter(
        self,
        info,
        group_uid: str | None,
        department_uid: str | None,
    ) -> List[NoticeType]:
        filters = {}

        if group_uid:
            filters["groups__uid__in"] = [group_uid]

        if department_uid:
            filters["departments__uid__in"] = [department_uid]

        return await NoticeService().repository.filter(
            filters=filters, sort_attrs=["-created_at"]
        )
