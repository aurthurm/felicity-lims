from beak.apps.abstract.service import BaseService
from beak.apps.analysis.entities.analysis import Sample
from beak.apps.analysis.services.analysis import SampleService
from beak.apps.storage.entities import (
    StorageContainer,
    StorageLocation,
    StorageSection,
    StoreRoom,
)
from beak.apps.storage.repository import (
    StorageContainerRepository,
    StorageLocationRepository,
    StorageSectionRepository,
    StoreRoomRepository,
)
from beak.apps.storage.schemas import (
    StorageContainerCreate,
    StorageContainerUpdate,
    StorageLocationCreate,
    StorageLocationUpdate,
    StorageSectionCreate,
    StorageSectionUpdate,
    StoreRoomCreate,
    StoreRoomUpdate,
)


class StoreRoomService(BaseService[StoreRoom, StoreRoomCreate, StoreRoomUpdate]):
    def __init__(self):
        super().__init__(StoreRoomRepository())


class StorageLocationService(
    BaseService[StorageLocation, StorageLocationCreate, StorageLocationUpdate]
):
    def __init__(self):
        super().__init__(StorageLocationRepository())


class StorageSectionService(
    BaseService[StorageSection, StorageSectionCreate, StorageSectionUpdate]
):
    def __init__(self):
        self.sample_service = SampleService()
        super().__init__(StorageSectionRepository())


class StorageContainerService(
    BaseService[StorageContainer, StorageContainerCreate, StorageContainerUpdate]
):
    def __init__(self):
        self.sample_service = SampleService()
        super().__init__(StorageContainerRepository())

    async def get_samples(self, storage_container_uid: str) -> list[Sample]:
        return await self.sample_service.get_all(
            storage_container_uid=storage_container_uid
        )

    async def reset_stored_count(self, uid: str) -> None:
        samples = await self.get_samples(uid)
        await self.update(uid, {"stored_count": len(samples)})
