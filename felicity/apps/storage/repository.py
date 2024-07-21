from domain.storage.ports.repository import (
    IStoreRoomRepository,
    IStorageLocationRepository,
    IStorageSectionRepository,
    IStorageContainerRepository,
)

from felicity.apps.repository.base import BaseRepository

from felicity.apps.storage.entities import (
    StoreRoom,
    StorageLocation,
    StorageSection,
    StorageContainer,
)


class StoreRoomRepository(BaseRepository[StoreRoom], IStoreRoomRepository):
    def __init__(self) -> None:
        self.model = StoreRoom
        super().__init__()


class StorageLocationRepository(
    BaseRepository[StorageLocation], IStorageLocationRepository
):
    def __init__(self) -> None:
        self.model = StorageLocation
        super().__init__()


class StorageSectionRepository(
    BaseRepository[StorageSection], IStorageSectionRepository
):
    def __init__(self) -> None:
        self.model = StorageSection
        super().__init__()


class StorageContainerRepository(
    BaseRepository[StorageContainer], IStorageContainerRepository
):
    def __init__(self) -> None:
        self.model = StorageContainer
        super().__init__()
