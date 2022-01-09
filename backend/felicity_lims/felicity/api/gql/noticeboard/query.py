from typing import List, Optional

import strawberry  # noqa
from felicity.apps.noticeboard import models
from felicity.gql.noticeboard.types import NoticeType


@strawberry.type
class NoticeQuery:
    @strawberry.field
    async def notice_by_uid(self, info, uid: int) -> Optional[NoticeType]:
        return await models.Notice.get(uid=uid)

    @strawberry.field
    async def notices_by_creator(self, info, uid: int) -> Optional[List[NoticeType]]:
        return await models.Notice.get_all(created_by_uid=uid)

    @strawberry.field
    async def notice_filter(
        self, info, group_uid: Optional[int], department_uid: Optional[int]
    ) -> List[NoticeType]:
        filters = {}

        if group_uid:
            filters["groups__uid__in"] = [group_uid]

        if department_uid:
            filters["departments__uid__in"] = [department_uid]

        notice_stmt = models.Notice.smart_query(
            filters=filters, sort_attrs=["-created_at"]
        )

        notices = (await models.Notice.session.execute(notice_stmt)).scalars().all()
        return list(notices)
