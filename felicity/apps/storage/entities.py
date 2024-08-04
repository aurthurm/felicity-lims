from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from felicity.apps.abstract import BaseEntity


class StoreRoom(BaseEntity):
    """Store Room"""

    __tablename__ = "store_room"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class StorageLocation(BaseEntity):
    """Storage Location
    e.g: Fridge, CupBoard, Floor, Box, etc
    """

    __tablename__ = "storage_location"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    store_room_uid = Column(String, ForeignKey("store_room.uid"), nullable=False)
    store_room = relationship(StoreRoom, backref="storage_locations", lazy="selectin")


class StorageSection(BaseEntity):
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


class StorageContainer(BaseEntity):
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
