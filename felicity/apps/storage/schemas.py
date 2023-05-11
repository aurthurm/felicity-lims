from typing import Optional


from pydantic import BaseModel

#
# StoreRoom Schemas
#

# Shared properties


class StoreRoomBase(BaseModel):
    name: str | None = None
    description: str | None = None


class StoreRoom(StoreRoomBase):
    uid: str| None = None

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
    name: str | None = None
    description: str | None = None
    store_room_uid: str
    store_room: Optional[StoreRoom]


class StorageLocation(StorageLocationBase):
    uid: str| None = None

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
    name: str | None = None
    description: str | None = None
    storage_location_uid: str
    storage_location: Optional[StorageLocation]


class StorageSection(StorageSectionBase):
    uid: str| None = None

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
    name: str | None = None
    description: str | None = None
    storage_section_uid: str
    storage_section: Optional[StorageSection]
    grid: bool = False
    row_wise: bool = False
    cols: int | None
    rows: int | None
    slots: int | None = 0
    stored_count: int | None = 0


class StorageContainer(StorageContainerBase):
    uid: str| None = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class StorageContainerCreate(StorageContainerBase):
    pass


# Properties to receive via API on update
class StorageContainerUpdate(StorageContainerBase):
    pass
