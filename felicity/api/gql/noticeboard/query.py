from typing import List, Optional
import strawberry  # noqa

from felicity.api.gql.noticeboard.types import NoticeType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.apps.noticeboard import entities
from felicity.core.dtz import get_time_now


@strawberry.type
class NoticeQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def notice_by_uid(self, info, uid: str) -> Optional[NoticeType]:
        return await entities.Notice.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def notices_by_creator(self, info, uid: str) -> Optional[List[NoticeType]]:
        return await entities.Notice.get_all(created_by_uid=uid, expiry__gt=get_time_now(str_format=False))

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

        notice_stmt = entities.Notice.smart_query(
            filters=filters, sort_attrs=["-created_at"]
        )

        notices = (
            (await entities.Notice.session.execute(notice_stmt)).scalars().all_async()
        )
        return list(notices)
