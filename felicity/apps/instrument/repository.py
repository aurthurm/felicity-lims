import sqlalchemy as sa

from domain.instrument.ports.repository import (
    IMethodRepository,
    IInstrumentRepository,
    IInstrumentTypeRepository,
    IInstrumentCalibrationRepository,
    ICalibrationCertificateRepository,
)
from domain.shared.ports.paginator.cursor import PageCursor
from infrastructure.database.instrument.entities import (
    Method,
    Instrument,
    InstrumentType,
    InstrumentCalibration,
    CalibrationCertificate,
)
from infrastructure.database.repository.base import BaseRepository

SEQUENCE_BEGIN = 5
SEQUENCE_CUTOFF = 10


class MethodRepository(BaseRepository[Method], IMethodRepository):
    def __init__(self) -> None:
        self.model = Method
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
            arg_list = ["name__ilike", "keywork__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        return await super().paginate(
            page_size, after_cursor, before_cursor, filters, sort_by
        )


class InstrumentRepository(BaseRepository[Instrument], IInstrumentRepository):
    def __init__(self) -> None:
        self.model = Instrument
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

        return await super().paginate(
            page_size, after_cursor, before_cursor, filters, sort_by
        )


class InstrumentTypeRepository(
    BaseRepository[InstrumentType], IInstrumentTypeRepository
):
    def __init__(self) -> None:
        self.model = InstrumentType
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
            arg_list = ["name__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        return await super().paginate(
            page_size, after_cursor, before_cursor, filters, sort_by
        )


class InstrumentCalibrationRepository(
    BaseRepository[InstrumentCalibration], IInstrumentCalibrationRepository
):
    def __init__(self) -> None:
        self.model = InstrumentCalibration
        super().__init__()


class CalibrationCertificateRepository(
    BaseRepository[CalibrationCertificate], ICalibrationCertificateRepository
):
    def __init__(self) -> None:
        self.model = CalibrationCertificate
        super().__init__()
