from typing import List, Optional

import strawberry  # noqa
from api.gql.notification.types import NotificationType
from apps.notification import models



@strawberry.type
class StreamNotificationQuery:
    @strawberry.field
    async def notification_filter(
        self,
        info,
        group_uid: str | None,
        department_uid: str | None,
        user_uid: str | None,
    ) -> List[NotificationType]:
        filters = {}

        if group_uid:
            filters["groups__uid__in"] = [group_uid]

        if department_uid:
            filters["departments__uid__in"] = [department_uid]

        if user_uid:
            filters["users__uid__in"] = [user_uid]

        notif_stmt = models.Notification.smart_query(
            filters=filters, sort_attrs=["-created_at"]
        )

        notifications = (
            (await models.Notification.session.execute(notif_stmt)).scalars().all()
        )
        return list(notifications)

    @strawberry.field
    async def notification_by_uid(
        self, info, uid: str
    ) -> Optional[NotificationType]:
        return await models.Notification.get(uid=uid)
