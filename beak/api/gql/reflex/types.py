from typing import List, Optional

import strawberry  # noqa

from beak.api.gql.analysis.types.analysis import AnalysisType, SampleTypeTyp
from beak.api.gql.setup.types import LaboratoryType
from beak.api.gql.types import PageInfo
from beak.api.gql.user.types import UserType


@strawberry.type
class ReflexRuleType:
    uid: str
    name: str
    description: str
    reflex_triggers: Optional[List["ReflexTriggerType"]] = None
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
class ReflexRuleCriteriaType:
    """Individual rule criteria"""
    uid: str
    reflex_rule_group_uid: str
    reflex_rule_group: Optional["ReflexRuleGroupType"] = None
    analysis_uid: str
    analysis: Optional[AnalysisType] = None
    operator: str
    value: str
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
class ReflexRuleGroupType:
    """Rule group with OR logic"""
    uid: str
    reflex_decision_uid: str
    reflex_decision: Optional["ReflexDecisionType"] = None
    description: str | None = None
    priority: int
    rules: Optional[List[ReflexRuleCriteriaType]] = None
    pos_x: float | None = None
    pos_y: float | None = None
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
class ReflexAddAnalysisType:
    """Add analysis action"""
    uid: str
    reflex_decision_uid: str
    reflex_decision: Optional["ReflexDecisionType"] = None
    analysis_uid: str
    analysis: Optional[AnalysisType] = None
    count: int
    pos_x: float | None = None
    pos_y: float | None = None
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
class ReflexFinalizeAnalysisType:
    """Finalize analysis action"""
    uid: str
    reflex_decision_uid: str
    reflex_decision: Optional["ReflexDecisionType"] = None
    analysis_uid: str
    analysis: Optional[AnalysisType] = None
    value: str
    pos_x: float | None = None
    pos_y: float | None = None
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
class ReflexDecisionType:
    """Decision node"""
    uid: str
    reflex_trigger_uid: str
    reflex_trigger: Optional["ReflexTriggerType"] = None
    description: str | None = None
    priority: int
    rule_groups: Optional[List[ReflexRuleGroupType]] = None
    add_analyses: Optional[List[ReflexAddAnalysisType]] = None
    finalize_analyses: Optional[List[ReflexFinalizeAnalysisType]] = None
    pos_x: float | None = None
    pos_y: float | None = None
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
class ReflexTriggerType:
    """Trigger node"""
    uid: str
    reflex_rule_uid: str
    reflex_rule: Optional[ReflexRuleType] = None
    level: int
    description: str
    sample_type_uid: str | None = None
    sample_type: Optional[SampleTypeTyp] = None
    analyses: Optional[List[AnalysisType]] = None
    decisions: Optional[List[ReflexDecisionType]] = None
    pos_x: float | None = None
    pos_y: float | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
