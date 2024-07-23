from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.user.types import UserType
from felicity.apps.storage.entities import StorageLocation, StorageSection, StorageContainer


@strawberry.type
class StoreRoomType:
    uid: str
    name: str
    description: str | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None

    @strawberry.field
    async def tag(self, info) -> str:
        return "store-room"

    @strawberry.field
    async def children(self, info) -> List[Optional["StorageLocationType"]]:
        storage_location = await StorageLocation.get_all(store_room_uid=self.uid)
        return [StorageLocationType(**sl.marshal_simple()) for sl in storage_location]


@strawberry.type
class StorageLocationType:
    uid: str
    name: str
    description: str | None
    store_room_uid: str
    store_room: Optional[StoreRoomType]
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-location"

    @strawberry.field
    async def children(self, info) -> List[Optional["StorageSectionType"]]:
        storage_section = await StorageSection.get_all(
            storage_location_uid=self.uid
        )
        return [StorageSectionType(**ss.marshal_simple()) for ss in storage_section]


@strawberry.type
class StorageSectionType:
    uid: str
    name: str
    description: str | None
    storage_location_uid: str
    storage_location: Optional[StorageLocationType]
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-section"

    @strawberry.field
    async def children(self, info) -> List[Optional["StorageContainerType"]]:
        storage_container = await StorageContainer.get_all(
            storage_section_uid=self.uid
        )
        return [
            StorageContainerType(**sc.marshal_simple(exclude=["samples"]))
            for sc in storage_container
        ]


@strawberry.type
class StorageContainerType:
    uid: str
    name: str
    description: str | None
    storage_section_uid: str
    storage_section: Optional[StorageSectionType]
    grid: bool | None
    row_wise: bool | None
    cols: int | None
    rows: int | None
    slots: int | None
    stored_count: int | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-container"
