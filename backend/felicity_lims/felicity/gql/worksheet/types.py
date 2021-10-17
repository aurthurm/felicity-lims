from datetime import datetime
import json
from typing import Optional, List, Any, NewType

import strawberry

from felicity.gql import PageInfo
from felicity.gql.analysis.types.analysis import ProfileType, AnalysisType, QCTemplateType, QCLevelType, SampleTypeTyp
from felicity.gql.analysis.types.results import AnalysisResultType
from felicity.gql.setup.types import InstrumentType
from felicity.gql.user.types import UserType


JSONScalar = strawberry.scalar(
    NewType("JSONScalar", Any),
    serialize=lambda v: v,
    parse_value=lambda v: json.loads(v),
    description="The GenericScalar scalar type represents a generic GraphQL scalar value that could be: List or Object."
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
    profiles: Optional[List[ProfileType]]
    analyses: Optional[List[AnalysisType]]
    qc_template_uid: Optional[int]
    qc_template: Optional[QCTemplateType]
    qc_levels: Optional[List[QCLevelType]]
    instrument_uid: Optional[int]
    instrument: Optional[InstrumentType]
    sample_type_uid: Optional[int]
    sample_type: Optional[SampleTypeTyp]


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
    profiles: Optional[List[ProfileType]]
    analyses: Optional[List[AnalysisType]]
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
