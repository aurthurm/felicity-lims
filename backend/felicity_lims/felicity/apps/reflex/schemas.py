from datetime import datetime
from typing import Optional, List

from felicity.apps import BaseAuditModel
from pydantic import EmailStr
from felicity.apps.analysis.schemas import SampleType, Analysis


#
#  ReflexRule Schema
#

# Shared properties
class ReflexRuleBase(BaseAuditModel):
    name: str
    description: str
    sample_types: Optional[List[SampleType]]


# Additional properties to return via API
class ReflexRule(ReflexRuleBase):
    uid: int

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReflexRuleCreate(ReflexRuleBase):
    pass


# Properties to receive via API on update
class ReflexRuleUpdate(ReflexRuleBase):
    pass


#
#  ReflexAnalysisValue Schema
#

# Shared properties
class ReflexAnalysisValueBase(BaseAuditModel):
    analysis_uid: int
    analysis: Optional[Analysis]
    value: str


# Additional properties to return via API
class ReflexAnalysisValue(ReflexAnalysisValueBase):
    uid: int

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReflexAnalysisValueCreate(ReflexAnalysisValueBase):
    pass


# Properties to receive via API on update
class ReflexAnalysisValueUpdate(ReflexAnalysisValueBase):
    pass


#
#  ReflexBrain Schema
#

# Shared properties
class ReflexBrainBase(BaseAuditModel):
    reflex_action_uid: int
    reflex_action: Optional["ReflexAction"]
    description: Optional[str]
    analyses_values: Optional[List[ReflexAnalysisValue]]
    add_new: Optional[List[Analysis]]
    finalise: Optional[List[ReflexAnalysisValue]]


# Additional properties to return via API
class ReflexBrain(ReflexBrainBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReflexBrainCreate(ReflexBrainBase):
    pass


# Properties to receive via API on update
class ReflexBrainUpdate(ReflexBrainBase):
    pass


#
#  ReflexBrain Schema
#

# Shared properties
class ReflexActionBase(BaseAuditModel):
    level: int
    description: Optional[str]
    reflex_rule_uid: int
    reflex_rule: Optional[ReflexRule]
    brains: Optional[List[ReflexBrain]]
    analysis_uid: int
    analysis: Optional[Analysis]
    sample_type_uid: Optional[int]
    sample_type: Optional[SampleType]


# Additional properties to return via API
class ReflexAction(ReflexActionBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReflexActionCreate(ReflexActionBase):
    pass


# Properties to receive via API on update
class ReflexActionUpdate(ReflexActionBase):
    pass
