from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.storage.entities import StorageContainer, StorageLocation, StorageSection, StoreRoom
from felicity.apps.storage.repository import StorageContainerRepository, StorageLocationRepository, StorageSectionRepository, StoreRoomRepository


class StoreRoomService(BaseService[StoreRoom]):
    def __init__(self):
        super().__init__(StoreRoomRepository)


class StorageLocationService(BaseService[StorageLocation]):
    def __init__(self):
        super().__init__(StorageLocationRepository)


class StorageSectionService(BaseService[StorageSection]):
    def __init__(self):
        self.sample_service = SampleService()
        super().__init__(StorageSectionRepository)


class StorageContainerService(BaseService[StorageContainer]):
    def __init__(self):
        super().__init__(StorageContainerRepository)

    async def get_samples(self, storage_container_uid: str) -> list[Sample]:
        return await self.sample_service.get_all(
            storage_container_uid=storage_container_uid
        )

    async def reset_stored_count(self, storage_container) -> None:
        samples = await self.get_samples(storage_container.uid)
        count = len(samples)
        storage_container.stored_count = count
        await self.update(storage_container, **marshaller(storage_container))
