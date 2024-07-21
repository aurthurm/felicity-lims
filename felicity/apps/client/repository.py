from domain.client.ports.repository import IClientRepository, IClientContactRepository
from domain.shared.ports.paginator.cursor import PageCursor

from infrastructure.database.repository.base import BaseRepository

from infrastructure.database.client.entities import Client, ClientContact
import sqlalchemy as sa


class ClientRepository(BaseRepository[Client], IClientRepository):
    def __init__(self) -> None:
        self.model = Client
        super().__init__()

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

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class ClientContactRepository(BaseRepository[ClientContact], IClientContactRepository):
    def __init__(self) -> None:
        self.model = ClientContact
        super().__init__()
