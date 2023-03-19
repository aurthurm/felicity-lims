from typing import Optional

from pydantic import BaseModel
from felicity.core.uid_gen import FelicityIDType

#
# StoreRoom Schemas
#

# Shared properties
class StoreRoomBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class StoreRoom(StoreRoomBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


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
    name: Optional[str] = None
    description: Optional[str] = None
    store_room_uid: FelicityIDType
    store_room: Optional[StoreRoom]


class StorageLocation(StorageLocationBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


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
    name: Optional[str] = None
    description: Optional[str] = None
    storage_location_uid: FelicityIDType
    storage_location: Optional[StorageLocation]


class StorageSection(StorageSectionBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


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
    name: Optional[str] = None
    description: Optional[str] = None
    storage_section_uid: FelicityIDType
    storage_section: Optional[StorageSection]
    grid: bool = False
    row_wise: bool = False
    cols: Optional[int]
    rows: Optional[int]
    slots: Optional[int] = 0
    stored_count: Optional[int] = 0


class StorageContainer(StorageContainerBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class StorageContainerCreate(StorageContainerBase):
    pass


# Properties to receive via API on update
class StorageContainerUpdate(StorageContainerBase):
    pass
