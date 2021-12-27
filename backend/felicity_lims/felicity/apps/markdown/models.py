from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship, backref

from felicity.database.base_class import DBModel
from felicity.apps.setup.models.setup import Department
from felicity.apps.user.models import User
from . import schemas


class DocumentCategory(DBModel):
    name = Column(String)

    @classmethod
    async def create(cls, obj_in: schemas.DocumentCategoryCreate) -> schemas.DocumentCategory:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.DocumentCategoryUpdate) -> schemas.DocumentCategory:
        data = self._import(obj_in)
        return await super().update(**data)


class DocumentTag(DBModel):
    name = Column(String)

    @classmethod
    async def create(cls, obj_in: schemas.DocumentTagCreate) -> schemas.DocumentTag:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.DocumentTagUpdate) -> schemas.DocumentTag:
        data = self._import(obj_in)
        return await super().update(**data)


document_tags = Table("document_tags", DBModel.metadata,
                      Column("document_uid", ForeignKey('document.uid'), primary_key=True),
                      Column("tag_uid", ForeignKey('documenttag.uid'), primary_key=True),
                      )

document_authors = Table("document_authors", DBModel.metadata,
                         Column("document_uid", ForeignKey('document.uid'), primary_key=True),
                         Column("user_uid", ForeignKey('user.uid'), primary_key=True),
                         )

document_readers = Table("document_readers", DBModel.metadata,
                         Column("document_uid", ForeignKey('document.uid'), primary_key=True),
                         Column("user_uid", ForeignKey('user.uid'), primary_key=True),
                         )


class Document(DBModel):
    name = Column(String)
    subtitle = Column(String)
    document_id = Column(String)
    content = Column(String)
    version = Column(String)
    tags = relationship(DocumentTag, secondary=document_tags,  lazy="selectin")
    authors = relationship(User, secondary=document_authors, lazy="selectin")
    readers = relationship(User, secondary=document_readers, lazy="selectin")
    department_uid = Column(Integer, ForeignKey('department.uid'), nullable=True)
    department = relationship(Department, lazy="selectin")
    category_uid = Column(Integer, ForeignKey('documentcategory.uid'), nullable=True)
    category = relationship(DocumentCategory, lazy="selectin")
    created_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    modified_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    date_archived = Column(DateTime, nullable=True)
    archived_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    date_recalled = Column(DateTime, nullable=True)
    recalled_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    date_effected = Column(DateTime, nullable=True)
    effected_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    date_approved = Column(DateTime, nullable=True)
    approved_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    last_accessed = Column(DateTime, nullable=True)
    last_accessed_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    status = Column(String)

    @classmethod
    async def create(cls, obj_in: schemas.DocumentCreate) -> schemas.Document:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.DocumentUpdate) -> schemas.Document:
        data = self._import(obj_in)
        return await super().update(**data)
