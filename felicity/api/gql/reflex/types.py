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
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


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
    analysis: Optional[AnalysisType]
    reflex_brain_uid: FelicityID
    reflex_brain: Optional["ReflexBrainType"]
    count: int


@strawberry.type
class ReflexBrainCriteriaType:
    analysis_uid: FelicityID
    analysis: Optional[AnalysisType]
    reflex_brain_uid: FelicityID
    reflex_brain: Optional["ReflexBrainType"]
    operator: str
    value: str


@strawberry.type
class ReflexBrainFinalType:
    analysis_uid: FelicityID
    analysis: Optional[AnalysisType]
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
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ReflexActionType:
    uid: FelicityID
    level: int
    description: str
    analyses: Optional[List[AnalysisType]]
    sample_type_uid: Optional[FelicityID]
    sample_type: Optional[SampleTypeTyp]
    reflex_rule_uid: FelicityID
    reflex_rule: Optional[ReflexRuleType]
    brains: Optional[List[ReflexBrainType]]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]
