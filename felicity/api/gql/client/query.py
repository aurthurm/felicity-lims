import logging
from typing import List

import sqlalchemy as sa
import strawberry  # noqa
from strawberry.permission import PermissionExtension

from felicity.api.deps import Info
from felicity.api.gql.client.types import (
    ClientContactType,
    ClientCursorPage,
    ClientEdge,
    ClientType,
)
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.types import PageInfo
from felicity.apps.client.services import ClientContactService, ClientService
from felicity.apps.guard import FAction, FObject
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class ClientQuery:
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.CLIENT)]
        )]
    )
    async def client_all(
            self,
            info: Info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> ClientCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = [
                "name__ilike",
                "code__ilike",
                "email__ilike",
                "email_cc__ilike",
                "province___name__ilike",
                "district___name__ilike",
                "phone_mobile__ilike",
                "phone_business__ilike",
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await ClientService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[ClientEdge[ClientType]] = page.edges
        items: List[ClientType] = page.items
        page_info: PageInfo = page.page_info

        return ClientCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.CLIENT)]
        )]
    )
    async def client_by_uid(self, info, uid: str) -> ClientType:
        return await ClientService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.CLIENT)]
        )]
    )
    async def client_by_code(self, info, code: str) -> ClientType:
        return await ClientService().get(code=code)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.CLIENT)]
        )]
    )
    async def clients_by_name(self, info, name: str) -> List[ClientType]:
        clients = await ClientService().get_all(name__contains=name)
        # clients = await ClientService().get_all(name__like=f"%{name}%")
        return clients

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.CLIENT)]
        )]
    )
    async def client_search(self, info, query_string: str) -> List[ClientType]:
        filters = ["name__ilike", "code__ilike"]
        combined = set()
        for _filter in filters:
            arg = dict()
            arg[_filter] = f"%{query_string}%"
            query = await ClientService().get_all(**arg)
            for item in query:
                combined.add(item)
        return list(combined)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.CLIENT)]
        )]
    )
    async def client_contact_all(self, info) -> List[ClientContactType]:
        return await ClientContactService().all()

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.CLIENT)]
        )]
    )
    async def client_contact_uid(self, info, uid: str) -> ClientContactType:
        return await ClientContactService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.CLIENT)]
        )]
    )
    async def client_contact_by_client_uid(
            self, info, client_uid: str
    ) -> List[ClientContactType]:
        return await ClientContactService().get_all(
            client_uid=client_uid, is_active=True
        )
