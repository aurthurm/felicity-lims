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
    is_active: bool = True
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
#  ReflexBrainAddition Schema
#


# Shared properties
class ReflexBrainAdditionBase(BaseAuditModel):
    analysis_uid: str
    analysis: Optional[Analysis] = None
    reflex_brain_action_uid: str
    reflex_brain_action: Optional["ReflexBrainAction"] = None
    count: int


# Additional properties to return via API
class ReflexBrainAddition(ReflexBrainAdditionBase):
    uid: str
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReflexBrainAdditionCreate(ReflexBrainAdditionBase):
    pass


# Properties to receive via API on update
class ReflexBrainAdditionUpdate(ReflexBrainAdditionBase):
    pass


#
#  ReflexBrainFinal Schema
#


# Shared properties
class ReflexBrainFinalBase(BaseAuditModel):
    analysis_uid: str
    analysis: Optional[Analysis] = None
    reflex_brain_action_uid: str
    reflex_brain_action: Optional["ReflexBrainAction"] = None
    value: str


# Additional properties to return via API
class ReflexBrainFinal(ReflexBrainFinalBase):
    uid: str
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReflexBrainFinalCreate(ReflexBrainFinalBase):
    pass


# Properties to receive via API on update
class ReflexBrainFinalUpdate(ReflexBrainFinalBase):
    pass


#
#  ReflexBrainConditionCriteria Schema
#


# Shared properties
class ReflexBrainConditionCriteriaBase(BaseAuditModel):
    reflex_brain_uid: str
    reflex_brain: "ReflexBrain"
    description: str | None
    criteria: list["ReflexBrainConditionCriteria"] | None
    priority: int


# Additional properties to return via API
class ReflexBrainConditionCriteria(ReflexBrainConditionCriteriaBase):
    uid: str
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReflexBrainConditionCriteriaCreate(ReflexBrainConditionCriteriaBase):
    pass


# Properties to receive via API on update
class ReflexBrainConditionCriteriaUpdate(ReflexBrainConditionCriteriaBase):
    pass


#
#  ReflexBrainCondition Schema
#


# Shared properties
class ReflexBrainConditionBase(BaseAuditModel):
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrain"] = None
    description: str | None = None
    criteria: list["ReflexBrainConditionCriteria"] | None = None
    priority: int


# Additional properties to return via API
class ReflexBrainCondition(ReflexBrainConditionBase):
    uid: str
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReflexBrainConditionCreate(ReflexBrainConditionBase):
    pass


# Properties to receive via API on update
class ReflexBrainConditionUpdate(ReflexBrainConditionBase):
    pass


#
#  ReflexBrain Schema
#


# Shared properties
class ReflexBrainBase(BaseAuditModel):
    reflex_action_uid: str
    reflex_action: Optional["ReflexAction"] = None
    description: Optional[str] = None
    priority: int


# Additional properties to return via API
class ReflexBrain(ReflexBrainBase):
    uid: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReflexBrainCreate(ReflexBrainBase):
    pass


# Properties to receive via API on update
class ReflexBrainUpdate(ReflexBrainBase):
    pass


#
#  ReflexBrainAction Schema
#


# Shared properties
class ReflexBrainActionBase(BaseAuditModel):
    reflex_brain_uid: str
    reflex_brain: Optional["ReflexBrain"] = None
    description: Optional[str] = None
    add_new: Optional[List[ReflexBrainAddition]] = None
    finalise: Optional[List[ReflexBrainFinal]] = None
    priority: int


# Additional properties to return via API
class ReflexBrainAction(ReflexBrainBase):
    uid: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReflexBrainActionCreate(ReflexBrainActionBase):
    pass


# Properties to receive via API on update
class ReflexBrainActionUpdate(ReflexBrainActionBase):
    pass


#
#  ReflexAction Schema
#


# Shared properties
class ReflexActionBase(BaseAuditModel):
    level: int
    description: Optional[str] = None
    reflex_rule_uid: str
    reflex_rule: Optional[ReflexRule] = None
    brains: Optional[List[ReflexBrain]] = None
    analyses: Optional[List[Analysis]] = None
    sample_type_uid: Optional[str] = None
    sample_type: Optional[SampleType] = None
    priority: int = 0


# Additional properties to return via API
class ReflexAction(ReflexActionBase):
    uid: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReflexActionCreate(ReflexActionBase):
    pass


# Properties to receive via API on update
class ReflexActionUpdate(ReflexActionBase):
    pass
