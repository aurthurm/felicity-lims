from datetime import datetime
from typing import Optional

import strawberry  # noqa
from api.gql.types import PageInfo
from api.gql.analysis.types.analysis import AnalysisType, QCSetType, SampleType
from api.gql.instrument.types import InstrumentType, MethodType
from api.gql.user.types import UserType
from apps.worksheet import models as ws_models



@strawberry.type
class AnalysisResultType:
    uid: str
    sample_uid: str
    sample: SampleType
    worksheet_uid: str | None
    worksheet_position: int | None
    assigned: bool
    analysis_uid: str | None
    analysis: AnalysisType | None
    instrument_uid: str | None
    instrument: InstrumentType | None
    method_uid: str | None
    method: MethodType | None
    result: str | None
    analyst_uid: str | None
    analyst: UserType | None
    submitted_by_uid: str | None
    submitted_by: UserType | None
    date_submitted: datetime | None
    verified_by: list[UserType] | None
    date_verified: datetime | None
    invalidated_by: UserType | None
    invalidated_by_uid: str | None
    date_invalidated: datetime | None
    due_date: datetime | None
    date_cancelled: datetime | None
    cancelled_by_uid: str | None
    cancelled_by: UserType | None
    retest: bool
    parent_id: str | None
    parent: Optional["AnalysisResultType"]
    reportable: bool
    status: str | None
    reflex_level: int | None
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None

    @strawberry.field
    async def worksheet_id(self, info) -> str | None:
        ws = await ws_models.WorkSheet.get(uid=self.worksheet_uid)
        return ws.worksheet_id if ws else None


@strawberry.type
class SamplesWithResults(SampleType):
    analysis_results: list[AnalysisResultType] | None


@strawberry.type
class SampleEdge:
    cursor: str
    node: SamplesWithResults


@strawberry.type
class SampleCursorPage:
    page_info: PageInfo
    edges: list[SampleEdge] | None
    items: list[SamplesWithResults] | None
    total_count: int


@strawberry.type
class AnalysisResultEdge:
    cursor: str
    node: AnalysisResultType


@strawberry.type
class AnalysisResultCursorPage:
    page_info: PageInfo
    edges: list[AnalysisResultEdge] | None
    items: list[AnalysisResultType] | None
    total_count: int


@strawberry.type
class QCSetWithSamples(QCSetType):
    # samples: list[SampleEdge] | None
    samples: list[SamplesWithResults] | None


@strawberry.type
class QCSetEdge:
    cursor: str
    node: QCSetWithSamples


@strawberry.type
class QCSetCursorPage:
    page_info: PageInfo
    edges: list[QCSetEdge] | None
    items: list[QCSetWithSamples] | None
    total_count: int
