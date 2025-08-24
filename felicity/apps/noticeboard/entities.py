from sqlalchemy import Column, DateTime, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity, BaseEntity

"""
 Many to Many Link between Users and Notices
"""
notice_view: Table = Table(
    "notice_view",
    BaseEntity.metadata,
    Column("notice_uid", ForeignKey("notice.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Group and Notices
"""
group_notice: Table = Table(
    "group_notice",
    BaseEntity.metadata,
    Column("notice_uid", ForeignKey("notice.uid"), primary_key=True),
    Column("group_uid", ForeignKey("group.uid"), primary_key=True),
)

"""
 Many to Many Link between Department and Notices
"""
department_notice: Table = Table(
    "department_notice",
    BaseEntity.metadata,
    Column("notice_uid", ForeignKey("notice.uid"), primary_key=True),
    Column("department_uid", ForeignKey("department.uid"), primary_key=True),
)


class Notice(LabScopedEntity):
    """Notice"""

    __tablename__ = "notice"

    departments = relationship(
        "Department", secondary=department_notice, lazy="selectin"
    )
    groups = relationship("Group", secondary=group_notice, lazy="selectin")
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    viewers = relationship("User", secondary=notice_view, lazy="selectin")
    expiry: bool = Column(DateTime, nullable=False)
