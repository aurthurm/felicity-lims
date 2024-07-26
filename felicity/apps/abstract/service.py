from typing import TypeVar, Generic

from pydantic import BaseModel
from sqlalchemy.orm import DeclarativeBase

from felicity.apps.abstract.repository import BaseRepository

E = TypeVar("E", bound=DeclarativeBase)
C = TypeVar("C", bound=BaseModel)
U = TypeVar("U", bound=BaseModel)


class BaseService(Generic[E, C, U]):
    def __init__(self, repository) -> None:
        self.repository: BaseRepository = repository()

    async def paging_filter(
            self,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            filters: list[dict] | dict = None,
            sort_by: list[str] | None = None,
            **kwargs
    ):
        return await self.repository.paginate(
            page_size, after_cursor, before_cursor, filters, sort_by, **kwargs
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
        return await self.repository.get_related(related=related, uid=uid)

    async def create(self, c: C | dict) -> E:
        data = self._import(c)
        return await self.repository.create(**data)

    async def bulk_create(self, bulk: list[dict | C]) -> None:
        return await self.repository.bulk_create([self._import(b) for b in bulk])

    async def update(self, uid: str, update: U | dict) -> E:
        if "uid" in update:
            del update["uid"]
        return await self.repository.update(uid, **self._import(update))

    async def save(self, entity: E) -> E:
        return await self.repository.save(entity)

    async def bulk_update_with_mappings(self, mappings: list[dict]) -> None:
        return await self.repository.bulk_update_with_mappings(mappings)

    async def delete(self, uid: str) -> None:
        return await self.repository.delete(uid)

    @classmethod
    def _import(cls, schema_in: C | U | dict) -> dict:
        """Convert Pydantic schema to dict"""
        if isinstance(schema_in, dict):
            return schema_in
        return schema_in.model_dump(exclude_unset=True)
