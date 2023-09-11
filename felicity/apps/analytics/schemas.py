from datetime import datetime

from apps.analysis.schemas import AnalysisBasic
from apps.analytics import conf
from apps.user.schemas import UserBasic

from pydantic import BaseModel


class ReportMetaBase(BaseModel):
    period_start: datetime
    period_end: datetime
    date_column: str
    sample_states: str | None
    report_type: str = conf.report_types.LINE_LISTING
    status: str | None = conf.report_states.PENDING
    analyses: list[AnalysisBasic] | None = None
    created_at: datetime | None = None
    created_by_uid: str | None = None
    created_by: UserBasic | None = None  # noqa
    updated_at: datetime | None = None
    updated_by_uid: str | None = None
    updated_by: UserBasic | None = None  # noqa


class ReportMeta(ReportMetaBase):
    uid: str | None = None
    location: str | None

    class Config:
        orm_mode = True


class ReportMetaCreate(ReportMetaBase):
    temp: str
    created_by_uid: str
    updated_by_uid: str


class ReportMetaUpdate(ReportMetaBase):
    pass


class ReportMetaDeleted(BaseModel):
    uid: str
    message: str


class ReportRequest(BaseModel):
    report_type: str
    analyses_uids: list[str]
    sample_states: list[str]
    date_column: str
    period_start: datetime
    period_end: datetime
