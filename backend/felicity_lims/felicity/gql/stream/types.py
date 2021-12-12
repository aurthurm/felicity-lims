from typing import Optional, List, Union
from datetime import datetime
import strawberry

from felicity.apps.analysis.models.analysis import Sample
from felicity.apps.worksheet.models import WorkSheet
from felicity.gql.analysis.types.analysis import SampleType
from felicity.gql.user.types import UserType
from felicity.gql.worksheet.types import WorkSheetType


@strawberry.type
class UnknownObjectType:
    message: str


actionObject = strawberry.union("actionObject", [WorkSheetType, SampleType],
                                description="Union of possible object types for streams"
                                )


@strawberry.type
class ActivityFeedType:
    uid: int
    name: str
    subscribers: Optional[List[UserType]]


@strawberry.type
class ActivityStreamType:
    uid: int
    feeds: Optional[List[ActivityFeedType]]
    actor_uid: Optional[int]
    actor: Optional[UserType]
    verb: Optional[str]
    action_object_type: Optional[str]
    action_object_uid: Optional[int]
    target_uid: Optional[int]
    target: Optional[str]
    viewers: Optional[List[UserType]]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]

    @strawberry.field
    async def action_object(self, info) -> Union[WorkSheetType, SampleType, UnknownObjectType]:
        if self.action_object_type == 'sample':
            sample = await Sample.get(uid=self.action_object_uid)
            return SampleType(**sample.marshal_simple(
                exclude=['right', 'left', 'tree_id', 'level', 'analysis_results']
            ), parent=None)

        if self.action_object_type == 'worksheet':
            ws = await WorkSheet.get(uid=self.action_object_uid)
            return WorkSheetType(**ws.marshal_simple())

        return UnknownObjectType(message=f"Please provide a resolver for object of type {self.action_object_type}")
