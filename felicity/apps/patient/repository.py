import sqlalchemy as sa


from felicity.apps.patient.entities import (
    Patient,
    Identification,
    PatientIdentification,
)
from felicity.database.paging import PageCursor
from felicity.apps.abstract.repository import BaseRepository


class PatientRepository(BaseRepository[Patient]):
    def __init__(self) -> None:
        super().__init__(Patient)

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
                "first_name__ilike",
                "last_name__ilike",
                "middle_name__ilike",
                "client_patient_id__ilike",
                "patient_id__ilike",
                "client___name__ilike",
                "patient_id__ilike",
                "email__ilike",
                "phone_mobile__ilike",
                "phone_home__ilike",
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        return await super().paginate_with_cursors(
            page_size, after_cursor, before_cursor, filters, sort_by
        )


class IdentificationRepository(
    BaseRepository[Identification]
):
    def __init__(self) -> None:
        super().__init__(Identification)


class PatientIdentificationRepository(
    BaseRepository[PatientIdentification]
):
    def __init__(self) -> None:
        super().__init__(PatientIdentification)
