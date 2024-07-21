from typing import TypeVar, Generic

from pydantic import BaseModel

from domain.shared.ports.paginator.cursor import PageCursor
from domain.shared.ports.repository import IBaseRepository
from domain.shared.ports.service import IBaseService

M = TypeVar("M")
PydanticModel = TypeVar("PydanticModel", bound=BaseModel)


class BaseService(Generic[M], IBaseService[M]):
    def __init__(self, repository: IBaseRepository) -> None:
        self.repository = repository

    async def paging_filter(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
        **kwargs
    ) -> PageCursor:
        return await self.repository.paginate_with_cursors(
            page_size, after_cursor, before_cursor, text, sort_by, **kwargs
        )

    async def search(self, **kwargs) -> list[M]:
        return await self.repository.search(**kwargs)

    async def all(self) -> list[M]:
        return await self.repository.all()

    async def get(self, **kwargs) -> M:
        return await self.repository.get(**kwargs)

    async def get_by_uids(self, uids: list[str]) -> list[M]:
        return await self.repository.get_by_uids(uids)

    async def get_all(self, **kwargs) -> list[M]:
        return await self.repository.get_all(**kwargs)

    async def get_related(self, uid: str, related: list[str]) -> M:
        return await self.repository.get_related(uid, related)

    async def create(self, **kwargs) -> M:
        return await self.repository.create(**kwargs)

    async def bulk_create(self, bulk: list[dict]) -> None:
        pass

    async def update(self, m: M, **kwargs) -> M:
        return await self.repository.update(m, **kwargs)

    async def bulk_update_with_mappings(self, mappings: list[dict]) -> list[M]:
        return await self.repository.bulk_update_with_mappings(mappings)

    async def update_by_uid(self, uid: str, **kwargs) -> M:
        return await self.repository.update_by_uid(uid, **kwargs)

    async def delete(self, uid: str) -> None:
        return await self.repository.delete(uid)
