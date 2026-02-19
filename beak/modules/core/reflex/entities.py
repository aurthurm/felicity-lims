from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, Table, UniqueConstraint
from sqlalchemy.orm import relationship

from beak.modules.core.abstract import BaseEntity, LabScopedEntity


class ReflexRule(BaseEntity):
    __tablename__ = "reflex_rule"

    name = Column(String, index=True, unique=True, nullable=False)
    description = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)
    reflex_triggers = relationship(
        "ReflexTrigger", back_populates="reflex_rule", lazy="selectin"
    )


"""
Many to Many Link between ReflexTrigger and Analysis
"""
reflex_trigger_analysis = Table(
    "reflex_trigger_analysis",
    BaseEntity.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("reflex_trigger_uid", ForeignKey("reflex_trigger.uid"), primary_key=True),
)


class ReflexTrigger(LabScopedEntity):
    """Simplified reflex trigger entity

    Defines when a reflex should be evaluated based on analysis results.
    Each trigger is associated with a reflex rule and can have multiple analyses
    that trigger the reflex evaluation.
    """
    __tablename__ = "reflex_trigger"

    reflex_rule_uid = Column(
        String, ForeignKey("reflex_rule.uid"), nullable=False, index=True
    )
    reflex_rule = relationship("ReflexRule", lazy="selectin")
    level = Column(Integer, nullable=False, default=1)
    description = Column(String, nullable=False)
    sample_type_uid = Column(String, ForeignKey("sample_type.uid"), nullable=True)
    sample_type = relationship("SampleType", lazy="selectin")
    # Canvas position coordinates
    pos_x = Column(Float, nullable=True)
    pos_y = Column(Float, nullable=True)
    # Many-to-many relationship to Analysis
    analyses = relationship(
        "Analysis", secondary=reflex_trigger_analysis, lazy="selectin"
    )
    # One-to-many relationship to ReflexDecision
    decisions = relationship("ReflexDecision", back_populates="reflex_trigger", lazy="selectin")


class ReflexDecision(LabScopedEntity):
    """Simplified decision entity

    Represents a single decision path within a reflex trigger.
    Contains rule groups (conditions) and actions to take when conditions are met.
    """
    __tablename__ = "reflex_decision"

    reflex_trigger_uid = Column(
        String, ForeignKey("reflex_trigger.uid"), nullable=False, index=True
    )
    reflex_trigger = relationship(
        "ReflexTrigger", back_populates="decisions", lazy="selectin"
    )
    description = Column(String, nullable=True)
    priority = Column(Integer, default=0)
    # Canvas position coordinates
    pos_x = Column(Float, nullable=True)
    pos_y = Column(Float, nullable=True)
    # One-to-many relationships
    rule_groups = relationship(
        "ReflexRuleGroup", back_populates="reflex_decision", lazy="selectin"
    )
    add_analyses = relationship(
        "ReflexAddAnalysis", back_populates="reflex_decision", lazy="selectin"
    )
    finalize_analyses = relationship(
        "ReflexFinalizeAnalysis", back_populates="reflex_decision", lazy="selectin"
    )


class ReflexRuleGroup(LabScopedEntity):
    """Rule group entity

    Groups multiple rules with OR logic. Each rule group can contain multiple rules
    that are evaluated with AND logic within the group.
    """
    __tablename__ = "reflex_rule_group"

    reflex_decision_uid = Column(
        String, ForeignKey("reflex_decision.uid"), nullable=False, index=True
    )
    reflex_decision = relationship(
        "ReflexDecision", back_populates="rule_groups", lazy="selectin"
    )
    description = Column(String, nullable=True)
    priority = Column(Integer, default=0)
    # Canvas position coordinates
    pos_x = Column(Float, nullable=True)
    pos_y = Column(Float, nullable=True)
    # One-to-many relationship to ReflexRuleCriteria
    rules = relationship("ReflexRuleCriteria", back_populates="reflex_rule_group", lazy="selectin")


class ReflexRuleCriteria(LabScopedEntity):
    """Individual rule criteria entity

    Defines a single condition to evaluate against an analysis result.
    Operators: =, !=, >, >=, <, <=
    """
    __tablename__ = "reflex_rule_criteria"

    reflex_rule_group_uid = Column(
        String, ForeignKey("reflex_rule_group.uid"), nullable=False, index=True
    )
    reflex_rule_group = relationship(
        "ReflexRuleGroup", back_populates="rules", lazy="selectin"
    )
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", lazy="selectin")
    operator = Column(String, nullable=False)
    value = Column(String, nullable=False)
    priority = Column(Integer, default=0)


class ReflexAddAnalysis(LabScopedEntity):
    """Analysis addition entity

    Defines which analyses to add when a reflex decision's conditions are met.
    """
    __tablename__ = "reflex_add_analysis"

    reflex_decision_uid = Column(
        String, ForeignKey("reflex_decision.uid"), nullable=False, index=True
    )
    reflex_decision = relationship(
        "ReflexDecision", back_populates="add_analyses", lazy="selectin"
    )
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", lazy="selectin")
    count = Column(Integer, default=1)
    # Canvas position coordinates
    pos_x = Column(Float, nullable=True)
    pos_y = Column(Float, nullable=True)


class ReflexFinalizeAnalysis(LabScopedEntity):
    """Analysis finalization entity

    Defines which analyses to finalize with specific values when conditions are met.
    """
    __tablename__ = "reflex_finalize_analysis"

    reflex_decision_uid = Column(
        String, ForeignKey("reflex_decision.uid"), nullable=False, index=True
    )
    reflex_decision = relationship(
        "ReflexDecision", back_populates="finalize_analyses", lazy="selectin"
    )
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", lazy="selectin")
    value = Column(String, nullable=False)
    # Canvas position coordinates
    pos_x = Column(Float, nullable=True)
    pos_y = Column(Float, nullable=True)


class ReflexDecisionExecution(BaseEntity):
    __tablename__ = "reflex_decision_execution"
    __table_args__ = (
        UniqueConstraint(
            "sample_uid",
            "reflex_decision_uid",
            name="uq_reflex_decision_execution_sample_decision",
        ),
    )

    sample_uid = Column(String, ForeignKey("sample.uid"), nullable=False, index=True)
    sample = relationship("Sample", lazy="selectin")
    reflex_decision_uid = Column(
        String, ForeignKey("reflex_decision.uid"), nullable=False, index=True
    )
    reflex_decision = relationship("ReflexDecision", lazy="selectin")
    status = Column(String, nullable=False, default="running")
