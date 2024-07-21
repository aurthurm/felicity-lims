from domain.analysis.conf import SampleStates
from domain.analysis.ports.service.analysis import ISampleService
from domain.analysis.schemas import Sample
from domain.exceptions import *
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.storage.ports import StoreSampleIn
from domain.storage.ports.repository import (
    IStoreRoomRepository,
    IStorageLocationRepository,
    IStorageSectionRepository,
    IStorageContainerRepository,
)
from domain.storage.ports.service import (
    IStoreRoomService,
    IStorageLocationService,
    IStorageSectionService,
    IStorageContainerService,
)
from domain.storage.schemas import (
    StoreRoom,
    StorageLocation,
    StorageSection,
    StorageContainer,
    StoreRoomCreate,
    StoreRoomUpdate,
    StorageLocationCreate,
    StorageLocationUpdate,
    StorageSectionCreate,
    StorageSectionUpdate,
    StorageContainerCreate,
    StorageContainerUpdate,
)
from domain.user.schemas import User


class StoreRoomService(BaseService[StoreRoom], IStoreRoomService):
    def __init__(self, repository: IStoreRoomRepository):
        self.repository = repository

    async def create(
            self, name: str, description: str, felicity_user: User
    ) -> StoreRoom:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"StoreRoom with this name {name} already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = StoreRoomCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
            self, info, uid: str, name: str, description: str, felicity_user: User
    ) -> StoreRoom:
        payload = locals()

        store_room = await self.get(uid=uid)
        if not store_room:
            raise AlreadyExistsError(
                f"store_room with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = marshal(store_room)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(store_room, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(store_room, "updated_by_uid", felicity_user.uid)

        obj_in = StoreRoomUpdate(**marshal(store_room))
        return await super().update(store_room, **marshal(obj_in))


class StorageLocationService(BaseService[StorageLocation], IStorageLocationService):
    def __init__(
            self,
            repository: IStorageLocationRepository,
            store_room_service: IStoreRoomService,
    ):
        self.repository = repository
        self.store_room_service = store_room_service

    async def create(
            self, name: str, description: str, store_room_uid: str, felicity_user: User
    ) -> StorageLocation:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"StorageLocation with name {name} already exists")

        store_room = await self.store_room_service.get(uid=store_room_uid)

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = StorageLocationCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
            self,
            info,
            uid: str,
            name: str,
            description: str | None,
            store_room_uid: str,
            felicity_user: User,
    ) -> StorageLocation:
        payload = locals()

        storage_location = await self.get(uid=uid)

        obj_data = storage_location.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(storage_location, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(storage_location, "updated_by_uid", felicity_user.uid)

        obj_in = StorageLocationUpdate(**marshal(storage_location))
        return await super().update(storage_location, **marshal(obj_in))


class StorageSectionService(BaseService[StorageSection], IStorageSectionService):
    def __init__(
            self,
            repository: IStorageSectionRepository,
            storage_location_service: IStorageLocationService,
    ):
        self.repository = repository
        self.storage_location_service = storage_location_service

    async def create(
            self,
            name: str,
            description: str | None,
            storage_location_uid: str,
            felicity_user: User,
    ) -> StorageSection:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"StorageSection with name {name} already exists")

        storage_location = await self.storage_location_service.get(
            uid=storage_location_uid
        )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = StorageSectionCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
            self,
            info,
            uid: str,
            name: str,
            description: str | None,
            storage_location_uid: str,
            felicity_user: User,
    ) -> StorageSection:
        payload = locals()

        storage_section = await self.get(uid=uid)

        obj_data = storage_section.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(storage_section, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(storage_section, "updated_by_uid", felicity_user.uid)

        obj_in = StorageSectionUpdate(**marshal(storage_section))
        return await super().update(storage_section, **marshal(obj_in))


class StorageContainerService(BaseService[StorageContainer], IStorageContainerService):
    def __init__(
            self, repository: IStorageContainerRepository, sample_service: ISampleService
    ):
        self.repository = repository
        self.sample_service = sample_service

    async def get_samples(self, storage_container_uid: str) -> list[Sample]:
        return await self.sample_service.get_all(
            storage_container_uid=storage_container_uid
        )

    async def reset_stored_count(self, storage_container) -> None:
        samples = await self.get_samples(storage_container.uid)
        count = len(samples)
        storage_container.stored_count = count
        await super().update(storage_container, **marshal(storage_container))

    async def create(
            self,
            name: str,
            description: str | None,
            storage_section_uid: str,
            grid: bool | None,
            row_wise: bool | None,
            cols: int | None,
            rows: int | None,
            felicity_user: User,
    ) -> StorageContainer:
        payload = locals()

        exists = await self.get(name=name)

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "stored_count": 0,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = StorageContainerCreate(**incoming)
        storage_container = await super().create(**marshal(obj_in))
        return await self.get(uid=storage_container.uid)

    async def update(
            self,
            uid: str,
            name: str,
            description: str | None,
            storage_section_uid: str,
            grid: bool | None,
            row_wise: bool | None,
            cols: int | None,
            rows: int | None,
            felicity_user: User,
    ) -> StorageContainer:
        payload = locals()

        storage_container = await self.get(uid=uid)

        obj_data = storage_container.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(storage_container, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(storage_container, "updated_by_uid", felicity_user.uid)

        obj_in = StorageContainerUpdate(**marshal(storage_container))
        return await super().update(storage_container, **marshal(obj_in))

    async def store_samples(
            self, payload: list[StoreSampleIn], felicity_user: User
    ) -> list[Sample]:

        # group by container
        container_uids = set()
        for s_item in payload:
            container_uids.add(s_item.get("storage_container_uid"))

        for container_uid in container_uids:
            sample_data = list(
                filter(lambda x: x.storage_container_uid == container_uid, payload)
            )
            samples = await self.sample_service.get_by_uids(
                uids=[s.sample_uid for s in sample_data]
            )
            container = await self.get(uid=container_uid)

            if len(samples) > container.slots:
                raise GenericError(
                    f"Selected samples ({len(samples)}) is more than available slots ({container.slots})"
                )

            for idx, _sample in enumerate(samples):
                sample_datum = list(
                    filter(lambda x: x.sample_uid == _sample.uid, sample_data)
                )[0]
                storage_object = {
                    "storage_container_uid": container_uid,
                    "storage_slot": sample_datum.storage_slot,
                    "storage_slot_index": sample_datum.storage_slot_index,
                    "status": SampleStates.STORED,
                    "stored_by_uid": felicity_user.uid,
                }
                await self.sample_service.update(_sample, **storage_object)

            await self.reset_stored_count(container)

        return await self.sample_service.get_by_uids(
            uids=[s.get("sample_uid") for s in payload]
        )

    async def recover_samples(self, sample_uids: list[str]) -> list[Sample]:
        samples = await self.sample_service.get_by_uids(uids=sample_uids)

        await self.sample_service.bulk_update_with_mappings(
            [
                {
                    "uid": _sample.uid,
                    "storage_container_uid": None,
                    "storage_slot": None,
                    "status": SampleStates.RECEIVED,
                }
                for idx, _sample in enumerate(samples)
            ]
        )
        return await self.sample_service.get_by_uids(uids=sample_uids)
