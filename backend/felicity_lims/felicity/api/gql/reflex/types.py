from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from felicity.api.gql import PageInfo
from felicity.api.gql.analysis.types.analysis import AnalysisType, SampleTypeTyp
from felicity.api.gql.user.types import UserType


@strawberry.type
class ReflexRuleType:
    uid: int
    name: str
    description: str
    reflex_actions: Optional[List["ReflexActionType"]]
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
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
    analysis_uid: int
    analysis: Optional[AnalysisType]
    reflex_brain_uid: int
    reflex_brain: Optional["ReflexBrainType"]
    count: int


@strawberry.type
class ReflexBrainCriteriaType:
    analysis_uid: int
    analysis: Optional[AnalysisType]
    reflex_brain_uid: int
    reflex_brain: Optional["ReflexBrainType"]
    operator: str
    value: str


@strawberry.type
class ReflexBrainFinalType:
    analysis_uid: int
    analysis: Optional[AnalysisType]
    reflex_brain_uid: int
    reflex_brain: Optional["ReflexBrainType"]
    value: str


@strawberry.type
class ReflexBrainType:
    reflex_action_uid: int
    reflex_action: Optional["ReflexBrainType"]
    uid: int
    description: str
    analyses_values: Optional[List[ReflexBrainCriteriaType]]
    add_new: Optional[List[ReflexBrainAdditionType]]
    finalise: Optional[List[ReflexBrainFinalType]]
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ReflexActionType:
    uid: int
    level: int
    description: str
    analyses: Optional[List[AnalysisType]]
    sample_type_uid: Optional[int]
    sample_type: Optional[SampleTypeTyp]
    reflex_rule_uid: int
    reflex_rule: Optional[ReflexRuleType]
    brains: Optional[List[ReflexBrainType]]
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]
