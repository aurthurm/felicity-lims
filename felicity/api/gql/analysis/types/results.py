from datetime import datetime
from typing import Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import AnalysisType, QCSetType, SampleType
from felicity.api.gql.instrument.types import LaboratoryInstrumentType, MethodType
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.worksheet.services import WorkSheetService


@strawberry.type
class AnalysisResultType:
    uid: str
    sample_uid: str
    sample: SampleType
    worksheet_uid: str | None = None
    worksheet_position: int | None = None
    assigned: bool
    analysis_uid: str | None = None
    analysis: AnalysisType | None = None
    laboratory_instrument_uid: str | None = None
    laboratory_instrument: LaboratoryInstrumentType | None = None
    method_uid: str | None = None
    method: MethodType | None = None
    result: str | None = None
    analyst_uid: str | None = None
    analyst: UserType | None = None
    submitted_by_uid: str | None = None
    submitted_by: UserType | None = None
    date_submitted: datetime | None = None
    verified_by: list[UserType] | None = None
    date_verified: datetime | None = None
    invalidated_by: UserType | None = None
    invalidated_by_uid: str | None = None
    date_invalidated: datetime | None = None
    due_date: str | None = None
    date_cancelled: datetime | None = None
    cancelled_by_uid: str | None = None
    cancelled_by: UserType | None = None
    retest: bool
    parent_id: str | None = None
    parent: Optional["AnalysisResultType"] = None
    reportable: bool
    status: str | None = None
    reflex_level: int | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None

    @strawberry.field
    async def worksheet_id(self, info) -> str | None:
        ws = await WorkSheetService().get(uid=self.worksheet_uid)
        return ws.worksheet_id if ws else None


@strawberry.type
class SamplesWithResults(SampleType):
    analysis_results: list[AnalysisResultType] | None = None


@strawberry.type
class SampleEdge:
    cursor: str
    node: SamplesWithResults


@strawberry.type
class SampleCursorPage:
    page_info: PageInfo
    edges: list[SampleEdge] | None = None
    items: list[SamplesWithResults] | None = None
    total_count: int


@strawberry.type
class AnalysisResultEdge:
    cursor: str
    node: AnalysisResultType


@strawberry.type
class AnalysisResultCursorPage:
    page_info: PageInfo
    edges: list[AnalysisResultEdge] | None = None
    items: list[AnalysisResultType] | None = None
    total_count: int


@strawberry.type
class QCSetWithSamples(QCSetType):
    # samples: list[SampleEdge] | None = None
    samples: list[SamplesWithResults] | None = None


@strawberry.type
class QCSetEdge:
    cursor: str
    node: QCSetWithSamples


@strawberry.type
class QCSetCursorPage:
    page_info: PageInfo
    edges: list[QCSetEdge] | None = None
    items: list[QCSetWithSamples] | None = None
    total_count: int


@strawberry.type
class ResultMutationType:
    uid: str
    result_uid: str
    before: str
    after: str
    mutation: str
    date: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
