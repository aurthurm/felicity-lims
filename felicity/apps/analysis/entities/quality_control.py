from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from infrastructure.database import BaseAuditDBModel, DBModel
from infrastructure.database.setup.entities.setup import Department


class QCSet(BaseAuditDBModel):
    """A Set/Group of QC Samples that are run together.
    - e.g a Viral Load Rack the QCLevels are a set i.e Negative Control, Low Pos Control, High Pos Control
    """

    __tablename__ = "qc_set"

    name = Column(String, nullable=False)
    note = Column(String, nullable=True)
    samples = relationship("Sample", back_populates="qc_set", lazy="selectin")


"""
Many to Many Link between QCReference and  Analysis
"""
qc_reference_analysis = Table(
    "qc_reference_analysis",
    DBModel.metadata,
    Column("qc_reference_uid", ForeignKey("qc_reference.uid"), primary_key=True),
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
)


class QCReference(BaseAuditDBModel):
    """QC Sample Reference Material    :: Not Implemented Yet
    - can have multi analytes/Profile
    - states: Active (in-use - there must be only 1 active per analysis)
              InActive awaiting activation
              Depleted
    """

    __tablename__ = "qc_reference"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    analyses = relationship(
        "Analysis", secondary=qc_reference_analysis, lazy="selectin"
    )
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    is_string_result = Column(Boolean, nullable=True)
    # string results
    expected_result = Column(String, nullable=True)
    # numeric results
    min_value = Column(Float, nullable=True)
    max_value = Column(Float, nullable=True)
    allowable_error = Column(Float, nullable=True)
    # dates
    ref_date_created = Column(DateTime, nullable=True)
    ref_date_opened = Column(DateTime, nullable=True)
    ref_date_expiry = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    # source of reference material or In-house
    manufacturer = Column(String, nullable=True)
    supplier = Column(String, nullable=True)
    catalog_number = Column(String, nullable=True)
    lot_number = Column(String, nullable=True)


class QCLevel(BaseAuditDBModel):
    """Sample Level /category
    - None - normal sample
    - Negative Control
    - EID PositiveControl
    - HIV Low Positive Control
    - HIV High Positive Control
    """

    __tablename__ = "qc_level"

    level = Column(String, nullable=False)
    # department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    # department = relationship(
    #     "Department", lazy="selectin"
    # )
    # # Default Reference Value to be override by QCReference sample values
    # is_string_result = Column(Boolean, nullable=True)
    # expected_result = Column(String, nullable=True)
    # min_value = Column(Float, nullable=True)
    # max_value = Column(Float, nullable=True)
    # allowable_error = Column(Float, nullable=True)


"""
Many to Many Link between QCTemplate and Department
"""
qc_template_department = Table(
    "qc_template_department",
    DBModel.metadata,
    Column("department_uid", ForeignKey("department.uid"), primary_key=True),
    Column("qc_template_uid", ForeignKey("qc_template.uid"), primary_key=True),
)

"""
Many to Many Link between QCTemplate and  QCLevel
"""
qc_template_qc_level = Table(
    "qc_template_qc_level",
    DBModel.metadata,
    Column("qc_level_uid", ForeignKey("qc_level.uid"), primary_key=True),
    Column("qc_template_uid", ForeignKey("qc_template.uid"), primary_key=True),
)


class QCTemplate(BaseAuditDBModel):
    """QC Level Grouping e.g:
    Roche Viral Load CQ:
        - Neg Control
        - Low Pos Control
        - High Pos Control

    Malaria Slide QC:
        - Negative Control
        - Positive COntrol
    """

    __tablename__ = "qc_template"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    departments = relationship(
        Department,
        secondary=qc_template_department,
        backref="qc_templates",
        lazy="selectin",
    )
    qc_levels = relationship(
        QCLevel, secondary=qc_template_qc_level, backref="qc_templates", lazy="selectin"
    )
