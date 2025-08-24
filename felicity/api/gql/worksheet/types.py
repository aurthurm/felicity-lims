from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import (
    AnalysisType,
    QCLevelType,
    QCTemplateType,
    SampleTypeTyp,
)
from felicity.api.gql.analysis.types.results import AnalysisResultType
from felicity.api.gql.instrument.types import InstrumentType
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import JSONScalar, PageInfo
from felicity.api.gql.user.types import UserType


@strawberry.type
class WorkSheetTemplateType:
    uid: str
    worksheet_type: str
    reserved: Optional[JSONScalar] = None
    number_of_samples: int | None = None
    rows: int | None = None
    cols: int | None = None
    row_wise: bool
    state: str | None = None
    name: str
    description: str | None = None
    analysis_uid: str | None = None
    analysis: AnalysisType | None = None
    qc_template_uid: str | None = None
    qc_template: Optional[QCTemplateType] = None
    qc_levels: Optional[List[QCLevelType]] = None
    instrument_uid: str | None = None
    instrument: InstrumentType | None = None
    sample_type_uid: str | None = None
    sample_type: Optional[SampleTypeTyp] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class WorkSheetType:
    uid: str
    worksheet_type: str
    reserved: Optional[JSONScalar]
    number_of_samples: int | None = None
    rows: int | None = None
    cols: int | None = None
    row_wise: bool
    state: str | None = None
    template_uid: str | None = None
    template: Optional[WorkSheetTemplateType] = None
    analyst_uid: str | None = None
    analyst: UserType | None = None
    worksheet_id: str
    analysis_uid: str | None = None
    analysis: AnalysisType | None = None
    instrument_uid: str | None = None
    instrument: InstrumentType | None = None
    sample_type_uid: str | None = None
    sample_type: Optional[SampleTypeTyp] = None
    assigned_count: int
    analysis_results: list[AnalysisResultType] | None = None
    submitted_by_uid: str | None = None
    submitted_by: UserType | None = None
    date_submitted: datetime | None = None
    verified_by_uid: str | None = None
    verified_by: UserType | None = None
    date_verified: datetime | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


#  relay paginations
@strawberry.type
class WorkSheetEdge:
    cursor: str
    node: WorkSheetType


@strawberry.type
class WorkSheetCursorPage:
    page_info: PageInfo
    edges: Optional[List[WorkSheetEdge]] = None
    items: Optional[List[WorkSheetType]] = None
    total_count: int
