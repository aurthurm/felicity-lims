from typing import List, Optional

import strawberry  # noqa
from felicity.api.gql.messaging.types import MessageThreadType
from felicity.apps.messaging import models


@strawberry.type
class MessageQuery:
    @strawberry.field
    async def threads_for_user(
        self, info, uid: int
    ) -> Optional[List[MessageThreadType]]:
        return await models.MessageThread.get_all(recipients__uid__in=[uid])

    @strawberry.field
    async def thread_by_uid(self, info, uid: int) -> Optional[MessageThreadType]:
        return await models.MessageThread.get(uid=uid)
