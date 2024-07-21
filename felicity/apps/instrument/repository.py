import sqlalchemy as sa


from felicity.apps.instrument.entities import (
    InstrumentCompetence,
    LaboratoryInstrument,
    Method,
    Instrument,
    InstrumentType,
    InstrumentCalibration,
    CalibrationCertificate,
)
from felicity.apps.abstract import BaseRepository
from felicity.database.paging import PageCursor

SEQUENCE_BEGIN = 5
SEQUENCE_CUTOFF = 10


class MethodRepository(BaseRepository[Method]):
    def __init__(self) -> None:
        super().__init__(Method)

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

        return await super().paginate_with_cursors(
            page_size, after_cursor, before_cursor, filters, sort_by
        )


class InstrumentRepository(BaseRepository[Instrument]):
    def __init__(self) -> None:
        super().__init__(Instrument)

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

        return await super().paginate_with_cursors(
            page_size, after_cursor, before_cursor, filters, sort_by
        )

class LaboratoryInstrumentRepository(
    BaseRepository[LaboratoryInstrument],
):
    def __init__(self,):
        super().__init__(LaboratoryInstrument)


class InstrumentTypeRepository(
    BaseRepository[InstrumentType]
):
    def __init__(self) -> None:
        super().__init__(InstrumentType)

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

        return await super().paginate_with_cursors(
            page_size, after_cursor, before_cursor, filters, sort_by
        )


class InstrumentCalibrationRepository(
    BaseRepository[InstrumentCalibration]
):
    def __init__(self) -> None:
        super().__init__(InstrumentCalibration)


class CalibrationCertificateRepository(
    BaseRepository[CalibrationCertificate]
):
    def __init__(self) -> None:
        super().__init__(CalibrationCertificate)


class InstrumentCompetenceRepository(
    BaseRepository[InstrumentCompetence],
):
    def __init__(self,):
        super().__init__(InstrumentCompetence)

