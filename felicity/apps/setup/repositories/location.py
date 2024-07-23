import sqlalchemy as sa

from felicity.apps.setup.entities import Country, Province, District
from felicity.database.paging import PageCursor
from felicity.apps.abstract.repository import BaseRepository


class CountryRepository(BaseRepository[Country]):
    def __init__(self) -> None:
        super().__init__(Country)


class ProvinceRepository(BaseRepository[Province]):
    def __init__(self) -> None:
        super().__init__(Province)

    async def paginate_with_cursors(
            self,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
            **kwargs,
    ) -> PageCursor:
        filters = {}

        _or_ = dict()
        if text:
            arg_list = [
                "name__ilike",
                "code__ilike",
                "email__ilike",
                "email_cc__ilike",
                "mobile_phone__ilike",
                "business_phone__ilike",
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        return super().paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class DistrictRepository(BaseRepository[District]):
    def __init__(self) -> None:
        super().__init__(District)

    async def paginate_with_cursors(
            self,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
            **kwargs,
    ) -> PageCursor:
        filters = {}

        _or_ = dict()
        if text:
            arg_list = [
                "name__ilike",
                "code__ilike",
                "email__ilike",
                "email_cc__ilike",
                "mobile_phone__ilike",
                "business_phone__ilike",
                "province___name__ilike",
                "province___code__ilike",
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        return super().paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )
