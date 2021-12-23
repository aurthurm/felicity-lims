import logging

from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from felicity.apps.analysis import schemas
from felicity.apps.setup.models.setup import Department
from felicity.apps import DBModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class QCSet(DBModel):
    """A Set/Group of QC Samples that are run together.
     - e.g a Viral Load Rack the QCLevels are a set i.e Negative Control, Low Pos Control, High Pos Control
    """
    name = Column(String, nullable=False)
    note = Column(String, nullable=True)
    samples = relationship("Sample", back_populates='qc_set', lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.QCSetCreate) -> schemas.QCSet:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.QCSetUpdate) -> schemas.QCSet:
        data = self._import(obj_in)
        return await super().update(**data)


class QCLevel(DBModel):
    """Sample Level /category
    - None - normal sample
    - Negative Control
    - PositiveControl
    - Low Positive Control
    - High Positive Control
    """
    level = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.QCLevelCreate) -> schemas.QCLevel:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.QCLevelUpdate) -> schemas.QCLevel:
        data = self._import(obj_in)
        return await super().update(**data)


"""
Many to Many Link between QCTemplate and Department
"""
qctdlink = Table('qctdlink', DBModel.metadata,
                 Column("department_uid", ForeignKey('department.uid'), primary_key=True),
                 Column("qc_template_uid", ForeignKey('qctemplate.uid'), primary_key=True)
                 )

"""
Many to Many Link between QCTemplate and  QCLevel
"""
qctqcllink = Table('qctqcllink', DBModel.metadata,
                   Column("qc_level_uid", ForeignKey('qclevel.uid'), primary_key=True),
                   Column("qc_template_uid", ForeignKey('qctemplate.uid'), primary_key=True)
                   )


class QCTemplate(DBModel):
    """QC Level Grouping e.g:
    Roche Viral Load CQ:
        - Neg Control
        - Low Pos Control
        - High Pos Control

    Malaria Slide QC:
        - Negative Control
        - Positive COntrol
    """
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    departments = relationship(Department, secondary=qctdlink, backref="qc_templates", lazy="selectin")
    qc_levels = relationship(QCLevel, secondary=qctqcllink, backref="qc_templates", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.QCTemplateCreate) -> schemas.QCTemplate:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.QCTemplateUpdate) -> schemas.QCTemplate:
        data = self._import(obj_in)
        return await super().update(**data)
