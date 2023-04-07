from datetime import datetime
from typing import List, Optional, Union

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.analysis.types.results import AnalysisResultType
from felicity.api.gql.analytics.types import ReportMetaType
from felicity.api.gql.setup.types import DepartmentType
from felicity.api.gql.user.types import GroupType, UserType
from felicity.api.gql.worksheet.types import WorkSheetType
from felicity.apps.analysis.models.analysis import Sample
from felicity.apps.analysis.models.results import AnalysisResult
from felicity.apps.analytics.models import ReportMeta
from felicity.apps.worksheet.models import WorkSheet
from felicity.core.uid_gen import FelicityID


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
    uid: FelicityID
    name: str
    subscribers: Optional[List[UserType]]


@strawberry.type
class ActivityStreamType:
    uid: FelicityID
    feeds: Optional[List[ActivityFeedType]]
    actor_uid: Optional[FelicityID]
    actor: Optional[UserType]
    verb: Optional[str]
    action_object_type: Optional[str]
    action_object_uid: Optional[FelicityID]
    target_uid: Optional[FelicityID]
    target: Optional[str]
    viewers: Optional[List[UserType]]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]

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
                    exclude=["right", "left", "tree_id", "level", "worksheet"]
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
    uid: FelicityID
    departments: Optional[DepartmentType]
    groups: Optional[GroupType]
    users: Optional[UserType]
    message: str
    viewers: Optional[UserType]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
