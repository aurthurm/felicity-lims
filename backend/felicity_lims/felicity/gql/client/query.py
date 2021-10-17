from typing import List, Optional
import strawberry
import sqlalchemy as sa

from felicity.apps.client import models
from felicity.gql import PageInfo
from felicity.gql.client.types import (
    ClientType, ClientContactType,
    ClientCursorPage, ClientEdge
)
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class ClientQuery:
    @strawberry.field
    async def client_all(self, info, page_size: Optional[int] = None,
                         after_cursor: Optional[str] = None, before_cursor: Optional[str] = None,
                         text: Optional[str] = None, sort_by: Optional[List[str]] = None) -> ClientCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = [
                'name__ilike',
                'code__ilike',
                'email__ilike',
                'email_cc__ilike',
                'province___name__ilike',
                'district___name__ilike',
                'phone_mobile__ilike',
                'phone_business__ilike',
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await models.Client.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by
        )

        total_count: int = page.total_count
        edges: List[ClientEdge[ClientType]] = page.edges
        items: List[ClientType] = page.items
        page_info: PageInfo = page.page_info

        return ClientCursorPage(
            total_count=total_count,
            edges=edges,
            items=items,
            page_info=page_info,
        )

    @strawberry.field
    async def client_by_uid(self, info, uid: int) -> ClientType:
        return await models.Client.get(uid=uid)

    @strawberry.field
    async def client_by_code(self, info, code: str) -> ClientType:
        return await models.Client.get(code=code)

    @strawberry.field
    async def clients_by_name(self, info, name: str) -> List[ClientType]:
        clients = await models.Client.get_all(name__contains=name)
        # clients = await models.Client.get_all(name__like=f"%{name}%")
        return clients

    @strawberry.field
    async def client_search(self, info, query_string: str) -> List[ClientType]:
        filters = ['name__ilike', 'code__ilike']
        combined = set()
        for _filter in filters:
            arg = dict()
            arg[_filter] = f"%{query_string}%"
            query = await models.Client.get_all(**arg)
            for item in query:
                combined.add(item)
        return list(combined)

    @strawberry.field
    async def client_contact_uid(self, info, uid: int) -> ClientContactType:
        return await models.ClientContact.get(uid=uid)

    @strawberry.field
    async def client_contact_by_client_uid(self, info, client_uid: int) -> List[ClientContactType]:
        return await models.ClientContact.get_all(client_uid=client_uid)
