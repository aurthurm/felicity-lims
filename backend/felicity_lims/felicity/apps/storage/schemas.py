from typing import Optional

from pydantic import BaseModel
from felicity.apps.analysis import schemas as s_schemas


#
# StoreRoom Schemas
#

# Shared properties
class StoreRoomBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class StoreRoom(StoreRoomBase):
    uid: Optional[int] = None

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
    store_room_uid: int
    store_room: Optional[StoreRoom]


class StorageLocation(StorageLocationBase):
    uid: Optional[int] = None

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
    store_room_uid: int
    store_room: Optional[StoreRoom]


class StorageSection(StorageSectionBase):
    uid: Optional[int] = None

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
    storage_section_uid: int
    storage_section: Optional[StorageSection]
    grid: bool = True
    row_wise: bool = True
    columns: Optional[int]
    rows: Optional[int]


class StorageContainer(StorageContainerBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class StorageContainerCreate(StorageContainerBase):
    pass


# Properties to receive via API on update
class StorageContainerUpdate(StorageContainerBase):
    pass


#
# StorageSlot Schemas
#

# Shared properties
class StorageSlotBase(BaseModel):
    storage_container_uid: int
    storage_container: Optional[StorageContainer]
    position: int
    sample_uid: Optional[int] = None
    sample: Optional[s_schemas.Sample]


class StorageSlot(StorageSlotBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class StorageSlotCreate(StorageSlotBase):
    pass


# Properties to receive via API on update
class StorageSlotUpdate(StorageSlotBase):
    pass
