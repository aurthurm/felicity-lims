import logging

from felicity.apps import Auditable, DBModel
from felicity.apps.reflex import schemas
from sqlalchemy import Column, Table, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ReflexRule(Auditable):
    name = Column(String, index=True, unique=True, nullable=False)
    description = Column(String, nullable=False)
    reflex_actions = relationship("ReflexAction", back_populates="reflex_rule", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.ReflexRuleCreate) -> schemas.ReflexRule:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReflexRuleUpdate) -> schemas.ReflexRule:
        data = self._import(obj_in)
        return await super().update(**data)


class ReflexAnalysisValue(Auditable):
    analysis_uid = Column(Integer, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", lazy="selectin")
    value = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.ReflexAnalysisValueCreate) -> schemas.ReflexAnalysisValue:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReflexAnalysisValueUpdate) -> schemas.ReflexAnalysisValue:
        data = self._import(obj_in)
        return await super().update(**data)


"""
Many to Many Link between ReflexBrain and ReflexAnalysisValue
"""
reflex_brain_analysis_value = Table(
    "reflex_brain_analysis_value",
    DBModel.metadata,
    Column("reflex_analysis_value_uid", ForeignKey("reflexanalysisvalue.uid"), primary_key=True),
    Column("reflex_brain_uid", ForeignKey("reflexbrain.uid"), primary_key=True),
)

"""
Many to Many Link between ReflexBrain and ReflexAnalysisValue for final values
"""
reflex_brain_finalise = Table(
    "reflex_brain_finalise",
    DBModel.metadata,
    Column("reflex_analysis_value_uid", ForeignKey("reflexanalysisvalue.uid"), primary_key=True),
    Column("reflex_brain_uid", ForeignKey("reflexbrain.uid"), primary_key=True),
)


class ReflexBrainAnalysis(DBModel):
    """
    Many to Many Link between ReflexBrain and Analysis
    with extra data
    """
    analysis_uid = Column(Integer, ForeignKey("analysis.uid"), primary_key=True)
    analysis = relationship("Analysis", lazy="selectin")
    reflex_brain_uid = Column(Integer, ForeignKey("reflexbrain.uid"), primary_key=True)
    count = Column(Integer, default=1)

    @classmethod
    async def create(cls, obj_in: schemas.ReflexBrainCreate) -> schemas.ReflexBrain:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReflexBrainUpdate) -> schemas.ReflexBrain:
        data = self._import(obj_in)
        return await super().update(**data)


class ReflexBrain(Auditable):
    reflex_action_uid = Column(Integer, ForeignKey("reflexaction.uid"), nullable=False, default=1)
    reflex_action = relationship("ReflexAction", back_populates="brains", lazy="selectin")
    description = Column(String, nullable=True)
    analyses_values = relationship("ReflexAnalysisValue", secondary=reflex_brain_analysis_value, lazy="selectin")
    add_new = relationship("ReflexBrainAnalysis", lazy="selectin")
    finalise = relationship("ReflexAnalysisValue", secondary=reflex_brain_finalise, lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.ReflexBrainCreate) -> schemas.ReflexBrain:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReflexBrainUpdate) -> schemas.ReflexBrain:
        data = self._import(obj_in)
        return await super().update(**data)


"""
Many to Many Link between ReflexBrain and ReflexAnalysisValue
"""
reflex_action_analysis_value = Table(
    "reflex_action_analysis_value",
    DBModel.metadata,
    Column("reflex_analysis_value_uid", ForeignKey("reflexanalysisvalue.uid"), primary_key=True),
    Column("reflex_action_uid", ForeignKey("reflexaction.uid"), primary_key=True),
)

"""
Many to Many Link between ReflexBrain and Analysis
"""
reflex_action_analysis = Table(
    "reflex_action_analysis",
    DBModel.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("reflex_action_uid", ForeignKey("reflexaction.uid"), primary_key=True),
)


class ReflexAction(Auditable):
    level = Column(Integer, nullable=False, default=1)
    description = Column(String, nullable=False)
    # triggers
    analysis_uid = Column(Integer, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", lazy="selectin")
    sample_type_uid = Column(Integer, ForeignKey("sampletype.uid"), nullable=True)
    sample_type = relationship("SampleType", lazy="selectin")
    # --
    reflex_rule_uid = Column(Integer, ForeignKey("reflexrule.uid"), nullable=False)
    reflex_rule = relationship("ReflexRule", back_populates="reflex_actions", lazy="selectin")
    # --
    brains = relationship(ReflexBrain, back_populates="reflex_action", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.ReflexActionCreate) -> schemas.ReflexAction:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReflexActionUpdate) -> schemas.ReflexAction:
        data = self._import(obj_in)
        return await super().update(**data)
