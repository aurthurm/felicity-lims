from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.analysis.types.analysis import AnalysisType, SampleTypeTyp
from api.gql.user.types import UserType
from core.uid_gen import FelicityID


@strawberry.type
class ReflexRuleType:
    uid: FelicityID
    name: str
    description: str
    reflex_actions: Optional[List["ReflexActionType"]]
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


#  relay paginations
@strawberry.type
class ReflexRuleEdge:
    cursor: str
    node: ReflexRuleType


@strawberry.type
class ReflexRuleCursorPage:
    page_info: PageInfo
    edges: Optional[List[ReflexRuleEdge]]
    items: Optional[List[ReflexRuleType]]
    total_count: int


@strawberry.type
class ReflexBrainAdditionType:
    analysis_uid: FelicityID
    analysis: AnalysisType | None
    reflex_brain_uid: FelicityID
    reflex_brain: Optional["ReflexBrainType"]
    count: int


@strawberry.type
class ReflexBrainCriteriaType:
    analysis_uid: FelicityID
    analysis: AnalysisType | None
    reflex_brain_uid: FelicityID
    reflex_brain: Optional["ReflexBrainType"]
    operator: str
    value: str


@strawberry.type
class ReflexBrainFinalType:
    analysis_uid: FelicityID
    analysis: AnalysisType | None
    reflex_brain_uid: FelicityID
    reflex_brain: Optional["ReflexBrainType"]
    value: str


@strawberry.type
class ReflexBrainType:
    reflex_action_uid: FelicityID
    reflex_action: Optional["ReflexBrainType"]
    uid: FelicityID
    description: str
    analyses_values: Optional[List[ReflexBrainCriteriaType]]
    add_new: Optional[List[ReflexBrainAdditionType]]
    finalise: Optional[List[ReflexBrainFinalType]]
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class ReflexActionType:
    uid: FelicityID
    level: int
    description: str
    analyses: Optional[List[AnalysisType]]
    sample_type_uid: FelicityID | None
    sample_type: Optional[SampleTypeTyp]
    reflex_rule_uid: FelicityID
    reflex_rule: Optional[ReflexRuleType]
    brains: Optional[List[ReflexBrainType]]
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None
