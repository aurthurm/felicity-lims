from typing import Optional, Union

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.analysis.types.results import AnalysisResultType
from felicity.api.gql.analytics.types import ReportMetaType
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.types.generic import StrawberryMapper
from felicity.api.gql.user.types import GroupType, UserType
from felicity.api.gql.worksheet.types import WorkSheetType
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.analytics.services import ReportMetaService
from felicity.apps.notification.enum import NotificationObjectType, NotificationObject
from felicity.apps.user.services import UserService
from felicity.apps.worksheet.services import WorkSheetService


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
    subscribers: list[UserType] | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class ActivityStreamType:
    uid: str
    feeds: Optional[list[ActivityFeedType]] = None
    actor_uid: str | None = None
    verb: str | None = None
    action_object_type: NotificationObjectType | None = None
    action_object_uid: str | None = None
    target_uid: str | None = None
    target: str | None = None
    viewers: list[UserType] | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def actor(self) -> UserType:
        return await UserService().get(uid=self.actor_uid)

    @strawberry.field
    async def action_object(
            self, info
    ) -> Union[
        WorkSheetType, SampleType, AnalysisResultType, ReportMetaType, UnknownObjectType
    ]:
        if self.action_object_type == NotificationObject.SAMPLE:
            sample = await SampleService().get(uid=self.action_object_uid)
            return StrawberryMapper[SampleType]().map(
                **sample.marshal_simple(
                    exclude=["right", "left", "tree_id", "level", "analysis_results"]
                ),
                parent=None,
            )

        if self.action_object_type == NotificationObject.WORKSHEET:
            ws = await WorkSheetService().get(uid=self.action_object_uid)
            return WorkSheetType(**ws.marshal_simple())

        if self.action_object_type == NotificationObject.ANALYSIS_RESULT:
            result = await AnalysisResultService().get(
                related=["sample"], uid=self.action_object_uid
            )
            return StrawberryMapper[AnalysisResultType]().map(
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

        if self.action_object_type == NotificationObject.REPORT:
            report = await ReportMetaService().get(uid=self.action_object_uid)
            return ReportMetaType(**report.marshal_simple(exclude=[]))

        return UnknownObjectType(
            message=f"Please provide a resolver for object of type {self.action_object_type}"
        )


@strawberry.type
class NotificationType:
    uid: str
    departments: Optional[DepartmentType] = None
    groups: Optional[GroupType] = None
    users: UserType | None = None
    message: str
    viewers: UserType | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None


@strawberry.type
class ActivityProcessType:
    uid: str
    object_type: str
    status: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
