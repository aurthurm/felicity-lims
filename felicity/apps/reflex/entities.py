from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract import AuditHistory, BaseEntity


class ReflexRule(AuditHistory):
    __tablename__ = "reflex_rule"

    name = Column(String, index=True, unique=True, nullable=False)
    description = Column(String, nullable=False)
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


class ReflexBrainFinal(BaseEntity):
    """Many to Many Link between ReflexBrain and Analysis
    with extra data for finalize where necessary
    """

    __tablename__ = "reflex_brain_final"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_uid = Column(String, ForeignKey("reflex_brain.uid"), primary_key=True)
    value = Column(String)


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


class ReflexBrain(AuditHistory):
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


"""
Many to Many Link between ReflexBrain and Analysis
"""
reflex_action_analysis = Table(
    "reflex_action_analysis",
    BaseEntity.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("reflex_action_uid", ForeignKey("reflex_action.uid"), primary_key=True),
)


class ReflexAction(AuditHistory):
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
