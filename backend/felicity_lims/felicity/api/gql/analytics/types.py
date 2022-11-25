from typing import List, Optional
from datetime import datetime
import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import AnalysisType
from felicity.api.gql.user.types import UserType


@strawberry.type
class Nothing:
    data: Optional[str]


@strawberry.type
class GroupCount:
    group: str
    count: Optional[int]


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
    total_samples: Optional[int]
    total_late: Optional[int]
    total_not_late: Optional[int]
    process_average: Optional[int]
    avg_extra_days: Optional[int]
    service: Optional[str] = None


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
    lessThanTen: Optional[int]
    tenToTwenty: Optional[int]
    twentyToThirty: Optional[int]
    graterThanThirty: Optional[int]
    #
    total_incomplete: Optional[int] = None
    total_delayed: Optional[int] = None
    total_not_delayed: Optional[int] = None


@strawberry.type
class LaggardData:
    category: str
    counts: Optional[LaggardCounts]


@strawberry.type
class LaggardStatistics:
    data: List[LaggardData]


@strawberry.type
class ReportMetaType:
    uid: int
    period_start: datetime
    period_end: datetime
    date_column: str
    location: Optional[str]
    sample_states: Optional[str]
    report_type: str
    status: Optional[str]
    temp: Optional[str]
    analyses: Optional[List[AnalysisType]]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]