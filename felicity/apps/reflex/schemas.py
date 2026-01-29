from dataclasses import field
from typing import List, Optional

from pydantic import ConfigDict

from felicity.apps.analysis.schemas import Analysis, SampleType
from felicity.apps.common.schemas import BaseAuditModel


#
#  ReflexRule Schema
#

# Shared properties


class ReflexRuleBase(BaseAuditModel):
    name: str
    description: str
    is_active: bool = False  # Default to draft mode
    priority: int = 0
    sample_types: Optional[List[SampleType]] = field(default_factory=list)


# Additional properties to return via API
class ReflexRule(ReflexRuleBase):
    uid: str
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReflexRuleCreate(ReflexRuleBase):
    pass


# Properties to receive via API on update
class ReflexRuleUpdate(ReflexRuleBase):
    pass


#
#  ReflexTrigger Schema
#

class ReflexTriggerBase(BaseAuditModel):
    """Base schema for ReflexTrigger """
    reflex_rule_uid: str
    reflex_rule: Optional[ReflexRule] = None
    level: int = 1
    description: str
    sample_type_uid: Optional[str] = None
    sample_type: Optional[SampleType] = None
    analyses: Optional[List[Analysis]] = None
    decisions: Optional[List["ReflexDecision"]] = None
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None


class ReflexTrigger(ReflexTriggerBase):
    """ReflexTrigger schema for API responses"""
    uid: str
    model_config = ConfigDict(from_attributes=True)


class ReflexTriggerCreate(ReflexTriggerBase):
    """ReflexTrigger schema for creation"""
    pass


class ReflexTriggerUpdate(ReflexTriggerBase):
    """ReflexTrigger schema for updates"""
    pass


#
#  ReflexDecision Schema
#

class ReflexDecisionBase(BaseAuditModel):
    """Base schema for ReflexDecision"""
    reflex_trigger_uid: str
    reflex_trigger: Optional[ReflexTrigger] = None
    description: Optional[str] = None
    priority: int = 0
    rule_groups: Optional[List["ReflexRuleGroup"]] = None
    add_analyses: Optional[List["ReflexAddAnalysis"]] = None
    finalize_analyses: Optional[List["ReflexFinalizeAnalysis"]] = None
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None


class ReflexDecision(ReflexDecisionBase):
    """ReflexDecision schema for API responses"""
    uid: str
    model_config = ConfigDict(from_attributes=True)


class ReflexDecisionCreate(ReflexDecisionBase):
    """ReflexDecision schema for creation"""
    pass


class ReflexDecisionUpdate(ReflexDecisionBase):
    """ReflexDecision schema for updates"""
    pass


#
#  ReflexRuleGroup Schema
#


class ReflexRuleGroupBase(BaseAuditModel):
    """Base schema for ReflexRuleGroup (OR logic container)"""
    reflex_decision_uid: str
    reflex_decision: Optional[ReflexDecision] = None
    description: Optional[str] = None
    priority: int = 0
    rules: Optional[List["ReflexRuleCriteria"]] = None
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None


class ReflexRuleGroup(ReflexRuleGroupBase):
    """ReflexRuleGroup schema for API responses"""
    uid: str
    model_config = ConfigDict(from_attributes=True)


class ReflexRuleGroupCreate(ReflexRuleGroupBase):
    """ReflexRuleGroup schema for creation"""
    pass


class ReflexRuleGroupUpdate(ReflexRuleGroupBase):
    """ReflexRuleGroup schema for updates"""
    pass


#
#  ReflexRuleCriteria Schema
#


class ReflexRuleCriteriaBase(BaseAuditModel):
    """Base schema for ReflexRuleCriteria (AND logic within groups)"""
    reflex_rule_group_uid: str
    reflex_rule_group: Optional[ReflexRuleGroup] = None
    analysis_uid: str
    analysis: Optional[Analysis] = None
    operator: str  # =, !=, >, >=, <, <=
    value: str
    priority: int = 0


class ReflexRuleCriteria(ReflexRuleCriteriaBase):
    """ReflexRuleCriteria schema for API responses"""
    uid: str
    model_config = ConfigDict(from_attributes=True)


class ReflexRuleCriteriaCreate(ReflexRuleCriteriaBase):
    """ReflexRuleCriteria schema for creation"""
    pass


class ReflexRuleCriteriaUpdate(ReflexRuleCriteriaBase):
    """ReflexRuleCriteria schema for updates"""
    pass


#
#  ReflexAddAnalysis Schema
#


class ReflexAddAnalysisBase(BaseAuditModel):
    """Base schema for ReflexAddAnalysis"""
    reflex_decision_uid: str
    reflex_decision: Optional[ReflexDecision] = None
    analysis_uid: str
    analysis: Optional[Analysis] = None
    count: int = 1
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None


class ReflexAddAnalysis(ReflexAddAnalysisBase):
    """ReflexAddAnalysis schema for API responses"""
    uid: str
    model_config = ConfigDict(from_attributes=True)


class ReflexAddAnalysisCreate(ReflexAddAnalysisBase):
    """ReflexAddAnalysis schema for creation"""
    pass


class ReflexAddAnalysisUpdate(ReflexAddAnalysisBase):
    """ReflexAddAnalysis schema for updates"""
    pass


#
#  ReflexFinalizeAnalysis Schema
#


class ReflexFinalizeAnalysisBase(BaseAuditModel):
    """Base schema for ReflexFinalizeAnalysis"""
    reflex_decision_uid: str
    reflex_decision: Optional[ReflexDecision] = None
    analysis_uid: str
    analysis: Optional[Analysis] = None
    value: str
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None


class ReflexFinalizeAnalysis(ReflexFinalizeAnalysisBase):
    """ReflexFinalizeAnalysis schema for API responses"""
    uid: str
    model_config = ConfigDict(from_attributes=True)


class ReflexFinalizeAnalysisCreate(ReflexFinalizeAnalysisBase):
    """ReflexFinalizeAnalysis schema for creation"""
    pass


class ReflexFinalizeAnalysisUpdate(ReflexFinalizeAnalysisBase):
    """ReflexFinalizeAnalysis schema for updates"""
    pass


#
# ReflexDecisionExecution
#


class ReflexDecisionExecutionBase(BaseAuditModel):
    """Base schema for ReflexDecisionExecution"""
    sample_uid: str
    reflex_decision_uid: str
    status: str


class ReflexDecisionExecution(ReflexDecisionExecutionBase):
    """ReflexDecisionExecution schema for API responses"""
    uid: str
    model_config = ConfigDict(from_attributes=True)


class ReflexDecisionExecutionCreate(ReflexDecisionExecutionBase):
    """ReflexDecisionExecution schema for creation"""
    pass


class ReflexDecisionExecutionUpdate(ReflexDecisionExecutionBase):
    """ReflexDecisionExecution schema for updates"""
    pass
