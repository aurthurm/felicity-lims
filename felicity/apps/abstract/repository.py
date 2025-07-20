import logging
from contextlib import asynccontextmanager
from typing import Any, Generic, List, TypeVar, Optional

from sqlalchemy import inspect, or_ as sa_or_, Table
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.sql import func
from sqlalchemy.sql.expression import bindparam, delete

from felicity.apps.abstract.entity import LabScopedEntity, MaybeLabScopedEntity
from felicity.core.tenant_context import (
    get_current_lab_uid,
    get_current_user_uid
)
from felicity.database.paging import EdgeNode, PageCursor, PageInfo
from felicity.database.session import async_session

logger = logging.getLogger(__name__)

M = TypeVar("M", bound=LabScopedEntity)


def apply_nested_loader_options(stmt, model, path):
    """
    Applies loader options to nested relationships based on a dot-separated path.

    :param stmt: The SQLAlchemy query object.
    :param model: The base model from which to start applying loader options.
    :param path: A dot-separated string representing the nested relationship path.
    :param loader_option: The loader option function (e.g., selectinload, joinedload).
    :return: The modified query with loader options applied to nested relationships.

    select(Order).options(
        selectinload(Order.items).selectinload(Item.keywords)
    )
    """
    load_option = None
    current_model = model
    paths = path.split(".") if "." in path else [path]

    for attr in paths:
        if load_option is None:
            load_option = selectinload(getattr(current_model, attr))
            current_option = load_option
        else:
            next_option = selectinload(getattr(current_model, attr))
            try:
                current_option = current_option.options(next_option)
            except Exception as e:
                current_option = next_option

        # Update the current model to the next model in the relationship path
        current_model = inspect(current_model).relationships[attr].mapper.class_

    return stmt.options(load_option)


class BaseRepository(Generic[M]):
    """Base repository class for database operations."""

    async_session = async_session
    model: M = None

    def __init__(self, model) -> None:
        """
        Initialize the repository with a model.

        :param model: The model class to use for this repository.
        """
        self.model = model
        self.is_lab_scoped = issubclass(model, LabScopedEntity) or issubclass(model, MaybeLabScopedEntity)

    def _apply_lab_filter(self, stmt, lab_uid: str = None):
        """Apply laboratory filter to query if model is lab-scoped"""
        if not self.is_lab_scoped:
            return stmt

        # Use provided lab_uid or get from context
        if lab_uid is None:
            lab_uid = get_current_lab_uid()

        if lab_uid:
            stmt = stmt.where(self.model.laboratory_uid == lab_uid)
        else:
            # If no lab context, log warning and return empty result
            logger.warning(f"No lab context for {self.model.__name__} query")
            stmt = stmt.where(self.model.laboratory_uid.is_(None))  # Will return no results

        return stmt

    def _inject_tenant_context(self, data: dict, include_audit=True) -> dict:
        """Inject tenant context into model data"""
        if not self.is_lab_scoped:
            return data

        # Auto-inject laboratory_uid if not provided
        if "laboratory_uid" not in data:
            lab_uid = get_current_lab_uid()
            if lab_uid:
                data["laboratory_uid"] = lab_uid
            else:
                raise ValueError(f"Laboratory context required to create {self.model.__name__}")

        if include_audit:
            # Auto-inject user context for audit fields if available
            user_uid = get_current_user_uid()
            if user_uid:
                if "created_by_uid" not in data:
                    data["created_by_uid"] = user_uid
                if "updated_by_uid" not in data:
                    data["updated_by_uid"] = user_uid

        return data

    @asynccontextmanager
    async def transaction(self):
        """
        Context manager for transaction support.

        Usage:
            async with repo.transaction() as session:
                # Perform operations with session
                # Commits automatically if no exception occurs
        """
        async with self.async_session() as session:
            yield session
            await self._commit_or_fail(session)

    async def _commit_or_fail(self, session: Optional[AsyncSession]):
        try:
            await session.commit()
        except:
            await session.rollback()
            raise

    async def save_transaction(self, session: Optional[AsyncSession]):
        await self._commit_or_fail(session)

    async def save(self, m: M, commit=True, session: Optional[AsyncSession] = None) -> M:
        """
        Save a model instance to the database.

            :param m: The model instance to save.
            :param commit: Whether to commit the transaction.
            :param session: Optional session to use for transaction support.
            :return: The saved model instance.
            :raises ValueError: If no model is provided.
        """
        if not m:
            raise ValueError("No model provided to save")  # noqa

        if session:
            # Use provided session (part of an existing transaction)
            session.add(m)
            if commit:
                await session.flush()
            return m
        else:
            async with self.async_session() as session:
                session.add(m)
                await session.flush()
                await self._commit_or_fail(session)
        return m

    async def save_all(self, items, commit=True, session: Optional[AsyncSession] = None):
        """
        Save multiple model instances to the database.

        :param items: A list of model instances to save.
        :param commit: Whether to commit the transaction.
        :param session: Optional session to use for transaction support.
        :return: The list of saved model instances.
        :raises ValueError: If no items are provided.
        """
        if not items:
            raise ValueError("No items provided to save")

        if session:
            # Use provided session (part of an existing transaction)
            session.add_all(items)
            if commit:
                await session.flush()
            return items
        else:
            # Create new session (standalone operation)
            async with self.async_session() as session:
                session.add_all(items)
                await session.flush()
                await self._commit_or_fail(session)
            return items

    async def create(self, commit=True, session: Optional[AsyncSession] = None, **kwargs) -> M:
        """
        Create a new model instance with the given data.

        :param kwargs: The data to create the new model instance.
        :return: The newly created model instance.
        :raises ValueError: If no data is provided.
        """
        if not kwargs:
            raise ValueError("No data provided to create a new model")

        # Auto-inject tenant context
        kwargs = self._inject_tenant_context(kwargs)

        filled = self.model.fill(self.model(), **kwargs)
        return await self.save(filled, commit=commit, session=session)

    async def bulk_create(self, bulk: list[dict], commit=True, session: Optional[AsyncSession] = None) -> list[M]:
        """
        Create multiple new model instances with the given data.

        :param bulk: A list of dictionaries containing data for new model instances.
        :return: A list of newly created model instances.
        :raises ValueError: If no data is provided.
        """
        if not bulk:
            raise ValueError("No data provided to create a new models")

        to_save = []
        for data in bulk:
            # Auto-inject tenant context for each item
            data = self._inject_tenant_context(data)
            fill = self.model.fill(self.model(), **data)
            to_save.append(fill)
        return await self.save_all(to_save, commit=commit, session=session)

    async def update(self, uid: str, commit=True, session: Optional[AsyncSession] = None, **kwargs) -> M:
        """
        Update an existing model instance.

        :param uid: The unique identifier of the model to update.
        :param kwargs: The data to update the model with.
        :return: The updated model instance.
        :raises ValueError: If uid or data is not provided.
        """
        if not uid or not kwargs:
            raise ValueError("Both uid and data are required to update model")

        # Get with automatic lab filtering
        item = await self.get(uid=uid)
        if not item:
            raise ValueError(f"{self.model.__name__} with uid {uid} not found or not accessible")

        filled = self.model.fill(item, **kwargs)
        return await self.save(filled, commit=commit, session=session)

    async def bulk_update_where(self, update_data: list[dict], filters: dict, commit=True,
                                session: Optional[AsyncSession] = None):
        """
        Update multiple model instances that match the given filters.

        :param update_data: A dictionary containing update values.
        :param filters: A dictionary of filter conditions.
        :param commit: Whether to commit the transaction.
        :param session: Optional session to use for transaction support.
        :return: The number of rows updated.
        :raises ValueError: If update_data or filters are not provided.
        """
        if not update_data or not filters:
            raise ValueError(
                "Both update_data and filters are required to update model"
            )

        stmt = self.model.smart_query(query=update(self.model), filters=filters)
        stmt = self._apply_lab_filter(stmt)
        stmt = stmt.values(update_data).execution_options(synchronize_session="fetch")

        if session:
            # Use provided session (part of an existing transaction)
            results = await session.execute(stmt)
            if commit:
                await session.flush()
            return results.rowcount
        else:
            async with self.async_session() as session:
                results = await session.execute(stmt)
            return results.scalars().all()

    async def bulk_update_with_mappings(self, mappings: list, commit=True,
                                        session: Optional[AsyncSession] = None) -> None:
        """
        Update multiple model instances using a list of mappings.

        :param mappings: A list of dictionaries containing update values with primary keys.
        :raises ValueError: If no mappings are provided.
        """
        if not mappings:
            raise ValueError("No mappings provided to update")

        to_update = mappings  # [marshaller(data) for data in mappings]
        for item in to_update:
            item["_uid"] = item["uid"]

        query = update(self.model).where(self.model.uid == bindparam("_uid"))

        binds = {}
        for key in to_update[0]:
            if key != "_uid":
                binds[key] = bindparam(key)

        stmt = query.values(binds).execution_options(
            synchronize_session=None
        )  # "fetch" not available

        if session:
            # Use provided session (part of an existing transaction)
            await session.execute(stmt, to_update)
            if commit:
                await session.flush()
        else:
            async with self.async_session() as session:
                await session.execute(stmt, to_update)
                await session.flush()
                await self._commit_or_fail(session)

    async def table_insert(self, table: Any, mappings: list[dict], commit=True,
                           session: Optional[AsyncSession] = None) -> None:
        """
        Insert multiple rows into a specified table.

        :param table: The SQLAlchemy table model.
        :param mappings: A list of dictionaries containing the data to insert.
        """
        stmt = table.insert()
        if hasattr(table.c, 'laboratory_uid'):
            mappings = list(map(lambda m: self._inject_tenant_context(m, include_audit=False), mappings))

        if session:
            # Use provided session (part of an existing transaction)
            await session.execute(stmt, mappings)
            if commit:
                await session.flush()
        else:
            async with self.async_session() as session:
                await session.execute(stmt, mappings)
                await session.flush()
                await self._commit_or_fail(session)

    async def table_query(
            self, table: Table, columns: list[str] | None = None,
            session: Optional[AsyncSession] = None, **kwargs
    ):
        """
        Query a specific table with optional column selection and filters.

        :param table: The SQLAlchemy table to query.
        :param columns: A list of column names to select.
        :param kwargs: Additional filter conditions.
        :return: The query results.
        :raises ValueError: If table or filters are not provided.
        """
        if table is None or not kwargs:
            raise ValueError("Both table and filters are required to query")

        if columns:
            stmt = select(*(table.c[column] for column in columns))
        else:
            stmt = select(table)
        for k, v in kwargs.items():
            stmt = stmt.where(table.c[k] == v)

        # Apply lab filtering if table has laboratory_uid column
        if hasattr(table.c, 'laboratory_uid'):
            lab_uid = get_current_lab_uid()
            if lab_uid:
                stmt = stmt.where(table.c.laboratory_uid == lab_uid)

        if session:
            # Use provided session (part of an existing transaction)
            results = await session.execute(stmt)
            return results.unique().scalars().all()  # , results.keys()
        else:
            async with self.async_session() as session:
                results = await session.execute(stmt)
                return results.unique().scalars().all()  # , results.keys()

    async def table_delete(self, table, commit=True, session: Optional[AsyncSession] = None, **kwargs):
        """
        Delete rows from a specified table based on the given filters.

        :param table: The SQLAlchemy table to delete from.
        :param kwargs: Additional filter conditions.
        """
        if table is None or not kwargs:
            raise ValueError("Both table and filters are required to delete")

        stmt = delete(table)
        for k, v in kwargs.items():
            stmt = stmt.where(table.c[k] == v)

        # Apply lab filtering if table has laboratory_uid column
        if hasattr(table.c, 'laboratory_uid'):
            lab_uid = get_current_lab_uid()
            if lab_uid:
                stmt = stmt.where(table.c.laboratory_uid == lab_uid)

        if session:
            # Use provided session (part of an existing transaction)
            await session.execute(stmt)
            if commit:
                await session.flush()
        else:
            async with self.async_session() as session:
                await session.execute(stmt)
                await session.flush()
                await self._commit_or_fail(session)

    async def get(self, related: list[str] | None = None, session: Optional[AsyncSession] = None, **kwargs) -> M:
        """
        Get a single model instance based on the given filters.

        :param related: A list of related fields to load.
        :param kwargs: Filter conditions.
        :return: The model instance if found, otherwise None.
        :raises ValueError: If no arguments are provided.
        """
        if not kwargs:
            raise ValueError("No arguments provided to get model")

        stmt = self.model.where(**kwargs)
        stmt = self._apply_lab_filter(stmt)

        if related:
            for key in related:
                stmt = apply_nested_loader_options(stmt, self.model, key)

        if session:
            results = await session.execute(stmt)
            return results.scalars().first()
        else:
            async with self.async_session() as session:
                results = await session.execute(stmt)
                return results.scalars().first()

    async def get_all(self, related: list[str] | None = None, sort_attrs: list[str] | None = None,
                      session: Optional[AsyncSession] = None, **kwargs) -> list[M]:
        """
        Get all model instances that match the given filters.

        :param related: A list of related fields to load.
        :param sort_attrs: A list of fields to sort by.
        :param kwargs: Filter conditions.
        :return: A list of model instances.
        :raises ValueError: If no arguments are provided.
        """
        if not kwargs:
            raise ValueError("No arguments provided to get all")

        # smart query
        stmt = self.model.smart_query(kwargs, sort_attrs)
        stmt = self._apply_lab_filter(stmt)

        if related:
            for key in related:
                stmt = apply_nested_loader_options(stmt, self.model, key)

        if session:
            results = await session.execute(stmt.distinct())
            return results.scalars().all()
        else:
            async with self.async_session() as session:
                results = await session.execute(stmt.distinct())
                return results.scalars().all()

    async def all(self, session: Optional[AsyncSession] = None) -> list[M]:
        """
        Get all instances of the model.

        :param session: Optional session to use for transaction support.
        :return: A list of all model instances.
        """
        stmt = select(self.model)
        stmt = self._apply_lab_filter(stmt)

        if session:
            # Use provided session (part of an existing transaction)
            results = await session.execute(stmt)
            return results.scalars().all()
        else:
            # Create new session (standalone operation)
            async with self.async_session() as new_session:
                results = await new_session.execute(stmt)
                return results.scalars().all()

    async def all_by_page(self, page: int = 1, limit: int = 20, **kwargs) -> dict:
        """
        Get a paginated list of model instances.

        :param page: The page number (default: 1).
        :param limit: The number of items per page (default: 20).
        :param kwargs: Additional filter conditions.
        :return: A dictionary containing the paginated results.
        """
        start = (page - 1) * limit

        stmt = self.model.where(**kwargs).limit(limit).offset(start)
        stmt = self._apply_lab_filter(stmt)

        async with self.async_session() as session:
            results = await session.execute(stmt)
            return results.scalars().all()

    async def get_by_uids(self, uids: List[str], session: Optional[AsyncSession] = None) -> list[M]:
        """
        Get model instances based on a list of unique identifiers.

        :param uids: A list of unique identifiers.
        :return: A list of model instances.
        :raises ValueError: If no uids are provided.
        """
        if not uids:
            raise ValueError("No uids provided to get by uids")
        stmt = select(self.model).where(self.model.uid.in_(uids))  # type: ignore
        stmt = self._apply_lab_filter(stmt)

        if session:
            results = await session.execute(stmt.order_by(self.model.uid))
            return results.scalars().all()
        async with self.async_session() as session:
            results = await session.execute(stmt.order_by(self.model.uid))
            return results.scalars().all()

    async def full_text_search(self, search_string, field):
        """
        Perform a full-text search on the model.

        :param search_string: The search string.
        :param field: The field to search on.
        :return: A list of model instances that match the search string.
        """
        stmt = select(self.model).filter(
            func.to_tsvector("english", getattr(self.model, field)).match(
                search_string, postgresql_regconfig="english"
            )
        )
        stmt = self._apply_lab_filter(stmt)

        async with self.async_session() as session:
            results = await session.execute(stmt)
        search = results.scalars().all()
        return search

    async def delete(self, uid: str, commit=True, session: Optional[AsyncSession] = None) -> None:
        """
        Delete a model instance based on its unique identifier.

        :param uid: The unique identifier of the model to delete.
        :raises ValueError: If no uid is provided.
        """
        if not uid:
            raise ValueError("No uid provided to delete")
        # First verify entity exists and is accessible
        entity = await self.get(uid=uid, session=session)
        if not entity:
            raise ValueError(f"{self.model.__name__} with uid {uid} not found or not accessible")

        stmt = delete(self.model).where(self.model.uid == uid)
        stmt = self._apply_lab_filter(stmt)

        if session:
            await session.execute(stmt)
            if commit:
                await session.flush()
        else:
            async with self.async_session() as session:
                await session.execute(stmt)
                await session.flush()
                await self._commit_or_fail(session)

    async def delete_where(self, commit=True, session: Optional[AsyncSession] = None, **kwargs) -> None:
        """
        Delete a model instance based on its provided conditions.
        :param kwargs: The unique identifier of the model to delete.
        :raises ValueError: If no uid is provided.
        """
        if not kwargs:
            raise ValueError("No filter criteria provided to delete")

        stmt = delete(self.model)

        # Apply filters
        for key, value in kwargs.items():
            if hasattr(self.model, key):
                stmt = stmt.where(getattr(self.model, key) == value)

        # Apply lab filtering
        stmt = self._apply_lab_filter(stmt)

        if session:
            await session.execute(stmt)
            if commit:
                await session.flush()
        else:
            async with self.async_session() as session:
                await session.execute(stmt)
                await session.flush()
                await self._commit_or_fail(session)

    async def count_where(self, filters: dict) -> int:
        """
        Count the number of model instances that match the given filters.

        :param filters: A dictionary of filter conditions.
        :return: The number of matching model instances.
        """
        filter_stmt = self.model.smart_query(filters=filters)
        # Apply lab filtering
        filter_stmt = self._apply_lab_filter(filter_stmt)
        count_stmt = select(func.count(filter_stmt.c.uid)).select_from(filter_stmt)

        async with self.async_session() as session:
            res = await session.execute(count_stmt)
        return res.scalars().one()

    async def search(self, **kwargs) -> list[M]:
        """
        Perform a search on the model based on the given conditions.

        :param kwargs: Search conditions.
        :return: A list of model instances that match the search conditions.
        :raises ValueError: If no search arguments are provided.
        """
        if not kwargs:
            raise ValueError("No search arguments provided")
        filters = []
        combined = set()
        for k, v in kwargs.items():
            filter_string = f"{k}__ilike"
            filters.append(filter_string)

            arg = dict()
            arg[k] = f"%{v}%"
            query = await self.get_all(**arg)
            for item in query:
                combined.add(item)

        return list(combined)

    async def filter(
            self,
            filters: dict | list[dict],
            sort_attrs: list[str] | None = None,
            limit: int | None = None,
            either: bool = False,
    ) -> list[M]:
        """
        Filter model instances based on the given conditions.

        :param filters: A list of filter conditions.
        :param sort_attrs: A list of attributes to sort by (default: None).
        :param limit: The maximum number of instances to return (default: None).
        :param either: Whether to use logical OR for multiple filters (default: False).
        :return: A list of filtered model instances.
        """
        if either:
            filters = {sa_or_: filters}

        stmt = self.model.smart_query(filters, sort_attrs)
        if limit:
            stmt = stmt.limit(limit)

        # Apply lab filtering
        stmt = self._apply_lab_filter(stmt)

        async with self.async_session() as session:
            results = await session.execute(stmt.distinct())
            found = results.scalars().all()
        return found

    async def paginate(
            self,
            page_size: int | None,
            after_cursor: str | None,
            before_cursor: str | None,
            filters: dict | list[dict] | None,
            sort_by: list[str] | None,
            **kwargs,
    ) -> PageCursor:
        """
        Paginate model instances based on the given conditions.

        :param page_size: The number of instances per page (default: None).
        :param after_cursor: The cursor for paginating after a specific instance (default: None).
        :param before_cursor: The cursor for paginating before a specific instance (default: None).
        :param filters: A dictionary or list of dictionaries of filter conditions.
        :param sort_by: A list of attributes to sort by (default: None).
        :param kwargs: Additional keyword arguments.
        :return: A PageCursor object containing the paginated results.
        """
        if not filters:
            filters = {}

        # get total count without paging filters from cursors
        total_count: int = await self.count_where(filters=filters)
        total_count = total_count if total_count else 0

        cursor_limit = {}
        if after_cursor:
            cursor_limit = {"uid__gt": self.decode_cursor(after_cursor)}

        if before_cursor:
            cursor_limit = {"uid__lt": self.decode_cursor(before_cursor)}

        # add paging filters
        _filters = None
        if isinstance(filters, dict):
            _filters = [{sa_or_: cursor_limit}, filters] if cursor_limit else filters
        elif isinstance(filters, list):
            _filters = filters
            if cursor_limit:
                _filters.append({sa_or_: cursor_limit})

        stmt = self.model.smart_query(filters=_filters, sort_attrs=sort_by)
        if kwargs.get("get_related"):
            for key in kwargs.get("get_related"):
                # stmt =  stmt.options(selectinload(getattr(self.model, key)))
                stmt = apply_nested_loader_options(stmt, self.model, key)

        if page_size:
            stmt = stmt.limit(page_size)
        
        # Apply lab filtering
        stmt = self._apply_lab_filter(stmt)

        async with self.async_session() as session:
            res = await session.execute(stmt)  # .distinct()

        qs = res.scalars().all()

        if qs is not None:
            # Remove duplicates (using set) instead of .distinct() to allow order by relations not in distinct selection
            items = list({item: item for item in qs}.values())
        else:
            qs = []
            items = []

        has_additional = (
            len(items) == page_size if page_size else True
        )  # len(qs) > len(items)s
        page_info = {
            "start_cursor": self.encode_cursor(items[0].uid) if items else None,
            "end_cursor": self.encode_cursor(items[-1].uid) if items else None,
        }
        if page_size is not None:
            page_info["has_next_page"] = has_additional
            page_info["has_previous_page"] = bool(after_cursor)

        return PageCursor(
            **{
                "total_count": total_count,
                "edges": self.build_edges(items=items),
                "items": items,
                "page_info": self.build_page_info(**page_info),
            }
        )

    def build_edges(self, items: List[Any]) -> List[EdgeNode]:
        """
        Build a list of EdgeNode objects from a list of model instances.

        :param items: A list of model instances.
        :return: A list of EdgeNode objects.
        """
        if not items:
            return []
        return [self.build_node(item) for item in items]

    def build_node(self, item: Any) -> EdgeNode:
        """
        Build an EdgeNode object from a model instance.

        :param item: A model instance.
        :return: An EdgeNode object.
        """
        return EdgeNode(**{"cursor": self.encode_cursor(item.uid), "node": item})

    @staticmethod
    def build_page_info(
            start_cursor: str | None = None,
            end_cursor: str | None = None,
            has_next_page: bool = False,
            has_previous_page: bool = False,
    ) -> PageInfo:
        """
        Build a PageInfo object with the given parameters.

        :param start_cursor: The cursor for the first instance in the page (default: None).
        :param end_cursor: The cursor for the last instance in the page (default: None).
        :param has_next_page: Whether there is a next page (default: False).
        :param has_previous_page: Whether there is a previous page (default: False).
        :return: A PageInfo object.
        """
        return PageInfo(
            **{
                "start_cursor": start_cursor,
                "end_cursor": end_cursor,
                "has_next_page": has_next_page,
                "has_previous_page": has_previous_page,
            }
        )

    @staticmethod
    def decode_cursor(cursor):
        """
        Decode a cursor value.

        :param cursor: The cursor value to decode.
        :return: The decoded cursor value.
        """
        return cursor

    @staticmethod
    def encode_cursor(identifier: Any):
        """
        Encode a cursor value.

        :param identifier: The value to encode.
        :return: The encoded cursor value.
        """
        return identifier
