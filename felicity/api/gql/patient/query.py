from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa

from felicity.api.gql.patient.types import (IdentificationType,
                                            PatientCursorPage, PatientEdge,
                                            PatientType)
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import PageInfo
from felicity.apps.patient.services import (IdentificationService,
                                            PatientService)
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class PatientQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def patient_all(
        self,
        info,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
    ) -> PatientCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
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

        page = await PatientService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[PatientEdge[PatientType]] = page.edges
        items: List[PatientType] = page.items
        page_info: PageInfo = page.page_info

        return PatientCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def patient_by_uid(self, info, uid: str) -> Optional[PatientType]:
        return await PatientService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def patient_by_patient_id(
        self, info, patient_id: str
    ) -> Optional[PatientType]:
        return await PatientService().get(patient_id=patient_id)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def patient_search(self, info, query_string: str) -> List[PatientType]:
        filters = [
            "first_name__ilike",
            "middle_name__ilike",
            "last_name__ilike",
            "patient_id__ilike",
            "client_patient_id__ilike",
            "phone_mobile__ilike",
            "phone_home__ilike",
        ]
        combined = set()
        for _filter in filters:
            arg = dict()
            arg[_filter] = f"%{query_string}%"
            query = await PatientService().get_all(**arg)
            for item in query:
                combined.add(item)
        return list(combined)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def identification_all(self, info) -> List[IdentificationType]:
        return await IdentificationService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def identification_by_uid(self, info, uid: str) -> IdentificationType:
        return await IdentificationService().get(uid=uid)
