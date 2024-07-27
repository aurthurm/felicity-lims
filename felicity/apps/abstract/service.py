from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from felicity.apps.abstract.entity import BaseEntity

from felicity.apps.abstract.repository import BaseRepository

E = TypeVar("E", bound=BaseEntity)
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

    async def get_related(self, related: list[str], **kwargs) -> E:
        return await self.repository.get_related(related=related, **kwargs)
    
    async def create(self, c: C | dict, related: list[str] = None) -> E:
        data = self._import(c)
        created = await self.repository.create(**data)
        if not related:
            return created
        return await self.get_related(related=related, uid=created.uid)

    async def bulk_create(self, bulk: list[dict | C], related: list[str] = None) -> None:
        created = await self.repository.bulk_create([self._import(b) for b in bulk])
        if not related:
            return created
        return [(await self.get_related(related=related, uid=x.uid)) for x in created]

    async def update(self, uid: str, update: U | dict, related: list[str] = None) -> E:
        if "uid" in update:
            del update["uid"]
        updated = await self.repository.update(uid, **self._import(update))
        if not related:
            return updated
        return await self.get_related(related=related, uid=updated.uid)

    async def save(self, entity: E, related: list[str] = None) -> E:
        saved = await self.repository.save(entity)
        if not related:
            return saved
        return await self.get_related(related=related, uid=saved.uid)

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
