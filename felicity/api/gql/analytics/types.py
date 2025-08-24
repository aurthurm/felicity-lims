from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import AnalysisType
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.user.types import UserType


@strawberry.type
class Nothing:
    data: str | None = None


@strawberry.type
class GroupCount:
    group: str
    count: int | None = None


@strawberry.type
class GroupData:
    group: str
    counts: Optional[List[GroupCount]] = None


@strawberry.type
class GroupedCounts:
    data: List[GroupCount]


@strawberry.type
class GroupedData:
    data: List[GroupData]


@strawberry.type
class ProcessCounts:
    total_samples: int | None = None
    total_late: int | None = None
    total_not_late: int | None = None
    process_average: int | None = None
    avg_extra_days: int | None = None
    service: str | None = None


@strawberry.type
class ProcessData:
    process: str
    counts: Optional[ProcessCounts] = None
    groups: Optional[List[ProcessCounts]] = None


@strawberry.type
class ProcessStatistics:
    data: List[ProcessData]


@strawberry.type
class LaggardCounts:
    lessThanTen: int | None = None
    tenToTwenty: int | None = None
    twentyToThirty: int | None = None
    graterThanThirty: int | None = None
    #
    total_incomplete: int | None = None
    total_delayed: int | None = None
    total_not_delayed: int | None = None


@strawberry.type
class LaggardData:
    category: str
    counts: Optional[LaggardCounts] = None


@strawberry.type
class LaggardStatistics:
    data: List[LaggardData]


@strawberry.type
class ReportMetaType:
    uid: str
    period_start: datetime
    period_end: datetime
    date_column: str
    location: str | None = None
    sample_states: str | None = None
    report_type: str
    status: str | None = None
    temp: str | None = None
    analyses: Optional[List[AnalysisType]] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
