from typing import List

import strawberry

from felicity.api.gql.commune.types import SmsMessageCursorPage, SmsMessageEdge, SmsMessageType, SmsTemplateType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import PageInfo
from felicity.apps.commune.sms.services import SmsMessageService, SmsTemplateService
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class CommuneQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sms_templates_by_target(self,info,target_type: str,target_uid: str) -> list[SmsTemplateType]:
        return await SmsTemplateService().get_all(target_type=target_type, target_uid=target_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sms_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            status: str | None = None,
            audience: str | None = None,
            sort_by: list[str] | None = None,
    ) -> SmsMessageCursorPage:
        filters = {}

        if has_value_or_is_truthy(status):
            filters["status"] = status

        if has_value_or_is_truthy(audience):
            filters["audience"] = audience

        page = await SmsMessageService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[SmsMessageEdge[SmsMessageType]] = page.edges
        items: List[SmsMessageType] = page.items
        page_info: PageInfo = page.page_info

        return SmsMessageCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )
