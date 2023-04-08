import logging
from base64 import b64decode, b64encode
from typing import Any, Dict, List

from sqlalchemy.future import select

from felicity.database.async_mixins.smartquery import SmartQueryMixin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EdgeNode:
    def __init__(self, cursor: str = None, node: Dict = None):
        self.cursor = cursor
        self.node = node


class PageInfo:
    def __init__(
        self,
        start_cursor: str = None,
        end_cursor: str = None,
        has_next_page: bool = False,
        has_previous_page: bool = False,
    ):
        self.start_cursor = start_cursor
        self.end_cursor = end_cursor
        self.has_next_page = has_next_page
        self.has_previous_page = has_previous_page


class PageCursor:
    def __init__(
        self,
        total_count: int = 0,
        edges: List[EdgeNode] = None,
        items: List[Dict] = None,
        page_info: PageInfo = None,
    ):
        self.total_count = total_count
        self.edges = edges
        self.items = items
        self.page_info = page_info


class CursorPaginationMixin(SmartQueryMixin):
    __abstract__ = True

    @classmethod
    async def paginate_with_cursors(
        cls,
        page_size: int = None,
        after_cursor: Any = None,
        before_cursor: Any = None,
        filters: Dict = None,
        sort_by: List[str] = None,
    ):
        total_count: int = (await cls.session.execute(select(cls))).scalar().count()
        items = None

        if page_size is None:
            qs = await cls.all()
            if qs:
                items = list(qs)
            return PageCursor(
                **{
                    "total_count": total_count,
                    "edges": cls.build_edges(items=items),
                    "page_info": cls.build_page_info(
                        **{
                            "start_cursor": cls.encode_cursor(items[0].uid)
                            if qs
                            else None,
                            "end_cursor": cls.encode_cursor(items[-1].uid)
                            if qs
                            else None,
                        }
                    ),
                }
            )

        cursor_limit = {}
        if after_cursor is not None:
            cursor_limit = {"uid__gt": cls.decode_cursor(after_cursor)}

        if before_cursor is not None:
            cursor_limit = {"uid__lt": cls.decode_cursor(before_cursor)}

        filters = {**cursor_limit, **filters}

        qs = cls.smart_query(filters=filters, sort_attrs=sort_by).all()
        if qs:
            qs = list(qs)
            items = qs[:page_size]
        else:
            qs = []
            items = []

        has_additional = len(qs) > len(items)
        page_info = {
            "start_cursor": cls.encode_cursor(items[0].uid),
            "end_cursor": cls.encode_cursor(items[-1].uid),
        }
        if page_size is not None:
            page_info["has_next_page"] = has_additional
            page_info["has_previous_page"] = bool(after_cursor)

        return PageCursor(
            **{
                "total_count": total_count,
                "edges": cls.build_edges(items=items),
                "page_info": cls.build_page_info(**page_info),
            }
        )

    @classmethod
    def build_edges(cls, items: List[Any]):
        if not items:
            return []
        return [cls.build_node(item) for item in items]

    @classmethod
    def build_node(cls, item: Any):
        return EdgeNode(**{"cursor": cls.encode_cursor(item.uid), "node": item})

    @classmethod
    def build_page_info(
        cls,
        first_cursor: str = None,
        last_cursor: str = None,
        has_next_page: bool = False,
        has_previous_page: bool = False,
    ) -> PageInfo:
        return PageInfo(
            **{
                "start_cursor": first_cursor,
                "end_cursor": last_cursor,
                "has_next_page": has_next_page,
                "has_previous_page": has_previous_page,
            }
        )

    @classmethod
    def decode_cursor(cls, cursor):
        return b64decode(cursor.encode("ascii")).decode("utf8")

    @classmethod
    def encode_cursor(cls, identifier: Any):
        return b64encode(str(identifier).encode("utf8")).decode("ascii")
