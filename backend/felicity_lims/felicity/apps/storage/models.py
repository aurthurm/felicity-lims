from felicity.apps import BaseAuditDBModel
from felicity.apps.storage import schemas
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class StoreRoom(BaseAuditDBModel):
    """Store Room"""

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.StoreRoomCreate) -> schemas.StoreRoom:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StoreRoomUpdate) -> schemas.StoreRoom:
        data = self._import(obj_in)
        return await super().update(**data)


class StorageLocation(BaseAuditDBModel):
    """Storage Location
    e.g: Fridge, CupBoard, Box, etc
    """

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    store_room_uid = Column(Integer, ForeignKey("storeroom.uid"), nullable=False)
    store_room = relationship(StoreRoom, backref="storage_locations", lazy="selectin")

    @classmethod
    async def create(
        cls, obj_in: schemas.StorageLocationCreate
    ) -> schemas.StorageLocation:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.StorageLocationUpdate
    ) -> schemas.StorageLocation:
        data = self._import(obj_in)
        return await super().update(**data)


class StorageSection(BaseAuditDBModel):
    """Storage Location Section/Compartment
    e.g: Shelve, Tray, Rack, etc
    """

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    storage_location_uid = Column(
        Integer, ForeignKey("storagelocation.uid"), nullable=False
    )
    storage_location = relationship(
        StorageLocation, backref="storage_sections", lazy="selectin"
    )

    @classmethod
    async def create(
        cls, obj_in: schemas.StorageSectionCreate
    ) -> schemas.StorageSection:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.StorageSectionUpdate
    ) -> schemas.StorageSection:
        data = self._import(obj_in)
        return await super().update(**data)


class StorageContainer(BaseAuditDBModel):
    """Storage Container
    e.g: Sample K-Lite, etc
    """

    name = Column(String, nullable=False)
    storage_section_uid = Column(
        Integer, ForeignKey("storagesection.uid"), nullable=False
    )
    storage_section = relationship(
        StorageSection, backref="storage_containers", lazy="selectin"
    )
    grid = Column(Boolean(), default=True)
    row_wise = Column(Boolean(), default=True)
    columns = Column(Integer, nullable=False)
    rows = Column(Integer, nullable=False)

    @classmethod
    async def create(
        cls, obj_in: schemas.StorageContainerCreate
    ) -> schemas.StorageContainer:

        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.StorageContainerUpdate
    ) -> schemas.StorageContainer:
        data = self._import(obj_in)
        return await super().update(**data)


class StorageSlot(BaseAuditDBModel):
    """Storage Container Sample Slot
    e.g: Sample K-Lite, etc
    """

    storage_container_uid = Column(
        Integer, ForeignKey("storagecontainer.uid"), nullable=False
    )
    storage_container = relationship(
        StorageContainer, backref="storage_slots", lazy="selectin"
    )
    position = Column(String, nullable=False)
    sample_uid = Column(Integer, ForeignKey("sample.uid"), nullable=True)
    sample = relationship("Sample", backref="storage_slots", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.StorageSlotCreate) -> schemas.StorageSlot:

        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StorageSlotUpdate) -> schemas.StorageSlot:
        data = self._import(obj_in)
        return await super().update(**data)
