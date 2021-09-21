from datetime import datetime
from typing import Optional, List

import strawberry

from felicity.gql.analysis.types.analysis import ProfileType, AnalysisType, QCTemplateType, QCLevelType, SampleTypeTyp
from felicity.gql.setup.types import InstrumentType
from felicity.gql.user.types import UserType


@strawberry.type
class WorkSheetTemplateType:
    uid: int
    worksheet_type: str
    reserved: str
    plate: str
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
    reserved: str
    plate: str
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
    submitted_by_uid: Optional[int]
    submitted_by: Optional[UserType]
    date_submitted: Optional[datetime]
    verified_by_uid: Optional[int]
    verified_by: Optional[UserType]
    date_verified: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
