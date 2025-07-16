from sqlalchemy import Column, ForeignKey, Integer, String, Table, Boolean
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity


class ReflexRule(LabScopedEntity):
    __tablename__ = "reflex_rule"

    name = Column(String, index=True, unique=True, nullable=False)
    description = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)
    reflex_actions = relationship(
        "ReflexAction", back_populates="reflex_rule", lazy="selectin"
    )


class ReflexBrainAddition(LabScopedEntity):
    """Many to Many Link between ReflexBrain and Analysis
    with extra data for additions
    """

    __tablename__ = "reflex_brain_addition"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_action_uid = Column(
        String, ForeignKey("reflex_brain_action.uid"), primary_key=True
    )
    count = Column(Integer, default=1)


class ReflexBrainFinal(LabScopedEntity):
    """Many to Many Link between ReflexBrain and Analysis
    with extra data for finalize where necessary
    """

    __tablename__ = "reflex_brain_final"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_action_uid = Column(
        String, ForeignKey("reflex_brain_action.uid"), primary_key=True
    )
    value = Column(String)


class ReflexBrainConditionCriteria(LabScopedEntity):
    """Many to Many Link between ReflexCondition and Analysis
    with extra data for criteria/decision-making
    operators: =, !=, >, >=, <, <=
    """

    __tablename__ = "reflex_brain_condition_criteria"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_condition_uid = Column(
        String, ForeignKey("reflex_brain_condition.uid"), primary_key=True
    )
    operator = Column(String, nullable=False)
    value = Column(String)
    priority = Column(Integer, default=0)


class ReflexBrain(LabScopedEntity):
    __tablename__ = "reflex_brain"

    reflex_action_uid = Column(
        String, ForeignKey("reflex_action.uid"), nullable=False, default=1
    )
    reflex_action = relationship(
        "ReflexAction", back_populates="brains", lazy="selectin"
    )
    conditions = relationship(
        "ReflexBrainCondition", back_populates="reflex_brain", lazy="selectin"
    )
    actions = relationship(
        "ReflexBrainAction", back_populates="reflex_brain", lazy="selectin"
    )
    description = Column(String, nullable=True)
    priority = Column(Integer, default=0)


class ReflexBrainCondition(LabScopedEntity):
    """OR Logic"""

    __tablename__ = "reflex_brain_condition"

    reflex_brain_uid = Column(
        String, ForeignKey("reflex_brain.uid"), nullable=False, default=1
    )
    reflex_brain = relationship("ReflexBrain", lazy="selectin")
    description = Column(String, nullable=True)
    # AND logic
    criteria = relationship(ReflexBrainConditionCriteria, lazy="selectin")
    priority = Column(Integer, default=0)


class ReflexBrainAction(LabScopedEntity):
    __tablename__ = "reflex_brain_action"

    reflex_brain_uid = Column(
        String, ForeignKey("reflex_brain.uid"), nullable=False, default=1
    )
    # uselist=False == one-to-one
    reflex_brain = relationship(
        "ReflexBrain", back_populates="actions", lazy="selectin", uselist=False
    )
    description = Column(String, nullable=True)
    add_new = relationship(ReflexBrainAddition, lazy="selectin")
    finalise = relationship(ReflexBrainFinal, lazy="selectin")
    priority = Column(Integer, default=0)


"""
Many to Many Link between ReflexBrain and Analysis
"""
reflex_action_analysis = Table(
    "reflex_action_analysis",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("reflex_action_uid", ForeignKey("reflex_action.uid"), primary_key=True),
)


class ReflexAction(LabScopedEntity):
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
