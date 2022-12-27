from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.user.types import UserType


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
    storage_slots: Optional[List[Optional['StorageSlotType']]]
    samples: Optional[List[Optional[SampleType]]]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


@strawberry.type
class StorageSlotType:
    uid: int
    storage_container_uid: int
    storage_container: Optional[StorageContainerType]
    position: Optional[str]
    position_label: Optional[str]
    sample: Optional[SampleType]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
