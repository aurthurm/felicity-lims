import logging
from contextlib import asynccontextmanager
from typing import Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import Table
from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract.entity import LabScopedEntity
from felicity.apps.abstract.repository import BaseRepository
from felicity.core.tenant_context import get_tenant_context

logger = logging.getLogger(__name__)

E = TypeVar("E", bound=LabScopedEntity)
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

    @asynccontextmanager
    async def transaction(self):
        """
        Context manager for transaction support.

        Usage:
            async with service.transaction() as session:
                # Perform operations with session
                # Commits automatically if no exception occurs
        """
        async with self.repository.transaction() as session:
            yield session

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

        Args:
            session: Optional session to use for transaction support

        Returns:
            List of all entities
        """
        return await self.repository.all(session=session)

    async def get(self, related: list[str] | None = None, session: AsyncSession | None = None, **kwargs) -> E:
        """
        Get a single entity based on given criteria.

        Args:
            related: List of related fields to load
            session: Optional session to use for transaction support
            **kwargs: Criteria for fetching the entity

        Returns:
            A single entity or None if not found
        """
        return await self.repository.get(related=related, session=session, **kwargs)

    async def get_by_uids(self, uids: list[str], session: AsyncSession | None = None) -> list[E]:
        """
        Get multiple entities by their UIDs.

        Args:
            uids: List of entity UIDs
            session: Optional session to use for transaction support

        Returns:
            List of entities matching the given UIDs
        """
        return await self.repository.get_by_uids(uids, session=session)

    async def get_all(self, related: list[str] | None = None, sort_attrs: list[str] | None = None,
                      session: AsyncSession | None = None, **kwargs) -> list[E]:
        """
        Get all entities matching the given criteria.

        Args:
            related: List of related fields to load
            sort_attrs: List of columns to sort by
            session: Optional session to use for transaction support
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
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            Newly created entity (with related entities if specified)
        """
        data = self._import(c)

        # Log creation with audit context
        context = get_tenant_context()
        if context:
            logger.info(
                f"Creating {self.repository.model.__name__}",
                extra={
                    "audit_action": f"CREATE_{self.repository.model.__name__.upper()}",
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                    "request_id": context.request_id,
                }
            )
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
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            List of newly created entities (with related entities if specified)
        """
        context = get_tenant_context()
        if context:
            logger.info(
                f"Bulk creating {len(bulk)} {self.repository.model.__name__} entities",
                extra={
                    "audit_action": f"BULK_CREATE_{self.repository.model.__name__.upper()}",
                    "count": len(bulk),
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                    "request_id": context.request_id,
                }
            )

        created = await self.repository.bulk_create(bulk=[self._import(b) for b in bulk], commit=commit,
                                                    session=session)
        if not related:
            return created
        return [(await self.get(related=related, uid=x.uid, session=session)) for x in created]

    async def save(self, entity: E, related: list[str] | None = None, commit: bool = True,
                   session: AsyncSession | None = None) -> E:
        """
        Save an entity (create if not exists, update if exists).

        Args:
            entity: Entity to save
            related: List of related entity names to fetch after saving
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            Saved entity (with related entities if specified)
        """

        context = get_tenant_context()
        if context:
            logger.info(
                f"Saving {self.repository.model.__name__} {entity.uid}",
                extra={
                    "audit_action": f"SAVE_{self.repository.model.__name__.upper()}",
                    "entity_uid": entity.uid,
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                }
            )

        saved = await self.repository.save(m=entity, commit=commit, session=session)
        if not related:
            return saved
        return await self.get(related=related, uid=saved.uid, session=session)

    async def save_all(self, entities: list[E], commit: bool = True, session: AsyncSession | None = None) -> list[E]:
        """
        Save multiple entities to the database.

        Args:
            entities: List of entities to save
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            List of saved entities
        """
        context = get_tenant_context()
        if context:
            logger.info(
                f"Saving {len(entities)} {self.repository.model.__name__} entities",
                extra={
                    "audit_action": f"SAVE_ALL_{self.repository.model.__name__.upper()}",
                    "count": len(entities),
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                }
            )
        return await self.repository.save_all(entities, commit=commit, session=session)

    async def save_transaction(self, session: AsyncSession | None = None) -> None:
        """
        Save the current transaction.

        Args:
            session: Optional session to use for transaction support
        """
        return await self.repository.save_transaction(session)

    async def all_by_page(self, page: int = 1, limit: int = 20, **kwargs) -> dict:
        """
        Get a paginated list of entities.

        Args:
            page: Page number (default: 1)
            limit: Number of items per page (default: 20)
            **kwargs: Additional filter conditions

        Returns:
            Dictionary containing paginated results
        """
        return await self.repository.all_by_page(page=page, limit=limit, **kwargs)

    async def full_text_search(self, search_string: str, field: str) -> list[E]:
        """
        Perform full-text search on entities.

        Args:
            search_string: The search string to match
            field: The field to search in

        Returns:
            List of entities matching the search criteria
        """
        return await self.repository.full_text_search(search_string, field)

    async def count_where(self, filters: dict) -> int:
        """
        Count entities matching the given filters.

        Args:
            filters: Dictionary of filter conditions

        Returns:
            Number of matching entities
        """
        return await self.repository.count_where(filters)

    async def filter(
            self,
            filters: dict | list[dict],
            sort_attrs: list[str] | None = None,
            limit: int | None = None,
            either: bool = False,
    ) -> list[E]:
        """
        Filter entities based on given conditions.

        Args:
            filters: Dictionary or list of dictionaries containing filter conditions
            sort_attrs: List of attributes to sort by
            limit: Maximum number of entities to return
            either: Whether to use logical OR for multiple filters

        Returns:
            List of filtered entities
        """
        return await self.repository.filter(
            filters=filters,
            sort_attrs=sort_attrs,
            limit=limit,
            either=either
        )

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
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            Updated entity (with related entities if specified)
        """
        if "uid" in update:
            del update["uid"]

        context = get_tenant_context()
        if context:
            logger.info(
                f"Updating {self.repository.model.__name__} {uid}",
                extra={
                    "audit_action": f"UPDATE_{self.repository.model.__name__.upper()}",
                    "entity_uid": uid,
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                    "request_id": context.request_id,
                }
            )

        updated = await self.repository.update(uid=uid, commit=commit, session=session, **self._import(update))
        if not related:
            return updated
        return await self.get(related=related, uid=updated.uid, session=session)

    async def bulk_update_where(self, update_data: list[dict], filters: dict, commit=True,
                                session: AsyncSession | None = None):
        """
        Update multiple entities that match the given filters.

        Args:
            update_data: List of dictionaries containing update values
            filters: Dictionary of filter conditions
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            Number of rows updated

        Raises:
            ValueError: If update_data or filters are not provided
        """
        context = get_tenant_context()
        if context:
            logger.info(
                f"Bulk updating {self.repository.model.__name__} entities",
                extra={
                    "audit_action": f"BULK_UPDATE_{self.repository.model.__name__.upper()}",
                    "filters": str(filters),
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                }
            )
        return await self.repository.bulk_update_where(update_data, filters, commit, session)

    async def bulk_update_with_mappings(self, mappings: list[dict], commit: bool = True,
                                        session: AsyncSession | None = None) -> None:
        """
        Perform bulk updates using a list of mappings.

        Args:
            mappings: List of dictionaries containing update information with primary keys
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            None
        """
        context = get_tenant_context()
        if context:
            logger.info(
                f"Bulk updating {len(mappings)} {self.repository.model.__name__} entities with mappings",
                extra={
                    "audit_action": f"BULK_UPDATE_MAPPINGS_{self.repository.model.__name__.upper()}",
                    "count": len(mappings),
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                }
            )
        return await self.repository.bulk_update_with_mappings(mappings, commit=commit, session=session)

    async def delete(self, uid: str, commit: bool = True, session: AsyncSession | None = None) -> None:
        """
        Delete an entity by its unique identifier.

        Args:
            uid: Unique identifier of the entity to delete
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            None
        """
        context = get_tenant_context()
        if context:
            logger.info(
                f"Deleting {self.repository.model.__name__} {uid}",
                extra={
                    "audit_action": f"DELETE_{self.repository.model.__name__.upper()}",
                    "entity_uid": uid,
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                    "request_id": context.request_id,
                }
            )
        return await self.repository.delete(uid=uid, commit=commit, session=session)

    async def delete_where(self, commit: bool = True, session: AsyncSession | None = None, **kwargs) -> None:
        """
        Delete entities that match the given filter conditions.

        Args:
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support
            **kwargs: Filter conditions to match entities for deletion

        Returns:
            None
        """
        context = get_tenant_context()
        if context:
            logger.info(
                f"Deleting {self.repository.model.__name__} entities where {kwargs}",
                extra={
                    "audit_action": f"DELETE_WHERE_{self.repository.model.__name__.upper()}",
                    "filters": str(kwargs),
                    "user_uid": context.user_uid,
                    "laboratory_uid": context.laboratory_uid,
                }
            )

        return await self.repository.delete_where(commit=commit, session=session, **kwargs)

    async def table_query(
            self, table: Table, columns: list[str] | None = None,
            session: AsyncSession | None = None, **kwargs
    ):
        """
        Query a specific table with optional column selection and filters.

        Args:
            table: The SQLAlchemy table to query
            columns: List of column names to select (optional)
            session: Optional session to use for transaction support
            **kwargs: Additional filter conditions

        Returns:
            The query results

        Raises:
            ValueError: If table or filters are not provided
        """
        return await self.repository.table_query(table, columns, session, **kwargs)

    async def table_insert(self, table: Table, mappings: list[dict], commit=True,
                           session: AsyncSession | None = None) -> None:
        """
        Insert multiple rows into a specified table.

        Args:
            table: The SQLAlchemy table model
            mappings: List of dictionaries containing the data to insert
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support

        Returns:
            None
        """
        return await self.repository.table_insert(table, mappings, commit, session)

    async def table_delete(self, table, commit=True, session: AsyncSession | None = None, **kwargs):
        """
        Delete rows from a specified table based on the given filters.

        Args:
            table: The SQLAlchemy table to delete from
            commit: Whether to commit the transaction
            session: Optional session to use for transaction support
            **kwargs: Additional filter conditions

        Returns:
            None
        """
        return await self.repository.table_delete(table, commit, session, **kwargs)

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
