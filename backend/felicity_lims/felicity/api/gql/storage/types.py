from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.user.types import UserType
from felicity.apps.storage import models


@strawberry.type
class StoreRoomType:
    uid: int
    name: str
    description: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]

    @strawberry.field
    async def tag(self, info) -> str:
        return "store-room"

    @strawberry.field
    async def children(self, info) -> List[Optional['StorageLocationType']]:
        storage_location = await models.StorageLocation.get_all(store_room_uid=self.uid)
        return [StorageLocationType(**sl.marshal_simple()) for sl in storage_location]


@strawberry.type
class StorageLocationType:
    uid: int
    name: str
    description: Optional[str]
    store_room_uid: int
    store_room: Optional[StoreRoomType]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-location"

    @strawberry.field
    async def children(self, info) -> List[Optional['StorageSectionType']]:
        storage_section = await models.StorageSection.get_all(storage_location_uid=self.uid)
        return [StorageSectionType(**ss.marshal_simple()) for ss in storage_section]


@strawberry.type
class StorageSectionType:
    uid: int
    name: str
    description: Optional[str]
    storage_location_uid: int
    storage_location: Optional[StorageLocationType]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-section"

    @strawberry.field
    async def children(self, info) -> List[Optional['StorageContainerType']]:
        storage_container = await models.StorageContainer.get_all(storage_section_uid=self.uid)
        return [StorageContainerType(**sc.marshal_simple(exclude=["samples"])) for sc in storage_container]


@strawberry.type
class StorageContainerType:
    uid: int
    name: str
    description: Optional[str]
    storage_section_uid: int
    storage_section: Optional[StorageSectionType]
    grid: Optional[bool]
    row_wise: Optional[bool]
    cols: Optional[int]
    rows: Optional[int]
    slots: Optional[int]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-container"

    @strawberry.field
    async def storage_slots(self, info) -> List[Optional['StorageSlotType']]:
        storage_slots = await models.StorageSlot.get_all(storage_container_uid=self.uid)
        return [StorageSlotType(**sl.marshal_simple()) for sl in storage_slots]


@strawberry.type
class StorageSlotType:
    uid: int
    storage_container_uid: int
    storage_container: Optional[StorageContainerType]
    position: Optional[str]
    position_label: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
