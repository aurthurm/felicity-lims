from typing import Optional

from pydantic import BaseModel
from pydantic import ConfigDict


#
# StoreRoom Schemas
#

# Shared properties


class StoreRoomBase(BaseModel):
    name: str | None = None
    description: str | None = None


class StoreRoom(StoreRoomBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class StoreRoomCreate(StoreRoomBase):
    pass


# Properties to receive via API on update
class StoreRoomUpdate(StoreRoomBase):
    pass


#
# StorageLocation Schemas
#

# Shared properties
class StorageLocationBase(BaseModel):
    name: str | None = None
    description: str | None = None
    store_room_uid: str
    store_room: Optional[StoreRoom] = None


class StorageLocation(StorageLocationBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class StorageLocationCreate(StorageLocationBase):
    pass


# Properties to receive via API on update
class StorageLocationUpdate(StorageLocationBase):
    pass


#
# StorageSection Schemas
#

# Shared properties
class StorageSectionBase(BaseModel):
    name: str | None = None
    description: str | None = None
    storage_location_uid: str
    storage_location: Optional[StorageLocation] = None


class StorageSection(StorageSectionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class StorageSectionCreate(StorageSectionBase):
    pass


# Properties to receive via API on update
class StorageSectionUpdate(StorageSectionBase):
    pass


#
# StorageContainer Schemas
#

# Shared properties
class StorageContainerBase(BaseModel):
    name: str | None = None
    description: str | None = None
    storage_section_uid: str
    storage_section: Optional[StorageSection] = None
    grid: bool = False
    row_wise: bool = False
    cols: int | None = None
    rows: int | None = None
    slots: int | None = 0
    stored_count: int | None = 0


class StorageContainer(StorageContainerBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class StorageContainerCreate(StorageContainerBase):
    pass


# Properties to receive via API on update
class StorageContainerUpdate(StorageContainerBase):
    pass
