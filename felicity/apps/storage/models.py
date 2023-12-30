from typing import List

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from apps import BaseAuditDBModel
from apps.analysis.models.analysis import Sample
from apps.storage import schemas


class StoreRoom(BaseAuditDBModel):
    """Store Room"""

    __tablename__ = "store_room"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: dict | schemas.StoreRoomCreate) -> schemas.StoreRoom:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | schemas.StoreRoomUpdate) -> schemas.StoreRoom:
        data = self._import(obj_in)
        return await super().update(**data)


class StorageLocation(BaseAuditDBModel):
    """Storage Location
    e.g: Fridge, CupBoard, Floor, Box, etc
    """

    __tablename__ = "storage_location"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    store_room_uid = Column(String, ForeignKey("store_room.uid"), nullable=False)
    store_room = relationship(StoreRoom, backref="storage_locations", lazy="selectin")

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StorageLocationCreate
    ) -> schemas.StorageLocation:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StorageLocationUpdate
    ) -> schemas.StorageLocation:
        data = self._import(obj_in)
        return await super().update(**data)


class StorageSection(BaseAuditDBModel):
    """Storage Location Section/Compartment
    e.g: Shelve, Tray, Rack, etc
    """

    __tablename__ = "storage_section"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    storage_location_uid = Column(
        String, ForeignKey("storage_location.uid"), nullable=False
    )
    storage_location = relationship(
        StorageLocation, backref="storage_sections", lazy="selectin"
    )

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StorageSectionCreate
    ) -> schemas.StorageSection:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StorageSectionUpdate
    ) -> schemas.StorageSection:
        data = self._import(obj_in)
        return await super().update(**data)


class StorageContainer(BaseAuditDBModel):
    """Storage Carrier
    e.g: Sample K-Lite, etc
    """

    __tablename__ = "storage_container"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    storage_section_uid = Column(
        String, ForeignKey("storage_section.uid"), nullable=False
    )
    storage_section = relationship(
        StorageSection, backref="storage_containers", lazy="selectin"
    )
    slots = Column(Integer, nullable=False, default=0)  # number of samples
    grid = Column(Boolean(), default=True)
    row_wise = Column(Boolean(), default=False)
    cols = Column(Integer, nullable=True)
    rows = Column(Integer, nullable=True)
    samples = relationship(
        "Sample", back_populates="storage_container", lazy="selectin"
    )
    stored_count = Column(Integer, nullable=False, default=0)

    async def get_samples(self) -> List[Sample]:
        return await Sample.get_all(storage_container_uid=self.uid)

    async def reset_stored_count(self) -> None:
        samples = await self.get_samples()
        count = len(samples)
        self.stored_count = count
        await self.save()

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StorageContainerCreate
    ) -> schemas.StorageContainer:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StorageContainerUpdate
    ) -> schemas.StorageContainer:
        data = self._import(obj_in)
        return await super().update(**data)
