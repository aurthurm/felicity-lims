from typing import List, Optional

import strawberry  # noqa
from felicity.api.gql.storage import types
from felicity.api.gql.permissions import IsAuthenticated
from felicity.apps.storage import models


@strawberry.type
class StorageQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def store_room_all(self, info) -> List[types.StoreRoomType]:
        return await models.StoreRoom.all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def store_room_by_uid(self, info, uid: str) -> Optional[types.StoreRoomType]:
        return await models.StoreRoom.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def storage_locations(
        self, info, store_room_uid: str
    ) -> List[types.StorageLocationType]:
        return await models.StorageLocation.get_all(store_room_uid=store_room_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def storage_location_by_uid(
        self, info, uid: str
    ) -> Optional[types.StorageLocationType]:
        return await models.StorageLocation.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def storage_sections(
        self, info, storage_location_uid: str
    ) -> List[types.StorageSectionType]:
        return await models.StorageLocation.get_all(
            storage_location_uid=storage_location_uid
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def storage_section_by_uid(
        self, info, uid: str
    ) -> Optional[types.StorageSectionType]:
        return await models.StorageSection.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def storage_containers(
        self, info, storage_section_uid: str
    ) -> List[types.StorageContainerType]:
        return await models.StorageContainer.get_all(
            storage_section_uid=storage_section_uid
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def storage_container_by_uid(
        self, info, uid: str
    ) -> Optional[types.StorageContainerType]:
        return await models.StorageContainer.get(uid=uid)
