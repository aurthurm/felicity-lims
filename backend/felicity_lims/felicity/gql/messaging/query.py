from typing import Optional, List
import strawberry
from felicity.apps.messaging import models
from felicity.gql.messaging.types import MessageThreadType


@strawberry.type
class MessageQuery:
    @strawberry.field
    async def threads_for_user(self, info, uid: int) -> Optional[List[MessageThreadType]]:
        return await models.MessageThread.get_all(recipients__uid__in=[uid])

    @strawberry.field
    async def thread_by_uid(self, info, uid: int) -> Optional[MessageThreadType]:
        return await models.MessageThread.get(uid=uid)
