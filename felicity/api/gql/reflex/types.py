from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import (AnalysisType,
                                                      SampleTypeTyp)
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType


@strawberry.type
class ReflexRuleType:
    uid: str
    name: str
    description: str
    reflex_actions: Optional[List["ReflexActionType"]] = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


#  relay paginations
@strawberry.type
class ReflexRuleEdge:
    cursor: str
    node: ReflexRuleType


@strawberry.type
class ReflexRuleCursorPage:
    page_info: PageInfo
    edges: Optional[List[ReflexRuleEdge]] = None
    items: Optional[List[ReflexRuleType]] = None
    total_count: int


@strawberry.type
class ReflexBrainAdditionType:
    analysis_uid: str
    analysis: AnalysisType | None = None
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrainType"] = None
    count: int


@strawberry.type
class ReflexBrainCriteriaType:
    analysis_uid: str
    analysis: AnalysisType | None = None
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrainType"] = None
    operator: str
    value: str


@strawberry.type
class ReflexBrainFinalType:
    analysis_uid: str
    analysis: AnalysisType | None = None
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrainType"] = None
    value: str


@strawberry.type
class ReflexBrainType:
    reflex_action_uid: str
    reflex_action: Optional["ReflexBrainType"] = None
    uid: str
    description: str
    analyses_values: Optional[List[ReflexBrainCriteriaType]] = None
    add_new: Optional[List[ReflexBrainAdditionType]] = None
    finalise: Optional[List[ReflexBrainFinalType]] = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class ReflexActionType:
    uid: str
    level: int
    description: str
    analyses: Optional[List[AnalysisType]] = None
    sample_type_uid: str | None = None
    sample_type: Optional[SampleTypeTyp] = None
    reflex_rule_uid: str
    reflex_rule: Optional[ReflexRuleType] = None
    brains: Optional[List[ReflexBrainType]] = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
