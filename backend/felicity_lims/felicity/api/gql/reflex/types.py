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
class ReflexAnalysisValueType:
    uid: int
    analysis_uid: int
    analysis: Optional[AnalysisType]
    value: str
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ReflexBrainAnalysisType:
    analysis_uid: int
    analysis: Optional[AnalysisType]
    reflex_brain_uid: int
    reflex_brain: Optional["ReflexBrainType"]
    count: int


@strawberry.type
class ReflexBrainType:
    reflex_action_uid: int
    reflex_action: Optional["ReflexBrainType"]
    uid: int
    description: str
    analyses_values: Optional[List[ReflexAnalysisValueType]]
    add_new: Optional[List[ReflexBrainAnalysisType]]
    finalise: Optional[List[ReflexAnalysisValueType]]
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
    analysis_uid: int
    analysis: Optional[AnalysisType]
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
