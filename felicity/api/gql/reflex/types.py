from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import AnalysisType, SampleTypeTyp
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType


@strawberry.type
class ReflexRuleType:
    uid: str
    name: str
    description: str
    reflex_actions: Optional[List["ReflexActionType"]]
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: str | None


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
    analysis_uid: str
    analysis: AnalysisType | None
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrainType"]
    count: int


@strawberry.type
class ReflexBrainCriteriaType:
    analysis_uid: str
    analysis: AnalysisType | None
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrainType"]
    operator: str
    value: str


@strawberry.type
class ReflexBrainFinalType:
    analysis_uid: str
    analysis: AnalysisType | None
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrainType"]
    value: str


@strawberry.type
class ReflexBrainType:
    reflex_action_uid: str
    reflex_action: Optional["ReflexBrainType"]
    uid: str
    description: str
    analyses_values: Optional[List[ReflexBrainCriteriaType]]
    add_new: Optional[List[ReflexBrainAdditionType]]
    finalise: Optional[List[ReflexBrainFinalType]]
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: str | None


@strawberry.type
class ReflexActionType:
    uid: str
    level: int
    description: str
    analyses: Optional[List[AnalysisType]]
    sample_type_uid: str | None
    sample_type: Optional[SampleTypeTyp]
    reflex_rule_uid: str
    reflex_rule: Optional[ReflexRuleType]
    brains: Optional[List[ReflexBrainType]]
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: str | None
