from typing import TypeVar, Generic, Any

from pydantic import BaseModel
from sqlalchemy.orm import DeclarativeBase

from felicity.apps.abstract.repository import BaseRepository



E = TypeVar("E", bound=DeclarativeBase)
C = TypeVar("C", bound=BaseModel)
U = TypeVar("U", bound=BaseModel)


class BaseService(Generic[E, C, U]):
    def __init__(self, repository: BaseRepository) -> None:
        self.repository = repository()
    
    async def paging_filter(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
        **kwargs
    ):
        return await self.repository.paginate_with_cursors(
            page_size, after_cursor, before_cursor, text, sort_by, **kwargs
        )

    async def search(self, **kwargs) -> list[E]:
        return await self.repository.search(**kwargs)

    async def all(self) -> list[E]:
        return await self.repository.all()

    async def get(self, **kwargs) -> E:
        return await self.repository.get(**kwargs)

    async def get_by_uids(self, uids: list[str]) -> list[E]:
        return await self.repository.get_by_uids(uids)

    async def get_all(self, **kwargs) -> list[E]:
        return await self.repository.get_all(**kwargs)

    async def get_related(self, uid: str, related: list[str]) -> E:
        return await self.repository.get_related(uid, related)

    async def create(self, c: C | dict) -> E:
        data = self._import(c)
        return await self.repository.create(**data)

    async def bulk_create(self, bulk: list[dict | C]) -> None:
        return await self.repository.bulk_create([self._import(b) for b in bulk])

    async def update(self, uid: str, update: U | dict) -> E:
        return await self.repository.update(uid, **self._import(update))

    async def bulk_update_with_mappings(self, mappings: list[dict]) -> list[E]:
        return await self.repository.bulk_update_with_mappings(mappings)

    async def delete(self, uid: str) -> None:
        return await self.repository.delete(uid)
    
    @classmethod
    def _import(cls, schema_in: C | U | dict) -> dict:
        """Convert Pydantic schema to dict"""
        if isinstance(schema_in, dict):
            return schema_in
        return schema_in.model_dump(exclude_unset=True)
