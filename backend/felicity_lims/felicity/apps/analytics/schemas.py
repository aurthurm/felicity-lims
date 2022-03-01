from typing import List, Optional, Union
from pydantic import BaseModel
from datetime import datetime
from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.analysis.schemas import Analysis
from felicity.apps.analytics import conf


class ReportMetaBase(BaseAuditModel):
    period_start: datetime
    period_end: datetime
    date_column: str
    sample_states: Optional[str]
    report_type: str = conf.report_types.LINE_LISTING
    status: Optional[str] = conf.report_states.PENDING
    analyses: Optional[List[Analysis]] = None


class ReportMeta(ReportMetaBase):
    uid: Optional[int] = None
    location: Union[str, None]

    class Config:
        orm_mode = True


class ReportMetaCreate(ReportMetaBase):
    temp: str
    created_by_uid: int
    updated_by_uid: int


class ReportMetaUpdate(ReportMetaBase):
    pass


class ReportMetaDeleted(BaseModel):
    uid: int
    message: str


class ReportRequest(BaseModel):
    report_type: str
    analyses_uids: List[int]
    sample_states: List[str]
    date_column: str
    period_start: datetime
    period_end: datetime
