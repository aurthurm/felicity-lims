from typing import List, Optional

from apps.analysis.schemas import Analysis, SampleType
from apps.common.schemas import BaseAuditModel
from core.uid_gen import FelicityIDType

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
    uid: FelicityIDType

    class Config:
        orm_mode = True


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
    analysis_uid: FelicityIDType
    analysis: Optional[Analysis]
    reflex_brain_uid: FelicityIDType
    reflex_brain: Optional["ReflexBrain"]
    count: int


# Additional properties to return via API
class ReflexBrainAddition(ReflexBrainAdditionBase):
    uid: FelicityIDType

    class Config:
        orm_mode = True


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
    analysis_uid: FelicityIDType
    analysis: Optional[Analysis]
    reflex_brain_uid: FelicityIDType
    reflex_brain: Optional["ReflexBrain"]
    value: str


# Additional properties to return via API
class ReflexBrainFinal(ReflexBrainFinalBase):
    uid: FelicityIDType

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReflexBrainFinalCreate(ReflexBrainFinalBase):
    pass


# Properties to receive via API on update
class ReflexBrainFinalUpdate(ReflexBrainFinalBase):
    pass


#
#  ReflexBrainCriteria Schema
#

# Shared properties
class ReflexBrainCriteriaBase(BaseAuditModel):
    analysis_uid: FelicityIDType
    analysis: Optional[Analysis]
    reflex_brain_uid: FelicityIDType
    reflex_brain: Optional["ReflexBrain"]
    value: str


# Additional properties to return via API
class ReflexBrainCriteria(ReflexBrainCriteriaBase):
    uid: FelicityIDType

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReflexBrainCriteriaCreate(ReflexBrainCriteriaBase):
    pass


# Properties to receive via API on update
class ReflexBrainCriteriaUpdate(ReflexBrainCriteriaBase):
    pass


#
#  ReflexBrain Schema
#

# Shared properties
class ReflexBrainBase(BaseAuditModel):
    reflex_action_uid: FelicityIDType
    reflex_action: Optional["ReflexAction"]
    description: Optional[str]
    analyses_values: Optional[List[ReflexBrainCriteria]]
    add_new: Optional[List[ReflexBrainAddition]]
    finalise: Optional[List[ReflexBrainFinal]]


# Additional properties to return via API
class ReflexBrain(ReflexBrainBase):
    uid: Optional[FelicityIDType] = None

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
    reflex_rule_uid: FelicityIDType
    reflex_rule: Optional[ReflexRule]
    brains: Optional[List[ReflexBrain]]
    analyses: Optional[List[Analysis]]
    sample_type_uid: Optional[FelicityIDType]
    sample_type: Optional[SampleType]


# Additional properties to return via API
class ReflexAction(ReflexActionBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReflexActionCreate(ReflexActionBase):
    pass


# Properties to receive via API on update
class ReflexActionUpdate(ReflexActionBase):
    pass
