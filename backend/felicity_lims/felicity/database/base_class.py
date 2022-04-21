import logging
from base64 import b64decode, b64encode
from typing import Any, AsyncIterator, Dict, List, Optional, TypeVar, Union
import re
from felicity.database.async_mixins import (
    AllFeaturesMixin,
    ModelNotFoundError,
    smart_query,
)
from felicity.database.paginator.cursor import EdgeNode, PageCursor, PageInfo
from felicity.database.session import async_session_factory
from felicity.utils import has_value_or_is_truthy
from pydantic import BaseModel as PydanticBaseModel
from sqlalchemy import Column, Integer, or_ as sa_or_, update
from sqlalchemy.future import select
from sqlalchemy.orm import as_declarative, declared_attr, selectinload, join
from sqlalchemy.sql import func

InDBSchemaType = TypeVar("InDBSchemaType", bound=PydanticBaseModel)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""?? Usefull Tools
1. https://docs.sqlalchemy.org/en/14/orm/session_events.html#adding-global-where-on-criteria
   Maybe for global department filters ?
   
2. https://stackoverflow.com/questions/12753450/sqlalchemy-mixins-and-event-listener

SQLAlchemy "event.listen" for all models
event.listen(MyBaseMixin, 'before_insert', get_created_by_id, propagate=True)
event.listen(MyBaseMixin, 'before_update', get_updated_by_id, propagate=True)

"""


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


# return dict((key, value) for key, value in f.__dict__.items() if not callable(value) and not key.startswith('__'))
# vars(), dir()
# json.loads(json.dumps(self, default=lambda o: o.__dict__))
# dict((key, getattr(x, key)) for key in dir(x) if key not in dir(x.__class__))
# if not name.startswith('__') and not inspect.ismethod(value):


# Enhanced Base Model Class with some django-like super powers
@as_declarative()
class DBModel(AllFeaturesMixin):
    __name__: str
    __abstract__ = True

    # __mapper_args__ :
    # required in order to access columns with server defaults
    # or SQL expression defaults, subsequent to a flush, without
    # triggering an expired load
    __mapper_args__ = {"eager_defaults": True}

    uid = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)

    # uid = Column(UUID(), default=uuid.uuid4, primary_key=True, unique=True, nullable=False)

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        # from CamelCase to table camel_case
        # return '_'.join(re.sub('([A-Z][a-z]+)', r' \1', re.sub('([A-Z]+)', r' \1', cls.__name__)).split()).lower()
        # from CamelCase to table camelcase
        return cls.__name__.lower()

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
                return_data[field] = data[field]  # getattr(self, field)

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
                if not callable(v) and not k.startswith('_')
            }
        else:
            return obj

    @classmethod
    async def all_by_page(cls, page: int = 1, limit: int = 20, **kwargs) -> Dict:
        start = (page - 1) * limit
        end = start + limit

        stmt = cls.where(**kwargs).limit(limit).offset(start)
        async with async_session_factory() as session:
            results = await session.execute(stmt)
        found = results.scalars().all()
        return found

    async def delete(self):
        """Removes the model from the current entity session and mark for deletion.
        """
        async with async_session_factory() as session:
            await session.delete(self)
            await session.flush()
            await session.commit()

    @classmethod
    async def destroy(cls, *ids):
        """Delete the records with the given ids
        :type ids: list
        :param ids: primary key ids of records
        """
        for pk in ids:
            obj = await cls.find(pk)
            if obj:
                await obj.delete()

        async with async_session_factory() as session:
            await session.flush()

    @classmethod
    async def all(cls):
        async with async_session_factory() as session:
            result = await session.execute(select(cls))
        _all = result.scalars().all()
        return _all

    @classmethod
    async def first(cls):
        async with async_session_factory() as session:
            result = await session.execute(select(cls))
        _first = result.scalars().first()
        return _first

    @classmethod
    async def find(cls, id_):
        """Find record by the id
        :param id_: the primary key
        """
        stmt = cls.where(uid=id_)
        async with async_session_factory() as session:
            results = await session.execute(stmt)

        one_or_none = results.scalars().one_or_none()
        return one_or_none

    @classmethod
    async def find_or_fail(cls, id_):
        # assume that query has custom get_or_fail method
        result = await cls.find(id_)
        if result:
            return result
        else:
            raise ModelNotFoundError("{} with uid '{}' was not found"
                                     .format(cls.__name__, id_))

    @classmethod
    async def get(cls, **kwargs):
        """Return the the first value in database based on given args.
        Example:
            User.get(id=5)
        """
        # stmt = select(cls).where(**kwargs)
        stmt = cls.where(**kwargs)
        async with async_session_factory() as session:
            results = await session.execute(stmt)
            found = results.scalars().first()
            return found

    @staticmethod
    async def db_commit():
        async with async_session_factory() as session:
            await session.commit()

    @staticmethod
    async def db_flush():
        async with async_session_factory() as session:
            await session.flush()

    @classmethod
    async def create(cls, **kwargs):
        """Returns a new get instance of the class
        This is so that mutations can work well and prevent async IO issues
        """
        fill = cls().fill(**kwargs)
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
            to_save.append(cls().fill(**cls._import(data)))
        return await cls.save_all(to_save)

    async def update(self, **kwargs):
        """Returns a new get instance of the class
        This is so that mutations can work well and prevent async IO issues
        """
        fill = self.fill(**kwargs)
        updated = await fill.save()
        if updated:
            updated = await self.get(uid=updated.uid)
        return updated

    @classmethod
    async def bulk_update_where(cls, update_data: List, filters: Dict):
        """
        @param update_data a List of dictionary update values.
        @param filters is a dict of filter values.
        e.g [{'uid': 34, update_values}, ...]
        """
        to_update = [cls._import(data) for data in update_data]

        # stmt = update(cls).where(filters).values(to_save).execution_options(synchronize_session="fetch")
        query = smart_query(query=update(cls), filters=filters)
        stmt = query.values(to_update).execution_options(synchronize_session="fetch")

        async with async_session_factory() as session:
            results = await session.execute(stmt)
        updated = results.scalars().all()
        return updated

    @classmethod
    async def bulk_update_with_mappings(cls, mappings: List):
        """
        @param mappings a List of dictionary update values with pks.
        e.g [{'uid': 34, update_values}, ...]
        ?? there must be zero many to many relations
        """
        from sqlalchemy.sql.expression import bindparam
        to_update = [cls._import(data) for data in mappings]
        for item in to_update:
            item["_uid"] = item["uid"]

        query = update(cls).where(cls.uid == bindparam('_uid'))

        binds = {}
        for key in to_update[0]:
            if key != "_uid":
                binds[key] = bindparam(key)

        stmt = query.values(binds).execution_options(synchronize_session="fetch")

        async with async_session_factory() as session:
            results = await session.execute(stmt, to_update)
            await session.flush()
            await session.commit()

        return results.scalars.all()

    @classmethod
    async def bulk_update_with_mappings_not_working(cls, mappings: List):
        """
        @param mappings a List of dictionary update values with pks.
        e.g [{'uid': 34, update_values}, ...]
        """
        to_update = [cls._import(data) for data in mappings]

        async with async_session_factory() as session:
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
        async with async_session_factory() as session:
            stmt = (
                table.insert()
            )
            await session.execute(stmt, mappings)
            await session.commit()
            await session.flush()

    @classmethod
    async def get_related(cls, related: Optional[list] = None, **kwargs):
        """Return the first value in database based on given args.
        """
        try:
            del kwargs['related']
        except KeyError:
            pass

        stmt = cls.where(**kwargs)
        if related:
            stmt.options(selectinload(related))

        async with async_session_factory() as session:
            results = await session.execute(stmt)
        found = results.scalars().first()
        return found

    @classmethod
    def _import(cls, schema_in: Union[InDBSchemaType, Dict]):
        """Convert Pydantic schema to dict"""
        if isinstance(schema_in, dict):
            return schema_in
        data = schema_in.dict(exclude_unset=True)
        return data

    async def save(self):
        """Saves the updated model to the current entity db.
        """
        async with async_session_factory() as session:
            try:
                session.add(self)
                await session.flush()
                await session.commit()
            except Exception as e:
                await session.rollback()
                raise
        return self

    async def flush_commit_session(self):
        """Saves the updated model to the current entity db.
        """
        async with async_session_factory() as session:
            try:
                await session.flush()
                await session.commit()
            except Exception as e:
                await session.rollback()
                raise
        return self

    @classmethod
    async def save_all(cls, items):
        async with async_session_factory() as session:
            try:
                session.add_all(items)
                await session.flush()
                await session.commit()
            except Exception as e:
                await session.rollback()
                raise
        return items

    @classmethod
    async def get_one(cls, **kwargs):
        stmt = cls.where(**kwargs)
        async with async_session_factory() as session:
            results = await session.execute(stmt)
        found = results.scalars().first()
        return found

    @classmethod
    async def get_all(cls, **kwargs):
        stmt = cls.where(**kwargs)
        async with async_session_factory() as session:
            results = await session.execute(stmt)
        return results.unique().scalars().all()

    @classmethod
    async def count_where(cls, filters):
        """
        :param filters:
        :return: int
        """
        # stmt = smart_query(select(cls), filters=filters)
        # stmt = select(func.count(cls.uid))
        # stmt = select(func.count('*')).select_from(cls)
        # stmt = select(cls, func.count(cls.uid))
        # stmt = select(cls).with_only_columns([func.count(cls.uid)]).order_by(None)
        # stmt = select(func.count()).select_from(cls)
        # stmt = select(func.count()).select_from(select(cls).subquery())
        # stmt = select(func.count(cls.uid)).select_from(cls)
        filter_stmt = smart_query(query=select(cls), filters=filters)
        count_stmt = select(func.count(filter_stmt.c.uid)).select_from(filter_stmt)
        async with async_session_factory() as session:
            res = await session.execute(count_stmt)
        count = res.scalars().one()
        return count

    @classmethod
    async def fulltext_search(cls, search_string, field):
        """Full-text Search with PostgreSQL"""
        stmt = select(cls).filter(
            func.to_tsvector('english', getattr(cls, field)).match(search_string, postgresql_regconfig='english')
        )
        async with async_session_factory() as session:
            results = await session.execute(stmt)
        search = results.scalars().all()
        return search

    @classmethod
    async def get_by_uids(cls, uids: List[Any]) -> AsyncIterator[Any]:

        stmt = (
            select(cls).where(cls.uid.in_(uids))  # type: ignore
        )

        async with async_session_factory() as session:
            stream = await session.stream(stmt.order_by(cls.uid))
        async for row in stream:
            yield row

    @classmethod
    async def stream_all(cls) -> AsyncIterator[Any]:
        stmt = select(cls)
        async with async_session_factory() as session:
            stream = await session.stream(stmt.order_by(cls.uid))
        async for row in stream:
            yield row

    @staticmethod
    def psql_records_to_dict(self, records, many=False):
        # records._row: asyncpg.Record / databases.backends.postgres.Record
        if not many and records:
            return dict(records)
        return [dict(record) for record in records]

    @classmethod
    async def paginate_with_cursors(cls, page_size: int = None, after_cursor: Any = None, before_cursor: Any = None,
                                    filters: Any = None, sort_by: List[str] = None,
                                    get_related: str = None) -> PageCursor:
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
        _filters = None
        if isinstance(filters, dict):
            _filters = [
                {sa_or_: cursor_limit},
                filters
            ] if cursor_limit else filters
        elif isinstance(filters, list):
            _filters = filters
            if cursor_limit:
                _filters.append({sa_or_: cursor_limit})

        stmt = cls.smart_query(filters=_filters, sort_attrs=sort_by)

        if get_related:
            stmt = stmt.options(selectinload(get_related))

        if page_size:
            stmt = stmt.limit(page_size)

        async with async_session_factory() as session:
            res = await session.execute(stmt)

        qs = res.scalars().all()

        if qs is not None:
            # items = qs[:page_size]
            items = qs
        else:
            qs = []
            items = []

        has_additional = len(items) == page_size if page_size else True  # len(qs) > len(items)s
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
            return decoded

    @classmethod
    def encode_cursor(cls, identifier: Any):
        return b64encode(str(identifier).encode('utf8')).decode('ascii')
