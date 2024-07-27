from typing import Any, AsyncIterator, Generic, List, Optional, TypeVar

from sqlalchemy import inspect, or_ as sa_or_
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from sqlalchemy.sql import func
from sqlalchemy.sql.expression import bindparam

from felicity.apps.common.utils.serializer import marshaller
from felicity.database.paging import EdgeNode, PageCursor, PageInfo
from felicity.database.session import async_session
from felicity.apps.abstract.entity import BaseEntity

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

    for attr in path.split("."):
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
    async_session = async_session
    model: M = None

    def __init__(self, model: M) -> None:
        self.model = model

    async def save(self, m: M) -> M:
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
        filled = self.model.fill(self.model(), **kwargs)
        return await self.save(filled)

    async def bulk_create(self, bulk: list[dict]) -> list[M]:
        to_save = []
        for data in bulk:
            fill = self.model.fill(self.model(), **data)
            to_save.append(fill)
        return await self.save_all(to_save)

    async def update(self, uid: str, **data) -> M:
        item = await self.get(uid=uid)
        filled = self.model.fill(item, **data)
        return await self.save(filled)

    async def bulk_update_where(self, update_data: list[dict], filters: dict):
        """
        @param update_data a List of dictionary update values.
        @param filters is a dict of filter values.
        e.g [{'uid': 34, update_values}, ...]
        """
        query = self.model.smart_query(query=update(self.model), filters=filters)
        stmt = query.values(update_data).execution_options(synchronize_session="fetch")

        async with self.async_session() as session:
            results = await session.execute(stmt)
        updated = results.scalars().all()
        return updated

    async def bulk_update_with_mappings(self, mappings: list) -> None:
        """
        @param mappings a List of dictionary update values with pks.
        e.g [{'uid': 34, update_values}, ...]
        ?? there must be zero many-to-many relations
        NB: Function does not return anything
        """
        if len(mappings) == 0:
            return

        to_update = mappings # [marshaller(data) for data in mappings]
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
        @param table is a sqlalchemy table model
        @param mappings a dictionary update values.
        e.g {'name': 34, 'day': "fff"}
        """
        async with self.async_session() as session:
            stmt = table.insert()
            await session.execute(stmt, mappings)
            await session.commit()
            await session.flush()

    async def query_table(self, table, **kwargs):
        stmt = select(table)
        for k, v in kwargs.items():
            stmt = stmt.where(table.c[k] == v)

        async with self.async_session() as session:
            results = await session.execute(stmt)
        return results.unique().scalars().all()  # , results.keys()

    async def get(self, **kwargs) -> M:
        stmt = self.model.where(**kwargs)
        async with self.async_session() as session:
            results = await session.execute(stmt)
            found = results.scalars().first()
        return found

    async def get_all(self, **kwargs) -> list[M]:
        stmt = self.model.where(**kwargs)
        async with self.async_session() as session:
            results = await session.execute(stmt)
            found = results.scalars().all()
        return found

    async def all(self) -> list[M]:
        async with self.async_session() as session:
            results = await session.execute(select(self.model))
        return results.scalars().all()

    async def all_by_page(self, page: int = 1, limit: int = 20, **kwargs) -> dict:
        start = (page - 1) * limit

        stmt = self.model.where(**kwargs).limit(limit).offset(start)
        async with self.async_session() as session:
            results = await session.execute(stmt)
        found = results.scalars().all()
        return found

    async def get_by_uids(self, uids: List[str]) -> list[M]:
        stmt = select(self.model).where(self.model.uid.in_(uids))  # type: ignore
        async with self.async_session() as session:
            results = await session.execute(stmt.order_by(self.model.uid))
        return results.scalars().all()

    async def get_related(
        self, related: Optional[list[str]] = None, many: bool = False, **kwargs
    ):
        """Return the first value in database based on given args."""
        try:
            del kwargs["related"]
        except KeyError:
            pass

        try:
            del kwargs["many"]
        except KeyError:
            pass

        stmt = self.model.where(**kwargs)
        if related:
            for key in related:
                stmt =  stmt.options(selectinload(getattr(self.model, key)))

        async with self.async_session() as session:
            results = await session.execute(stmt)

        if not many:
            found = results.scalars().first()
        else:
            found = results.scalars().all()

        return found

    async def stream_by_uids(self, uids: List[Any]) -> AsyncIterator[M]:

        stmt = select(self.model).where(self.model.in_(uids))  # type: ignore

        async with self.async_session() as session:
            stream = await session.stream(stmt.order_by(self.model.uid))
        async for row in stream:
            yield row

    async def stream_all(self) -> AsyncIterator[Any]:
        stmt = select(self.model)
        async with self.async_session() as session:
            stream = await session.stream(stmt.order_by(self.model.uid))
        async for row in stream:
            yield row

    async def full_text_search(self, search_string, field):
        """Full-text Search with PostgreSQL"""
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
        obj = await self.get(uid=uid)
        async with self.async_session() as session:
            await session.delete(obj)
            await session.flush()
            await session.commit()

    async def count_where(self, filters: dict) -> int:
        """
        :param filters:
        :return: int
        """
        # filter_stmt = smart_query(query=select(self), filters=filters) noqa
        filter_stmt = self.model.smart_query(filters=filters)
        count_stmt = select(func.count(filter_stmt.c.uid)).select_from(filter_stmt)
        async with self.async_session() as session:
            res = await session.execute(count_stmt)
        return res.scalars().one()

    async def search(self, **kwargs) -> list[M]:
        filters = []
        combined = set()
        for k, v in kwargs:
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
        filters: list[dict],
        sort_attrs: list[str] | None = None,
        limit: int | None = None,
        either: bool = False,
    ) -> list[M]:
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
                stmt =  apply_nested_loader_options(stmt, self.model, key)

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
        if not items:
            return []
        return [self.build_node(item) for item in items]

    def build_node(self, item: Any) -> EdgeNode:
        return EdgeNode(**{"cursor": self.encode_cursor(item.uid), "node": item})

    @staticmethod
    def build_page_info(
        start_cursor: str = None,
        end_cursor: str = None,
        has_next_page: bool = False,
        has_previous_page: bool = False,
    ) -> PageInfo:
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
        return cursor

    @staticmethod
    def encode_cursor(identifier: Any):
        return identifier
