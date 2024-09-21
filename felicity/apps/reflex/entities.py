from sqlalchemy import Column, ForeignKey, Integer, String, Table, Boolean, JSON
from sqlalchemy.orm import relationship

from felicity.apps.abstract import BaseEntity


class ReflexRule(BaseEntity):
    __tablename__ = "reflex_rule"

    name = Column(String, index=True, unique=True, nullable=False)
    description = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)  # New field to enable/disable rules
    priority = Column(Integer, default=0)  # New field to set rule priority
    reflex_actions = relationship(
        "ReflexAction", back_populates="reflex_rule", lazy="selectin"
    )


class ReflexBrainAddition(BaseEntity):
    """Many to Many Link between ReflexBrain and Analysis
    with extra data for additions
    """

    __tablename__ = "reflex_brain_addition"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_uid = Column(String, ForeignKey("reflex_brain.uid"), primary_key=True)
    count = Column(Integer, default=1)
    conditions = Column(JSON)  # New field for conditional additions


class ReflexBrainFinal(BaseEntity):
    """Many to Many Link between ReflexBrain and Analysis
    with extra data for finalize where necessary
    """

    __tablename__ = "reflex_brain_final"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_uid = Column(String, ForeignKey("reflex_brain.uid"), primary_key=True)
    value = Column(String)
    conditions = Column(JSON)  # New field for conditional finalization


class ReflexBrainCriteria(BaseEntity):
    """Many to Many Link between ReflexBrain and Analysis
    with extra data for criteria/decision making
    operators: =, !=, >, >=, <, <=
    """

    __tablename__ = "reflex_brain_criteria"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_uid = Column(String, ForeignKey("reflex_brain.uid"), primary_key=True)
    operator = Column(String, nullable=False)
    value = Column(String)
    custom_logic = Column(String)  # New field for custom logic expressions


class ComplexCondition(BaseEntity):
    __tablename__ = "complex_condition"

    reflex_brain_uid = Column(String, ForeignKey("reflex_brain.uid"), nullable=False)
    condition_type = Column(String, nullable=False)  # e.g., 'AND', 'OR', 'NOT'
    subconditions = Column(JSON)  # Store nested conditions as JSON


class ReflexBrain(BaseEntity):
    __tablename__ = "reflex_brain"

    reflex_action_uid = Column(
        String, ForeignKey("reflex_action.uid"), nullable=False, default=1
    )
    reflex_action = relationship(
        "ReflexAction", back_populates="brains", lazy="selectin"
    )
    description = Column(String, nullable=True)
    analyses_values = relationship(ReflexBrainCriteria, lazy="selectin")
    add_new = relationship(ReflexBrainAddition, lazy="selectin")
    finalise = relationship(ReflexBrainFinal, lazy="selectin")
    complex_conditions = relationship(ComplexCondition, lazy="selectin")
    custom_logic = Column(String)  # New field for custom logic at the brain level


"""
Many to Many Link between ReflexBrain and Analysis
"""
reflex_action_analysis = Table(
    "reflex_action_analysis",
    BaseEntity.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("reflex_action_uid", ForeignKey("reflex_action.uid"), primary_key=True),
)


class ReflexAction(BaseEntity):
    __tablename__ = "reflex_action"

    level = Column(Integer, nullable=False, default=1)
    description = Column(String, nullable=False)
    # triggers
    analyses = relationship(
        "Analysis", secondary=reflex_action_analysis, lazy="selectin"
    )
    sample_type_uid = Column(String, ForeignKey("sample_type.uid"), nullable=True)
    sample_type = relationship("SampleType", lazy="selectin")
    # --
    reflex_rule_uid = Column(String, ForeignKey("reflex_rule.uid"), nullable=False)
    reflex_rule = relationship(
        "ReflexRule", back_populates="reflex_actions", lazy="selectin"
    )
    # --
    brains = relationship(ReflexBrain, back_populates="reflex_action", lazy="selectin")
    custom_logic = Column(String)  # New field for custom logic at the action level
    execution_order = Column(Integer, default=0)  # New field to control execution order
