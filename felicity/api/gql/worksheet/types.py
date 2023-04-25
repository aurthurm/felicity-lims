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
from core.uid_gen import FelicityID


@strawberry.type
class WorkSheetTemplateType:
    uid: FelicityID
    worksheet_type: str
    reserved: Optional[JSONScalar]
    number_of_samples: int | None
    rows: int | None
    cols: int | None
    row_wise: bool
    state: str | None
    name: str
    description: str | None
    analysis_uid: FelicityID | None
    analysis: AnalysisType | None
    qc_template_uid: FelicityID | None
    qc_template: Optional[QCTemplateType]
    qc_levels: Optional[List[QCLevelType]]
    instrument_uid: FelicityID | None
    instrument: InstrumentType | None
    sample_type_uid: FelicityID | None
    sample_type: Optional[SampleTypeTyp]
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class WorkSheetType:
    uid: FelicityID
    worksheet_type: str
    reserved: Optional[JSONScalar]
    number_of_samples: int | None
    rows: int | None
    cols: int | None
    row_wise: bool
    state: str | None
    template_uid: FelicityID | None
    template: Optional[WorkSheetTemplateType]
    analyst_uid: FelicityID | None
    analyst: UserType | None
    worksheet_id: str
    analysis_uid: FelicityID | None
    analysis: AnalysisType | None
    instrument_uid: FelicityID | None
    instrument: InstrumentType | None
    sample_type_uid: FelicityID | None
    sample_type: Optional[SampleTypeTyp]
    assigned_count: int
    analysis_results: list[AnalysisResultType] | None
    submitted_by_uid: FelicityID | None
    submitted_by: UserType | None
    date_submitted: datetime | None
    verified_by_uid: FelicityID | None
    verified_by: UserType | None
    date_verified: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
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
