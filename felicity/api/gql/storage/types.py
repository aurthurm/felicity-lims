from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.user.types import UserType
from felicity.apps.storage.services import (
    StorageContainerService,
    StorageLocationService,
    StorageSectionService,
)


@strawberry.type
class StoreRoomType:
    uid: str
    name: str
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def tag(self, info) -> str:
        return "store-room"

    @strawberry.field
    async def children(self, info) -> Optional[List["StorageLocationType"]]:
        storage_location = await StorageLocationService().get_all(
            store_room_uid=self.uid
        )
        return [StorageLocationType(**sl.marshal_simple()) for sl in storage_location]


@strawberry.type
class StorageLocationType:
    uid: str
    name: str
    description: str | None = None
    store_room_uid: str
    store_room: Optional[StoreRoomType] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-location"

    @strawberry.field
    async def children(self, info) -> Optional[List["StorageSectionType"]]:
        storage_section = await StorageSectionService().get_all(
            storage_location_uid=self.uid
        )
        return [StorageSectionType(**ss.marshal_simple()) for ss in storage_section]


@strawberry.type
class StorageSectionType:
    uid: str
    name: str
    description: str | None = None
    storage_location_uid: str
    storage_location: Optional[StorageLocationType] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-section"

    @strawberry.field
    async def children(self, info) -> Optional[List["StorageContainerType"]]:
        storage_container = await StorageContainerService().get_all(
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
    description: str | None = None
    storage_section_uid: str
    storage_section: Optional[StorageSectionType] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    grid: bool | None = None
    row_wise: bool | None = None
    cols: int | None = None
    rows: int | None = None
    slots: int | None = None
    stored_count: int | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def tag(self, info) -> str:
        return "storage-container"
