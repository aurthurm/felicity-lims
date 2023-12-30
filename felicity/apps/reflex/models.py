import logging

from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from apps import Auditable, DBModel
from apps.reflex import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ReflexRule(Auditable):
    __tablename__ = "reflex_rule"

    name = Column(String, index=True, unique=True, nullable=False)
    description = Column(String, nullable=False)
    reflex_actions = relationship(
        "ReflexAction", back_populates="reflex_rule", lazy="selectin"
    )

    @classmethod
    async def create(cls, obj_in: schemas.ReflexRuleCreate) -> schemas.ReflexRule:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReflexRuleUpdate) -> schemas.ReflexRule:
        data = self._import(obj_in)
        return await super().update(**data)


class ReflexBrainAddition(DBModel):
    """Many to Many Link between ReflexBrain and Analysis
    with extra data for additions
    """

    __tablename__ = "reflex_brain_addition"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_uid = Column(String, ForeignKey("reflex_brain.uid"), primary_key=True)
    count = Column(Integer, default=1)

    @classmethod
    async def create(
        cls, obj_in: schemas.ReflexBrainAdditionCreate
    ) -> schemas.ReflexBrainAddition:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.ReflexBrainAdditionUpdate
    ) -> schemas.ReflexBrainAddition:
        data = self._import(obj_in)
        return await super().update(**data)


class ReflexBrainFinal(DBModel):
    """Many to Many Link between ReflexBrain and Analysis
    with extra data for finalize where necessary
    """

    __tablename__ = "reflex_brain_final"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_uid = Column(String, ForeignKey("reflex_brain.uid"), primary_key=True)
    value = Column(String)

    @classmethod
    async def create(
        cls, obj_in: schemas.ReflexBrainFinalCreate
    ) -> schemas.ReflexBrainFinal:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.ReflexBrainFinalUpdate
    ) -> schemas.ReflexBrainFinal:
        data = self._import(obj_in)
        return await super().update(**data)


class ReflexBrainCriteria(DBModel):
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

    @classmethod
    async def create(
        cls, obj_in: schemas.ReflexBrainCriteriaCreate
    ) -> schemas.ReflexBrainCriteria:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.ReflexBrainCriteriaUpdate
    ) -> schemas.ReflexBrainCriteria:
        data = self._import(obj_in)
        return await super().update(**data)


class ReflexBrain(Auditable):
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

    @classmethod
    async def create(cls, obj_in: schemas.ReflexBrainCreate) -> schemas.ReflexBrain:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReflexBrainUpdate) -> schemas.ReflexBrain:
        data = self._import(obj_in)
        return await super().update(**data)


"""
Many to Many Link between ReflexBrain and Analysis
"""
reflex_action_analysis = Table(
    "reflex_action_analysis",
    DBModel.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("reflex_action_uid", ForeignKey("reflex_action.uid"), primary_key=True),
)


class ReflexAction(Auditable):
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

    @classmethod
    async def create(cls, obj_in: schemas.ReflexActionCreate) -> schemas.ReflexAction:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReflexActionUpdate) -> schemas.ReflexAction:
        data = self._import(obj_in)
        return await super().update(**data)
