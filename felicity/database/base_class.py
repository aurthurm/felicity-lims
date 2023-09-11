import logging
from datetime import datetime
from typing import Any, AsyncIterator, List, Optional

from sqlalchemy import Column, String
from sqlalchemy import or_ as sa_or_
from sqlalchemy import select
from sqlalchemy import update
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql import func
from sqlalchemy.sql.expression import bindparam
from sqlalchemy_mixins import AllFeaturesMixinAsync, smart_query

from core.uid_gen import get_flake_uid
from database.paginator.cursor import EdgeNode, PageCursor, PageInfo
from database.session import AsyncSessionScoped
from utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DBModel(DeclarativeBase, AllFeaturesMixinAsync):
    __name__: str
    __abstract__ = True
    __mapper_args__ = {"eager_defaults": True}

    uid = Column(
        String,
        primary_key=True,
        index=True,
        nullable=False,
        default=get_flake_uid,
    )

    def marshal_simple(self, exclude=None):
        """convert instance to dict
        leverages instance.__dict__
        """
        if exclude is None:
            exclude = []
        exclude.append("_sa_instance_state")

        data = self.__dict__
        return_data = {}

        for field in data:
            if field not in exclude:
                _v = data[field]
                if isinstance(_v, datetime):
                    _v = _v.__str__()
                return_data[field] = _v

        return return_data

    def marshal_nested(self, obj=None):
        if obj is None:
            obj = self

        if isinstance(obj, dict):
            return {k: self.marshal_nested(v) for k, v in obj.items()}
        elif hasattr(obj, "_ast"):
            return self.marshal_nested(obj._ast())
        elif not isinstance(obj, str) and hasattr(obj, "__iter__"):
            return [self.marshal_nested(v) for v in obj]
        elif hasattr(obj, "__dict__"):
            return {
                k: self.marshal_nested(v)
                for k, v in obj.__dict__.items()
                if not callable(v) and not k.startswith("_")
            }
        else:
            return obj

    @classmethod
    async def all_by_page(cls, page: int = 1, limit: int = 20, **kwargs) -> dict:
        start = (page - 1) * limit

        stmt = cls.where(**kwargs).limit(limit).offset(start)
        async with cls.session() as session:
            results = await session.execute(stmt)
        found = results.scalars().all()
        return found

    @classmethod
    async def get(cls, **kwargs):
        """Return the first value in database based on given args.
        Example:
            User.get(id=5)
        """
        stmt = cls.where(**kwargs)
        async with cls.session() as session:
            results = await session.execute(stmt)
            found = results.scalars().first()
            return found

    @classmethod
    async def create(cls, **kwargs):
        """Returns a new get instance of the class
        This is so that mutations can work well and prevent async IO issues
        """
        fill = await cls().fill(**kwargs)
        created = await cls.save(fill)
        if created:
            created = await cls.get(uid=created.uid)
        return created

    @classmethod
    async def bulk_create(cls, items: List):
        """
        @param items a list of Pydantic models
        """
        to_save = []
        for data in items:
            fill = await cls().fill(**cls._import(data))
            to_save.append(fill)
        return await cls.save_all(to_save)

    async def delete(self):
        """Removes the model from the current entity session and mark for deletion."""
        try:
            async with self.session() as session:
                await session.delete(self)
                await session.commit()
                await session.flush()
        except:
            async with self.session() as session:
                await session.rollback()
                raise

    async def update(self, **kwargs):
        """Returns a new get instance of the class
        This is so that mutations can work well and prevent async IO issues
        """
        fill = await self.fill(**kwargs)
        updated = await fill.save()
        if updated:
            updated = await self.get(uid=updated.uid)
        return updated

    @classmethod
    async def bulk_update_where(cls, update_data: List, filters: dict):
        """
        @param update_data a List of dictionary update values.
        @param filters is a dict of filter values.
        e.g [{'uid': 34, update_values}, ...]
        """
        to_update = [cls._import(data) for data in update_data]

        query = smart_query(query=update(cls), filters=filters)
        stmt = query.values(to_update).execution_options(synchronize_session="fetch")

        async with cls.session() as session:
            results = await session.execute(stmt)
        updated = results.scalars().all()
        return updated

    @classmethod
    async def bulk_update_with_mappings(cls, mappings: List) -> None:
        """
        @param mappings a List of dictionary update values with pks.
        e.g [{'uid': 34, update_values}, ...]
        ?? there must be zero many-to-many relations
        NB: Function does not return anything
        """
        if len(mappings) == 0:
            return

        to_update = [cls._import(data) for data in mappings]
        for item in to_update:
            item["_uid"] = item["uid"]

        query = update(cls).where(cls.uid == bindparam("_uid"))

        binds = {}
        for key in to_update[0]:
            if key != "_uid":
                binds[key] = bindparam(key)

        stmt = query.values(binds).execution_options(
            synchronize_session=None
        )  # "fetch" not available

        async with cls.session() as session:
            await session.execute(stmt, to_update)
            await session.flush()
            await session.commit()

    @classmethod
    async def bulk_update_with_mappings_not_working(cls, mappings: List):
        """
        @param mappings a List of dictionary update values with pks.
        e.g [{'uid': 34, update_values}, ...]
        """
        to_update = [cls._import(data) for data in mappings]

        async with cls.session() as session:
            await session.bulk_update_mappings(cls, to_update)
            await session.flush()
            await session.commit()

        return to_update

    @classmethod
    async def table_insert(cls, table, mappings):
        """
        @param mappings a dictionary update values.
        e.g {'name': 34, 'day': "fff"}
        """
        async with cls.session() as session:
            stmt = table.insert()
            await session.execute(stmt, mappings)
            await session.commit()
            await session.flush()

    @classmethod
    async def query_table(cls, table, **kwargs):
        stmt = select(table)
        for k, v in kwargs.items():
            stmt = stmt.where(table.c[k] == v)

        async with cls.session() as session:
            results = await session.execute(stmt)
        return results.unique().scalars().all()

    @classmethod
    async def get_related(cls, related: Optional[list] = None, list=False, **kwargs):
        """Return the first value in database based on given args."""
        try:
            del kwargs["related"]
        except KeyError:
            pass

        try:
            del kwargs["list"]
        except KeyError:
            pass

        stmt = cls.where(**kwargs)
        # if related:
        #     stmt.options(selectinload(related))

        async with cls.session() as session:
            results = await session.execute(stmt)

        if not list:
            found = results.scalars().first()
        else:
            found = results.scalars().all()

        return found

    @classmethod
    def _import(cls, schema_in):
        """Convert Pydantic schema to dict"""
        if isinstance(schema_in, dict):
            return schema_in
        data = schema_in.dict(exclude_unset=True)
        return data

    async def save(self):
        """Saves the updated model to the current entity database."""
        async with self.session() as session:
            try:
                session.add(self)
                await session.flush()
                await session.commit()
            except Exception:
                await session.rollback()
                raise
        return self

    async def flush_commit_session(self):
        """Saves the updated model to the current entity database."""
        async with self.session() as session:
            try:
                await session.flush()
                await session.commit()
            except Exception:
                await session.rollback()
                raise
        return self

    @classmethod
    async def save_all(cls, items):
        async with cls.session() as session:
            try:
                session.add_all(items)
                await session.flush()
                await session.commit()
            except Exception:
                await session.rollback()
                raise
        return items

    @classmethod
    async def get_one(cls, **kwargs):
        stmt = cls.where(**kwargs)
        async with cls.session() as session:
            results = await session.execute(stmt)
        found = results.scalars().first()
        return found

    @classmethod
    async def get_all(cls, **kwargs):
        stmt = cls.where(**kwargs)
        async with cls.session() as session:
            results = await session.execute(stmt)
        return results.unique().scalars().all()

    @classmethod
    async def from_smart_query(cls, query):
        async with cls.session() as session:
            results = await session.execute(query)
        return results.unique().scalars().all()

    @classmethod
    async def count_where(cls, filters):
        """
        :param filters:
        :return: int
        """
        filter_stmt = smart_query(query=select(cls), filters=filters)
        count_stmt = select(func.count(filter_stmt.c.uid)).select_from(filter_stmt)
        async with cls.session() as session:
            res = await session.execute(count_stmt)
        count = res.scalars().one()
        return count

    @classmethod
    async def fulltext_search(cls, search_string, field):
        """Full-text Search with PostgreSQL"""
        stmt = select(cls).filter(
            func.to_tsvector("english", getattr(cls, field)).match(
                search_string, postgresql_regconfig="english"
            )
        )
        async with cls.session() as session:
            results = await session.execute(stmt)
        search = results.scalars().all()
        return search

    @classmethod
    async def get_by_uids(cls, uids: List[Any]):

        stmt = select(cls).where(cls.uid.in_(uids))  # type: ignore

        async with cls.session() as session:
            results = await session.execute(stmt.order_by(cls.uid))

        return results.scalars().all()

    @classmethod
    async def stream_by_uids(cls, uids: List[Any]) -> AsyncIterator[Any]:

        stmt = select(cls).where(cls.uid.in_(uids))  # type: ignore

        async with cls.session() as session:
            stream = await session.stream(stmt.order_by(cls.uid))
        async for row in stream:
            yield row

    @classmethod
    async def stream_all(cls) -> AsyncIterator[Any]:
        stmt = select(cls)
        async with cls.session() as session:
            stream = await session.stream(stmt.order_by(cls.uid))
        async for row in stream:
            yield row

    @staticmethod
    def psql_records_to_dict(self, records, many=False):
        # records._row: asyncpg.Record / databases.backends.postgres.Record
        if not many and records:
            return dict(records)
        return [dict(record) for record in records]

    # https://engage.so/blog/a-deep-dive-into-offset-and-cursor-based-pagination-in-mongodb/
    # https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32

    @classmethod
    async def paginate_with_cursors(
        cls,
        page_size: int = None,
        after_cursor: Any = None,
        before_cursor: Any = None,
        filters: Any = None,
        sort_by: list[str] = None,
        get_related: str = None,
    ) -> PageCursor:
        if not filters:
            filters = {}

        # get total count without paging filters from cursors
        total_count: int = await cls.count_where(filters=filters)
        total_count = total_count if total_count else 0

        cursor_limit = {}
        if has_value_or_is_truthy(after_cursor):
            cursor_limit = {"uid__gt": cls.decode_cursor(after_cursor)}

        if has_value_or_is_truthy(before_cursor):
            cursor_limit = {"uid__lt": cls.decode_cursor(before_cursor)}

        # add paging filters
        _filters = None
        if isinstance(filters, dict):
            _filters = [{sa_or_: cursor_limit}, filters] if cursor_limit else filters
        elif isinstance(filters, list):
            _filters = filters
            if cursor_limit:
                _filters.append({sa_or_: cursor_limit})

        stmt = cls.smart_query(filters=_filters, sort_attrs=sort_by)

        if get_related:
            # stmt = stmt.options(selectinload(get_related))
            pass

        if page_size:
            stmt = stmt.limit(page_size)

        async with cls.session() as session:
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
            "start_cursor": cls.encode_cursor(items[0].uid) if items else None,
            "end_cursor": cls.encode_cursor(items[-1].uid) if items else None,
        }
        if page_size is not None:
            page_info["has_next_page"] = has_additional
            page_info["has_previous_page"] = bool(after_cursor)

        return PageCursor(
            **{
                "total_count": total_count,
                "edges": cls.build_edges(items=items),
                "items": items,
                "page_info": cls.build_page_info(**page_info),
            }
        )

    @classmethod
    def build_edges(cls, items: List[Any]) -> List[EdgeNode]:
        if not items:
            return []
        return [cls.build_node(item) for item in items]

    @classmethod
    def build_node(cls, item: Any) -> EdgeNode:
        return EdgeNode(**{"cursor": cls.encode_cursor(item.uid), "node": item})

    @classmethod
    def build_page_info(
        cls,
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

    @classmethod
    def decode_cursor(cls, cursor):
        return cursor

    @classmethod
    def encode_cursor(cls, identifier: Any):
        return identifier


DBModel.set_session(AsyncSessionScoped, True)
