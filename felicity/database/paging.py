import logging
from typing import List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EdgeNode:
    def __init__(self, cursor: str = None, node: dict = None):
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
        items: List[dict] = None,
        page_info: PageInfo = None,
    ):
        self.total_count = total_count
        self.edges = edges
        self.items = items
        self.page_info = page_info
