from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.messaging.types import MessageThreadType
from felicity.core.uid_gen import FelicityID
from felicity.apps.messaging import models


@strawberry.type
class MessageQuery:
    @strawberry.field
    async def threads_for_user(
        self, info, uid: FelicityID
    ) -> Optional[List[MessageThreadType]]:
        return await models.MessageThread.get_all(recipients__uid__in=[uid])

    @strawberry.field
    async def thread_by_uid(self, info, uid: FelicityID) -> Optional[MessageThreadType]:
        return await models.MessageThread.get(uid=uid)
