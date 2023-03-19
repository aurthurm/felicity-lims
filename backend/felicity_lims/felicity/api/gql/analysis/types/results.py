from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql import PageInfo
from felicity.api.gql.analysis.types.analysis import AnalysisType, QCSetType, SampleType
from felicity.api.gql.setup.types import InstrumentType, MethodType
from felicity.core.uid_gen import FelicityID
from felicity.api.gql.user.types import UserType


@strawberry.type
class AnalysisResultType:
    uid: FelicityID
    sample_uid: FelicityID
    sample: SampleType
    worksheet_uid: Optional[FelicityID]
    worksheet_position: Optional[int]
    assigned: bool
    analysis_uid: Optional[FelicityID]
    analysis: Optional[AnalysisType]
    instrument_uid: Optional[FelicityID]
    instrument: Optional[InstrumentType]
    method_uid: Optional[FelicityID]
    method: Optional[MethodType]
    result: Optional[str]
    analyst_uid: Optional[FelicityID]
    analyst: Optional[UserType]
    submitted_by_uid: Optional[FelicityID]
    submitted_by: Optional[UserType]
    date_submitted: Optional[datetime]
    verified_by: Optional[List[UserType]]
    date_verified: Optional[datetime]
    invalidated_by: Optional[UserType]
    invalidated_by_uid: Optional[FelicityID]
    date_invalidated: Optional[datetime]
    due_date: Optional[datetime]
    date_cancelled: Optional[datetime]
    cancelled_by_uid: Optional[FelicityID]
    cancelled_by: Optional[UserType]
    retest: bool
    parent_id: Optional[int]
    parent: Optional["AnalysisResultType"]
    reportable: bool
    status: Optional[str]
    reflex_level: Optional[int]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class SamplesWithResults(SampleType):
    analysis_results: Optional[List[AnalysisResultType]]


@strawberry.type
class SampleEdge:
    cursor: str
    node: SamplesWithResults


@strawberry.type
class SampleCursorPage:
    page_info: PageInfo
    edges: Optional[List[SampleEdge]]
    items: Optional[List[SamplesWithResults]]
    total_count: int


@strawberry.type
class AnalysisResultEdge:
    cursor: str
    node: AnalysisResultType


@strawberry.type
class AnalysisResultCursorPage:
    page_info: PageInfo
    edges: Optional[List[AnalysisResultEdge]]
    items: Optional[List[AnalysisResultType]]
    total_count: int


@strawberry.type
class QCSetWithSamples(QCSetType):
    samples: Optional[List[SamplesWithResults]]


@strawberry.type
class QCSetEdge:
    cursor: str
    node: QCSetWithSamples


@strawberry.type
class QCSetCursorPage:
    page_info: PageInfo
    edges: Optional[List[QCSetEdge]]
    items: Optional[List[QCSetWithSamples]]
    total_count: int
