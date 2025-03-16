from typing import Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract.entity import BaseEntity
from felicity.apps.abstract.repository import BaseRepository

E = TypeVar("E", bound=BaseEntity)
C = TypeVar("C", bound=BaseModel)
U = TypeVar("U", bound=BaseModel)


class BaseService(Generic[E, C, U]):
    """
    A generic base service class for handling CRUD operations and queries.

    Type Parameters:
    E: Type of the Entity
    C: Type of the Create model
    U: Type of the Update model
    """

    def __init__(self, repository) -> None:
        """
        Initialize the service with a repository.

        Args:
            repository: A callable that returns a BaseRepository instance
        """
        self.repository: BaseRepository = repository

    async def paging_filter(
            self,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            filters: list[dict] | dict | None = None,
            sort_by: list[str] | None = None,
            **kwargs,
    ):
        """
        Perform paginated filtering of entities.

        Args:
            page_size: Number of items per page
            after_cursor: Cursor for fetching next page
            before_cursor: Cursor for fetching previous page
            filters: Filtering criteria
            sort_by: Sorting criteria
            **kwargs: Additional arguments

        Returns:
            Paginated result of entities
        """
        return await self.repository.paginate(
            page_size, after_cursor, before_cursor, filters, sort_by, **kwargs
        )

    async def search(self, **kwargs) -> list[E]:
        """
        Search for entities based on given criteria.

        Args:
            **kwargs: Search parameters

        Returns:
            List of matching entities
        """
        return await self.repository.search(**kwargs)

    async def all(self, session: AsyncSession | None = None) -> list[E]:
        """
        Retrieve all entities.

        Returns:
            List of all entities
        """
        return await self.repository.all(session=session)

    async def get(self, related: list[str] | None = None, session: AsyncSession | None = None, **kwargs) -> E:
        """
        Get a single entity based on given criteria.

        Args:
            **kwargs: Criteria for fetching the entity

        Returns:
            A single entity
        """
        return await self.repository.get(related=related, session=session, **kwargs)

    async def get_by_uids(self, uids: list[str], session: AsyncSession | None = None) -> list[E]:
        """
        Get multiple entities by their UIDs.

        Args:
            uids: List of entity UIDs

        Returns:
            List of entities matching the given UIDs
        """
        return await self.repository.get_by_uids(uids, session=session)

    async def get_all(self, related: list[str] | None = None, sort_attrs: list[str] | None = None,
                      session: AsyncSession | None = None, **kwargs) -> list[E]:
        """
        Get all entities matching the given criteria.

        Args:
            related: Related model to lazy load
            sort_attrs: columns to sort by
            **kwargs: Criteria for fetching entities

        Returns:
            List of matching entities
        """
        return await self.repository.get_all(related=related, sort_attrs=sort_attrs, session=session, **kwargs)

    async def create(self, c: C | dict, related: list[str] | None = None, commit: bool = True,
                     session: AsyncSession | None = None) -> E:
        """
        Create a new entity.

        Args:
            c: Create model or dictionary with entity data
            related: List of related entity names to fetch after creation

        Returns:
            Newly created entity (with related entities if specified)
        """
        data = self._import(c)
        created = await self.repository.create(commit=commit, session=session, **data)
        if not related:
            return created
        return await self.get(related=related, uid=created.uid, session=session)

    async def bulk_create(
            self, bulk: list[dict | C], related: list[str] | None = None, commit: bool = True,
            session: AsyncSession | None = None
    ) -> list[E]:
        """
        Create multiple entities in bulk.

        Args:
            bulk: List of create models or dictionaries with entity data
            related: List of related entity names to fetch after creation

        Returns:
            List of newly created entities (with related entities if specified)
        """
        created = await self.repository.bulk_create(bulk=[self._import(b) for b in bulk], commit=commit,
                                                    session=session)
        if not related:
            return created
        return [(await self.get(related=related, uid=x.uid, session=session)) for x in created]

    async def update(
            self, uid: str, update: U | dict, related: list[str] | None = None, commit: bool = True,
            session: AsyncSession | None = None
    ) -> E:
        """
        Update an existing entity.

        Args:
            uid: Unique identifier of the entity to update
            update: Update model or dictionary with updated entity data
            related: List of related entity names to fetch after update

        Returns:
            Updated entity (with related entities if specified)
        """
        if "uid" in update:
            del update["uid"]
        updated = await self.repository.update(uid=uid, commit=commit, session=session, **self._import(update))
        if not related:
            return updated
        return await self.get(related=related, uid=updated.uid, session=session)

    async def save(self, entity: E, related: list[str] | None = None, commit: bool = True,
                   session: AsyncSession | None = None) -> E:
        """
        Save an entity (create if not exists, update if exists).

        Args:
            entity: Entity to save
            related: List of related entity names to fetch after saving

        Returns:
            Saved entity (with related entities if specified)
        """
        saved = await self.repository.save(m=entity, commit=commit, session=session)
        if not related:
            return saved
        return await self.get(related=related, uid=saved.uid, session=session)

    async def bulk_update_with_mappings(self, mappings: list[dict], commit: bool = True,
                                        session: AsyncSession | None = None) -> None:
        """
        Perform bulk updates using a list of mappings.

        Args:
            mappings: List of dictionaries containing update information

        Returns:
            None
        """
        return await self.repository.bulk_update_with_mappings(mappings, commit=commit, session=session)

    async def delete(self, uid: str, commit: bool = True, session: AsyncSession | None = None) -> None:
        """
        Delete an entity by its unique identifier.

        Args:
            uid: Unique identifier of the entity to delete

        Returns:
            None
        """
        return await self.repository.delete(uid=uid, commit=commit, session=session)

    async def delete_where(self, commit: bool = True, session: AsyncSession | None = None, **kwargs) -> None:
        """
        Delete an entity by its unique identifier.

        Args:
            uid: Unique identifier of the entity to delete

        Returns:
            None
        """
        return await self.repository.delete_where(commit=commit, session=session, **kwargs)

    @classmethod
    def _import(cls, schema_in: C | U | dict) -> dict:
        """
        Convert Pydantic schema to dict.

        Args:
            schema_in: Input schema (Pydantic model or dict)

        Returns:
            Dictionary representation of the input
        """
        if isinstance(schema_in, dict):
            return schema_in
        return schema_in.model_dump(exclude_unset=True)
