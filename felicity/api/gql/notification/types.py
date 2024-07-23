from typing import List, Optional, Union

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.analysis.types.results import AnalysisResultType
from felicity.api.gql.analytics.types import ReportMetaType
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.user.types import GroupType, UserType
from felicity.api.gql.worksheet.types import WorkSheetType
from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.analytics.entities import ReportMeta
from felicity.apps.worksheet.entities import WorkSheet


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
    created_at: str | None
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
                    exclude=[
                        "right",
                        "left",
                        "tree_id",
                        "level",
                        "worksheet",
                        "submitted_by_name",
                        "verified_by_name",
                    ]
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
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
