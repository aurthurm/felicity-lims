from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.analysis.types.analysis import (
    AnalysisType,
    QCLevelType,
    QCTemplateType,
    SampleTypeTyp,
)
from api.gql.analysis.types.results import AnalysisResultType
from api.gql.setup.types import InstrumentType
from api.gql.types import JSONScalar
from api.gql.user.types import UserType



@strawberry.type
class WorkSheetTemplateType:
    uid: str
    worksheet_type: str
    reserved: Optional[JSONScalar]
    number_of_samples: int | None
    rows: int | None
    cols: int | None
    row_wise: bool
    state: str | None
    name: str
    description: str | None
    analysis_uid: str | None
    analysis: AnalysisType | None
    qc_template_uid: str | None
    qc_template: Optional[QCTemplateType]
    qc_levels: Optional[List[QCLevelType]]
    instrument_uid: str | None
    instrument: InstrumentType | None
    sample_type_uid: str | None
    sample_type: Optional[SampleTypeTyp]
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class WorkSheetType:
    uid: str
    worksheet_type: str
    reserved: Optional[JSONScalar]
    number_of_samples: int | None
    rows: int | None
    cols: int | None
    row_wise: bool
    state: str | None
    template_uid: str | None
    template: Optional[WorkSheetTemplateType]
    analyst_uid: str | None
    analyst: UserType | None
    worksheet_id: str
    analysis_uid: str | None
    analysis: AnalysisType | None
    instrument_uid: str | None
    instrument: InstrumentType | None
    sample_type_uid: str | None
    sample_type: Optional[SampleTypeTyp]
    assigned_count: int
    analysis_results: list[AnalysisResultType] | None
    submitted_by_uid: str | None
    submitted_by: UserType | None
    date_submitted: datetime | None
    verified_by_uid: str | None
    verified_by: UserType | None
    date_verified: datetime | None
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


#  relay paginations
@strawberry.type
class WorkSheetEdge:
    cursor: str
    node: WorkSheetType


@strawberry.type
class WorkSheetCursorPage:
    page_info: PageInfo
    edges: Optional[List[WorkSheetEdge]]
    items: Optional[List[WorkSheetType]]
    total_count: int
