
from felicity.apps.client.entities import Client, ClientContact
import sqlalchemy as sa

from felicity.database.paging import PageCursor
from felicity.database.repository import BaseRepository


class ClientRepository(BaseRepository[Client]):
    def __init__(self) -> None:
        super().__init__(Client)

    async def paginate_with_cursors(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
    ) -> PageCursor:

        filters = {}

        _or_ = dict()
        if text:
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

        return super().paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class ClientContactRepository(BaseRepository[ClientContact]):
    def __init__(self) -> None:
        super().__init__(ClientContact)
