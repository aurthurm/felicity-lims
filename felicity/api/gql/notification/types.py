from datetime import datetime
from typing import List, Optional, Union

import strawberry  # noqa

from api.gql.analysis.types.analysis import SampleType
from api.gql.analysis.types.results import AnalysisResultType
from api.gql.analytics.types import ReportMetaType
from api.gql.setup.types.department import DepartmentType
from api.gql.user.types import GroupType, UserType
from api.gql.worksheet.types import WorkSheetType
from apps.analysis.models.analysis import Sample
from apps.analysis.models.results import AnalysisResult
from apps.analytics.models import ReportMeta
from apps.worksheet.models import WorkSheet


@strawberry.type
class UnknownObjectType:
    message: str


actionObject = strawberry.union(
    "actionObject",
    [WorkSheetType, SampleType, AnalysisResultType, ReportMetaType],
    description="Union of possible object types for streams",
)


@strawberry.type
class ActivityFeedType:
    uid: str
    name: str
    subscribers: list[UserType] | None


@strawberry.type
class ActivityStreamType:
    uid: str
    feeds: Optional[List[ActivityFeedType]]
    actor_uid: str | None
    actor: UserType | None
    verb: str | None
    action_object_type: str | None
    action_object_uid: str | None
    target_uid: str | None
    target: str | None
    viewers: list[UserType] | None
    created_at: datetime | None
    created_by_uid: str | None
    created_by: UserType | None

    @strawberry.field
    async def action_object(
            self, info
    ) -> Union[
        WorkSheetType, SampleType, AnalysisResultType, ReportMetaType, UnknownObjectType
    ]:
        if self.action_object_type == "sample":
            sample = await Sample.get(uid=self.action_object_uid)
            return SampleType(
                **sample.marshal_simple(
                    exclude=["right", "left", "tree_id", "level", "analysis_results"]
                ),
                parent=None,
            )

        if self.action_object_type == "worksheet":
            ws = await WorkSheet.get(uid=self.action_object_uid)
            return WorkSheetType(**ws.marshal_simple())

        if self.action_object_type == "result":
            result = await AnalysisResult.get(uid=self.action_object_uid)
            return AnalysisResultType(
                **result.marshal_simple(
                    exclude=["right", "left", "tree_id", "level", "worksheet", "submitted_by_name", "verified_by_name"]
                ),
                parent=None,
            )

        if self.action_object_type == "report":
            report = await ReportMeta.get(uid=self.action_object_uid)
            return ReportMetaType(**report.marshal_simple(exclude=[]))

        return UnknownObjectType(
            message=f"Please provide a resolver for object of type {self.action_object_type}"
        )


@strawberry.type
class NotificationType:
    uid: str
    departments: Optional[DepartmentType]
    groups: Optional[GroupType]
    users: UserType | None
    message: str
    viewers: UserType | None
    created_at: datetime | None
    created_by_uid: str | None
    created_by: UserType | None
