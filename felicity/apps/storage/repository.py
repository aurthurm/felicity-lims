from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.storage.entities import (
    StorageContainer,
    StorageLocation,
    StorageSection,
    StoreRoom,
)


class StoreRoomRepository(BaseRepository[StoreRoom]):
    def __init__(self) -> None:
        super().__init__(StoreRoom)


class StorageLocationRepository(BaseRepository[StorageLocation]):
    def __init__(self) -> None:
        super().__init__(StorageLocation)


class StorageSectionRepository(BaseRepository[StorageSection]):
    def __init__(self) -> None:
        super().__init__(StorageSection)


class StorageContainerRepository(BaseRepository[StorageContainer]):
    def __init__(self) -> None:
        super().__init__(StorageContainer)
