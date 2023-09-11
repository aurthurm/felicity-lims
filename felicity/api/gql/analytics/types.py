from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql.analysis.types.analysis import AnalysisType
from api.gql.user.types import UserType


@strawberry.type
class Nothing:
    data: str | None


@strawberry.type
class GroupCount:
    group: str
    count: int | None


@strawberry.type
class GroupData:
    group: str
    counts: Optional[List[GroupCount]]


@strawberry.type
class GroupedCounts:
    data: List[GroupCount]


@strawberry.type
class GroupedData:
    data: List[GroupData]


@strawberry.type
class ProcessCounts:
    total_samples: int | None
    total_late: int | None
    total_not_late: int | None
    process_average: int | None
    avg_extra_days: int | None
    service: str | None = None


@strawberry.type
class ProcessData:
    process: str
    counts: Optional[ProcessCounts]
    groups: Optional[List[ProcessCounts]]


@strawberry.type
class ProcessStatistics:
    data: List[ProcessData]


@strawberry.type
class LaggardCounts:
    lessThanTen: int | None
    tenToTwenty: int | None
    twentyToThirty: int | None
    graterThanThirty: int | None
    #
    total_incomplete: int | None = None
    total_delayed: int | None = None
    total_not_delayed: int | None = None


@strawberry.type
class LaggardData:
    category: str
    counts: Optional[LaggardCounts]


@strawberry.type
class LaggardStatistics:
    data: List[LaggardData]


@strawberry.type
class ReportMetaType:
    uid: str
    period_start: datetime
    period_end: datetime
    date_column: str
    location: str | None
    sample_states: str | None
    report_type: str
    status: str | None
    temp: str | None
    analyses: Optional[List[AnalysisType]]
    created_at: datetime | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
