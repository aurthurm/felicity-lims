import json
from datetime import datetime
from typing import Any, List, NewType, Optional

import strawberry  # noqa
from felicity.api.gql import PageInfo
from felicity.api.gql.analysis.types.analysis import (AnalysisType,
                                                      QCLevelType,
                                                      QCTemplateType,
                                                      SampleTypeTyp)
from felicity.api.gql.analysis.types.results import AnalysisResultType
from felicity.api.gql.setup.types import InstrumentType
from felicity.api.gql.user.types import UserType

JSONScalar = strawberry.scalar(
    NewType("JSONScalar", Any),
    serialize=lambda v: v,
    parse_value=lambda v: json.loads(v),
    description="json field",
)


@strawberry.type
class WorkSheetTemplateType:
    uid: int
    worksheet_type: str
    reserved: Optional[JSONScalar]
    plate: Optional[JSONScalar]
    number_of_samples: Optional[int]
    rows: Optional[int]
    cols: Optional[int]
    row_wise: bool
    state: Optional[str]
    name: str
    description: Optional[str]
    analysis_uid: Optional[int]
    analysis: Optional[AnalysisType]
    qc_template_uid: Optional[int]
    qc_template: Optional[QCTemplateType]
    qc_levels: Optional[List[QCLevelType]]
    instrument_uid: Optional[int]
    instrument: Optional[InstrumentType]
    sample_type_uid: Optional[int]
    sample_type: Optional[SampleTypeTyp]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class WorkSheetType:
    uid: int
    worksheet_type: str
    reserved: Optional[JSONScalar]
    plate: Optional[JSONScalar]
    number_of_samples: Optional[int]
    rows: Optional[int]
    cols: Optional[int]
    row_wise: bool
    state: Optional[str]
    template_uid: Optional[int]
    template: Optional[WorkSheetTemplateType]
    analyst_uid: Optional[int]
    analyst: Optional[UserType]
    worksheet_id: str
    analysis_uid: Optional[int]
    analysis: Optional[AnalysisType]
    instrument_uid: Optional[int]
    instrument: Optional[InstrumentType]
    sample_type_uid: Optional[int]
    sample_type: Optional[SampleTypeTyp]
    assigned_count: int
    analysis_results: Optional[List[AnalysisResultType]]
    submitted_by_uid: Optional[int]
    submitted_by: Optional[UserType]
    date_submitted: Optional[datetime]
    verified_by_uid: Optional[int]
    verified_by: Optional[UserType]
    date_verified: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


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
