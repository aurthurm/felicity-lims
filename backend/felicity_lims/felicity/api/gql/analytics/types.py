from typing import List, Optional

import strawberry  # noqa


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
