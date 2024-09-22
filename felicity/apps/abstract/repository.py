from typing import Any, AsyncIterator, Generic, List, Optional, TypeVar

from sqlalchemy import inspect, or_ as sa_or_, Table
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from sqlalchemy.sql import func
from sqlalchemy.sql.expression import bindparam, delete

from felicity.apps.abstract.entity import BaseEntity
from felicity.database.paging import EdgeNode, PageCursor, PageInfo
from felicity.database.session import async_session

M = TypeVar("M", bound=BaseEntity)


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
            current_option = current_option.options(next_option)
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

    async def save(self, m: M) -> M:
        """
        Save a model instance to the database.

        :param m: The model instance to save.
        :return: The saved model instance.
        :raises ValueError: If no model is provided.
        """
        if not m:
            raise ValueError("No model provided to save")  # noqa

        async with self.async_session() as session:
            try:
                session.add(m)
                # try:
                #     session.add(m)
                # except Exception:
                #     await session.merge(m)
                await session.flush()
                await session.commit()
            except Exception:
                await session.rollback()
                raise
        return m

    async def save_all(self, items):
        """
        Save multiple model instances to the database.

        :param items: A list of model instances to save.
        :return: The list of saved model instances.
        :raises ValueError: If no items are provided.
        """
        if not items:
            raise ValueError("No items provided to save")

        async with self.async_session() as session:
            try:
                session.add_all(items)
                await session.flush()
                await session.commit()
            except Exception:
                await session.rollback()
                raise
        return items

    async def create(self, **kwargs) -> M:
        """
        Create a new model instance with the given data.

        :param kwargs: The data to create the new model instance.
        :return: The newly created model instance.
        :raises ValueError: If no data is provided.
        """
        if not kwargs:
            raise ValueError("No data provided to create a new model")
        filled = self.model.fill(self.model(), **kwargs)
        return await self.save(filled)

    async def bulk_create(self, bulk: list[dict]) -> list[M]:
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
            fill = self.model.fill(self.model(), **data)
            to_save.append(fill)
        return await self.save_all(to_save)

    async def update(self, uid: str, **data) -> M:
        """
        Update an existing model instance.

        :param uid: The unique identifier of the model to update.
        :param data: The data to update the model with.
        :return: The updated model instance.
        :raises ValueError: If uid or data is not provided.
        """
        if not uid or not data:
            raise ValueError("Both uid and data are required to update model")

        item = await self.get(uid=uid)
        filled = self.model.fill(item, **data)
        return await self.save(filled)

    async def bulk_update_where(self, update_data: list[dict], filters: dict):
        """
        Update multiple model instances that match the given filters.

        :param update_data: A list of dictionaries containing update values.
        :param filters: A dictionary of filter conditions.
        :return: The updated model instances.
        :raises ValueError: If update_data or filters are not provided.
        """
        if not update_data or not filters:
            raise ValueError("Both update_data and filters are required to update model")
        query = self.model.smart_query(query=update(self.model), filters=filters)
        stmt = query.values(update_data).execution_options(synchronize_session="fetch")

        async with self.async_session() as session:
            results = await session.execute(stmt)
        updated = results.scalars().all()
        return updated

    async def bulk_update_with_mappings(self, mappings: list) -> None:
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

        async with self.async_session() as session:
            await session.execute(stmt, to_update)
            await session.flush()
            await session.commit()

    async def table_insert(self, table: Any, mappings: list[dict]) -> None:
        """
        Insert multiple rows into a specified table.

        :param table: The SQLAlchemy table model.
        :param mappings: A list of dictionaries containing the data to insert.
        """
        async with self.async_session() as session:
            stmt = table.insert()
            await session.execute(stmt, mappings)
            await session.commit()
            await session.flush()

    async def query_table(self, table: Table, columns: list[str], **kwargs):
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

        async with self.async_session() as session:
            results = await session.execute(stmt)
        return results.unique().scalars().all()  # , results.keys()

    async def delete_table(self, table, **kwargs):
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
            
        async with self.async_session() as session:
            await session.execute(stmt)
            await session.commit()
            await session.flush()

    async def get(self, **kwargs) -> M:
        """
        Get a single model instance based on the given filters.

        :param kwargs: Filter conditions.
        :return: The model instance if found, otherwise None.
        :raises ValueError: If no arguments are provided.
        """
        if not kwargs:
            raise ValueError("No arguments provided to get model")
        stmt = self.model.where(**kwargs)
        async with self.async_session() as session:
            results = await session.execute(stmt)
            found = results.scalars().first()
        return found

    async def get_all(self, **kwargs) -> list[M]:
        """
        Get all model instances that match the given filters.

        :param kwargs: Filter conditions.
        :return: A list of model instances.
        :raises ValueError: If no arguments are provided.
        """
        if not kwargs:
            raise ValueError("No arguments provided to get all")
        stmt = self.model.where(**kwargs)
        async with self.async_session() as session:
            results = await session.execute(stmt)
            found = results.scalars().all()
        return found

    async def all(self) -> list[M]:
        """
        Get all instances of the model.

        :return: A list of all model instances.
        """
        async with self.async_session() as session:
            results = await session.execute(select(self.model))
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
        async with self.async_session() as session:
            results = await session.execute(stmt)
        found = results.scalars().all()
        return found

    async def get_by_uids(self, uids: List[str]) -> list[M]:
        """
        Get model instances based on a list of unique identifiers.

        :param uids: A list of unique identifiers.
        :return: A list of model instances.
        :raises ValueError: If no uids are provided.
        """
        if not uids:
            raise ValueError("No uids provided to get by uids")
        stmt = select(self.model).where(self.model.uid.in_(uids))  # type: ignore
        async with self.async_session() as session:
            results = await session.execute(stmt.order_by(self.model.uid))
        return results.scalars().all()

    async def get_related(
            self, related: Optional[list[str]], many: bool = False, **kwargs
    ):
        """
        Get related model instances based on the given filters.

        :param related: A list of related fields to load.
        :param many: Whether to return multiple instances (default: False).
        :param kwargs: Filter conditions.
        :return: The related model instances.
        :raises ValueError: If no related fields are provided.
        """
        if not related:
            raise ValueError("No related fields provided to get related")

        stmt = self.model.where(**kwargs)
        for key in related:
            stmt = apply_nested_loader_options(stmt, self.model, key)

        async with self.async_session() as session:
            results = await session.execute(stmt)

        if not many:
            found = results.scalars().first()
        else:
            found = results.scalars().all()

        return found

    async def stream_by_uids(self, uids: List[Any]) -> AsyncIterator[M]:
        """
        Stream model instances based on a list of unique identifiers.

        :param uids: A list of unique identifiers.
        :return: An asynchronous iterator yielding model instances.
        """
        stmt = select(self.model).where(self.model.in_(uids))  # type: ignore

        async with self.async_session() as session:
            stream = await session.stream(stmt.order_by(self.model.uid))
        async for row in stream:
            yield row

    async def stream_all(self) -> AsyncIterator[Any]:
        """
        Stream all model instances.

        :return: An asynchronous iterator yielding model instances.
        """
        stmt = select(self.model)
        async with self.async_session() as session:
            stream = await session.stream(stmt.order_by(self.model.uid))
        async for row in stream:
            yield row

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
        async with self.async_session() as session:
            results = await session.execute(stmt)
        search = results.scalars().all()
        return search

    async def delete(self, uid: str) -> None:
        """
        Delete a model instance based on its unique identifier.

        :param uid: The unique identifier of the model to delete.
        :raises ValueError: If no uid is provided.
        """
        if not uid:
            raise ValueError("No uid provided to delete")
        obj = await self.get(uid=uid)
        async with self.async_session() as session:
            await session.delete(obj)
            await session.flush()
            await session.commit()

    async def count_where(self, filters: dict) -> int:
        """
        Count the number of model instances that match the given filters.

        :param filters: A dictionary of filter conditions.
        :return: The number of matching model instances.
        """
        filter_stmt = self.model.smart_query(filters=filters)
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
            filters: dict,
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
        async with self.async_session() as session:
            results = await session.execute(stmt)
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

        async with self.async_session() as session:
            res = await session.execute(stmt)

        qs = res.scalars().all()

        if qs is not None:
            items = qs
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
            start_cursor: str = None,
            end_cursor: str = None,
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
