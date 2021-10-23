from typing import Dict, TypeVar, AsyncIterator, List, Any, Optional
from base64 import b64decode, b64encode
import logging
from pydantic import BaseModel as PydanticBaseModel
from sqlalchemy.future import select
from sqlalchemy import Column, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import selectinload, as_declarative, declared_attr
from sqlalchemy import or_ as sa_or_
from felicity.database.async_mixins import AllFeaturesMixin, TimestampsMixin, smart_query
from felicity.database.paginator.cursor import PageCursor, EdgeNode, PageInfo

from felicity.database.session import AsyncSessionScoped
from felicity.utils import has_value_or_is_truthy

InDBSchemaType = TypeVar("InDBSchemaType", bound=PydanticBaseModel)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# noinspection PyPep8Naming
class classproperty(object):
    """
    @property for @classmethod
    taken from http://stackoverflow.com/a/13624858
    """

    def __init__(self, fget):
        self.fget = fget

    def __get__(self, owner_self, owner_cls):
        return self.fget(owner_cls)


# Enhanced Base Model Class with some django-like super powers
@as_declarative()
class DBModel(AllFeaturesMixin, TimestampsMixin):
    __name__: str
    __abstract__ = True

    uid = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)

    # uid = Column(UUID(), default=uuid.uuid4, primary_key=True, unique=True, nullable=False)

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    @classmethod
    async def all_by_page(cls, page: int = 1, limit: int = 20, **kwargs) -> Dict:
        start = (page - 1) * limit
        end = start + limit

        stmt = cls.where(**kwargs).limit(limit).offset(start)
        results = await cls.session.execute(stmt)
        found = results.scalars().all()

        return found  # cls.query.slice(start, end).all()

    @classmethod
    async def get(cls, **kwargs):
        """Return the the first value in database based on given args.
        Example:
            User.get(id=5)
        """
        # stmt = select(cls).where(**kwargs)
        stmt = cls.where(**kwargs)
        results = await cls.session.execute(stmt)
        found = results.scalars().first()
        return found

    @classmethod
    async def create(cls, **kwargs):
        """Returns a new get instance of the class
        This is so that mutations can work well and prevent asyc IO issues
        """
        fill = cls().fill(**kwargs)
        created = await cls.save(fill)
        if created:
            created = await cls.get(uid=created.uid)
        return created

    async def update(self, **kwargs):
        """Returns a new get instance of the class
        This is so that mutations can work well and prevent asyc IO issues
        """
        fill = self.fill(**kwargs)
        updated = await fill.save()
        if updated:
            updated = await self.get(uid=updated.uid)
        return updated

    @classmethod
    async def get_related(cls, related: Optional[list] = None, **kwargs):
        """Return the the first value in database based on given args.
        Example:
            User.get(id=5)
        """
        try:
            del kwargs['related']
        except KeyError:
            pass

        stmt = cls.where(**kwargs)
        if related:
            stmt.options(selectinload(related))
            logger.info(stmt)
        results = await cls.session.execute(stmt)
        found = results.scalars().first()
        return found

    @classmethod
    def _import(cls, schema_in: InDBSchemaType):
        """Convert Pydantic schema to dict"""
        if isinstance(schema_in, dict):
            return schema_in
        data = schema_in.dict(exclude_unset=True)
        return data

    async def save(self):
        """Saves the updated model to the current entity db.
        """
        try:
            self.session.add(self)
            await self.session.flush()
            await self.session.commit()
        except Exception as e:
            logger.info(f"Rolling Back -> Session Save Error: {e}")
            await self.session.rollback()
            raise
        return self

    @classmethod
    async def get_one(cls, **kwargs):
        stmt = cls.where(**kwargs)
        results = await cls.session.execute(stmt)
        found = results.scalars().first()
        return found

    @classmethod
    async def get_all(cls, **kwargs):
        stmt = cls.where(**kwargs)
        results = await cls.session.execute(stmt)
        return results.scalars().all()

    @classmethod
    async def count_where(cls, filters):
        # stmt = select(func.count(cls.uid))
        # stmt = select(func.count('*')).select_from(cls)
        # stmt = select(cls, func.count(cls.uid))
        # stmt = select(cls).with_only_columns([func.count(cls.uid)]).order_by(None)
        # stmt = select(func.count(cls.uid)).select_from(cls)
        # stmt = smart_query(query=stmt, filters=filters)
        stmt = smart_query(select(cls), filters=filters)
        res = await cls.session.execute(stmt)
        count = len(res.scalars().all())
        return count

    @classmethod
    async def fulltext_search(cls, search_string, field):
        """Full-text Search with PostgreSQL"""
        stmt = select(cls).filter(
            func.to_tsvector('english', getattr(cls, field)).match(search_string, postgresql_regconfig='english')
        )
        results = await cls.session.execute(stmt)
        search = results.scalars().all()
        return search

    @classmethod
    async def get_by_uids(cls, uids: List[Any]) -> AsyncIterator[Any]:
        stmt = (
            select(cls)
                .where(cls.uid.in_(uids))  # type: ignore
        )
        stream = await cls.session.stream(stmt.order_by(cls.uid))
        async for row in stream:
            yield row

    @classmethod
    async def stream_all(cls) -> AsyncIterator[Any]:
        stmt = select(cls)
        stream = await cls.session.stream(stmt.order_by(cls.uid))
        async for row in stream:
            yield row

    @staticmethod
    def psql_records_to_dict(self, records, many=False):
        # records._row: asyncpg.Record / databases.backends.postgres.Record
        if not many and records:
            return dict(records)
        return [dict(record) for record in records]

    @classmethod
    async def paginate_with_cursors(cls, page_size: [int] = None, after_cursor: Any = None, before_cursor: Any = None,
                                    filters: Any = None, sort_by: List[str] = None) -> PageCursor:

        logger.info(f"Filters in: {filters}")
        logger.info(f"page_size : {page_size}")
        logger.info(f"sort_by : {sort_by}")
        logger.info(f"after_cursor : {after_cursor}")

        if not filters:
            filters = {}

        # get total count without paging filters from cursors
        total_count: int = await cls.count_where(filters=filters)
        total_count = total_count if total_count else 0

        cursor_limit = {}
        if has_value_or_is_truthy(after_cursor):
            cursor_limit = {'uid__gt': cls.decode_cursor(after_cursor)}

        if has_value_or_is_truthy(before_cursor):
            cursor_limit = {'uid__lt': cls.decode_cursor(before_cursor)}

        # add paging filters
        if isinstance(filters, dict):
            _filters = [
                {sa_or_: cursor_limit},
                filters
            ] if cursor_limit else filters
        elif isinstance(filters, list):
            _filters = filters
            if cursor_limit:
                _filters = _filters.extend({sa_or_: cursor_limit})

        logger.info(f"Filters final: {filters}")

        stmt = cls.smart_query(filters=_filters, sort_attrs=sort_by)
        qs = (await cls.session.execute(stmt)).scalars().all()

        if qs is not None:
            items = qs[:page_size]
        else:
            qs = []
            items = []

        has_additional = len(qs) > len(items)
        page_info = {
            'start_cursor': cls.encode_cursor(items[0].uid) if items else None,
            'end_cursor': cls.encode_cursor(items[-1].uid) if items else None,
        }
        if page_size is not None:
            page_info['has_next_page'] = has_additional
            page_info['has_previous_page'] = bool(after_cursor)

        return PageCursor(**{
            'total_count': total_count,
            'edges': cls.build_edges(items=items),
            'items': items,
            'page_info': cls.build_page_info(**page_info)
        })

    @classmethod
    def build_edges(cls, items: List[Any]) -> List[EdgeNode]:
        if not items:
            return []
        return [cls.build_node(item) for item in items]

    @classmethod
    def build_node(cls, item: Any) -> EdgeNode:
        return EdgeNode(**{
            'cursor': cls.encode_cursor(item.uid),
            'node': item
        })

    @classmethod
    def build_page_info(cls, start_cursor: str = None, end_cursor: str = None,
                        has_next_page: bool = False, has_previous_page: bool = False) -> PageInfo:
        return PageInfo(**{
            'start_cursor': start_cursor,
            'end_cursor': end_cursor,
            'has_next_page': has_next_page,
            'has_previous_page': has_previous_page
        })

    @classmethod
    def decode_cursor(cls, cursor):
        decoded = b64decode(cursor.encode('ascii')).decode('utf8')
        try:
            return int(decoded)
        except Exception as e:
            logger.warning(e)
            return decoded

    @classmethod
    def encode_cursor(cls, identifier: Any):
        return b64encode(str(identifier).encode('utf8')).decode('ascii')


DBModel.set_session(AsyncSessionScoped())
