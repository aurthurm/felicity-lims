import sqlalchemy as sa

from domain.setup.ports.repository import (
    ICountryRepository,
    IProvinceRepository,
    IDistrictRepository,
)
from domain.shared.ports.paginator.cursor import PageCursor
from felicity.apps.repository.base import BaseRepository
from felicity.apps.setup.entities import Country, Province, District


class CountryRepository(BaseRepository[Country], ICountryRepository):
    def __init__(self) -> None:
        self.model = Country
        super().__init__()


class ProvinceRepository(BaseRepository[Province], IProvinceRepository):
    def __init__(self) -> None:
        self.model = Province
        super().__init__()

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

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class DistrictRepository(BaseRepository[District], IDistrictRepository):
    def __init__(self) -> None:
        self.model = District
        super().__init__()

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

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )
