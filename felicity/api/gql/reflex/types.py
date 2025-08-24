from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import AnalysisType, SampleTypeTyp
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType


@strawberry.type
class ReflexRuleType:
    uid: str
    name: str
    description: str
    reflex_actions: Optional[List["ReflexActionType"]] = None
    is_active: bool
    priority: int
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    reflex_brain_action_uid: str
    reflex_brain_action: Optional["ReflexBrainActionType"] = None
    count: int
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class ReflexBrainConditionCriteriaType:
    analysis_uid: str
    analysis: AnalysisType | None = None
    reflex_brain_condition_uid: str
    reflex_brain_condition: Optional["ReflexBrainConditionType"] = None
    operator: str
    value: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class ReflexBrainFinalType:
    analysis_uid: str
    analysis: AnalysisType | None = None
    reflex_brain_action_uid: str
    reflex_brain_action: Optional["ReflexBrainActionType"] = None
    value: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class ReflexBrainConditionType:
    uid: str
    reflex_brain_uid: str
    reflex_brain: "ReflexBrainType"
    description: str | None
    criteria: list["ReflexBrainConditionCriteriaType"] | None
    priority: int
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class ReflexBrainType:
    reflex_action_uid: str
    reflex_action: Optional["ReflexBrainType"] = None
    actions: list["ReflexBrainActionType"]
    conditions: list["ReflexBrainConditionType"]
    uid: str
    description: str
    priority: int
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class ReflexBrainActionType:
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrainType"] = None
    uid: str
    description: str
    add_new: Optional[List[ReflexBrainAdditionType]] = None
    finalise: Optional[List[ReflexBrainFinalType]] = None
    priority: int
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
