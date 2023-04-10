from datetime import datetime
from typing import List, Optional, Union

from apps.analysis.schemas import AnalysisBasic
from apps.analytics import conf
from apps.user.schemas import UserBasic
from core.uid_gen import FelicityIDType
from pydantic import BaseModel


class ReportMetaBase(BaseModel):
    period_start: datetime
    period_end: datetime
    date_column: str
    sample_states: Optional[str]
    report_type: str = conf.report_types.LINE_LISTING
    status: Optional[str] = conf.report_states.PENDING
    analyses: Optional[List[AnalysisBasic]] = None
    created_at: Optional[datetime] = None
    created_by_uid: Optional[FelicityIDType] = None
    created_by: Optional[UserBasic] = None  # noqa
    updated_at: Optional[datetime] = None
    updated_by_uid: Optional[FelicityIDType] = None
    updated_by: Optional[UserBasic] = None  # noqa


class ReportMeta(ReportMetaBase):
    uid: Optional[FelicityIDType] = None
    location: Union[str, None]

    class Config:
        orm_mode = True


class ReportMetaCreate(ReportMetaBase):
    temp: str
    created_by_uid: FelicityIDType
    updated_by_uid: FelicityIDType


class ReportMetaUpdate(ReportMetaBase):
    pass


class ReportMetaDeleted(BaseModel):
    uid: FelicityIDType
    message: str


class ReportRequest(BaseModel):
    report_type: str
    analyses_uids: List[FelicityIDType]
    sample_states: List[str]
    date_column: str
    period_start: datetime
    period_end: datetime
