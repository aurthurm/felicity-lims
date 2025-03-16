import logging
from typing import List

import strawberry  # noqa
from strawberry.permission import PermissionExtension

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.storage import types
from felicity.api.gql.types import OperationError
from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.guard import FAction, FObject
from felicity.apps.storage import schemas
from felicity.apps.storage.services import (
    StorageContainerService,
    StorageLocationService,
    StorageSectionService,
    StoreRoomService,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

StoreRoomResponse = strawberry.union(
    "StoreRoomResponse",
    (types.StoreRoomType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StoreRoomInputType:
    name: str
    description: str


StorageLocationResponse = strawberry.union(
    "StorageLocationResponse",
    (types.StorageLocationType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StorageLocationInputType:
    name: str
    description: str | None
    store_room_uid: str


StorageSectionResponse = strawberry.union(
    "StorageSectionResponse",
    (types.StorageSectionType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StorageSectionInputType:
    name: str
    description: str | None
    storage_location_uid: str


StorageContainerResponse = strawberry.union(
    "StorageContainerResponse",
    (types.StorageContainerType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StorageContainerInputType:
    name: str
    description: str | None
    storage_section_uid: str
    grid: bool | None = False
    row_wise: bool | None = False
    cols: int | None = 0
    rows: int | None = 0
    slots: int | None = 0


@strawberry.type
class StoredSamplesType:
    samples: List[SampleType]


StoreSampleResponse = strawberry.union(
    "StoreSampleResponse",
    (StoredSamplesType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StoreSamplesInputType:
    sample_uid: str
    storage_slot: str
    storage_slot_index: int
    storage_container_uid: str


@strawberry.type
class StorageMutations:
    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.STORAGE)]
        )]
    )
    async def create_store_room(
            self, info, payload: StoreRoomInputType
    ) -> StoreRoomResponse:
        felicity_user = await auth_from_info(info)

        exists = await StoreRoomService().get(name=payload.name)
        if exists:
            return OperationError(error="StoreRoom with this name already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StoreRoomCreate(**incoming)
        store_room = await StoreRoomService().create(obj_in)
        return types.StoreRoomType(**store_room.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.STORAGE)]
        )]
    )
    async def update_store_room(
            self, info, uid: str, payload: StoreRoomInputType
    ) -> StoreRoomResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        store_room = await StoreRoomService().get(uid=uid)
        if not store_room:
            return OperationError(
                error=f"store_room with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = store_room.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(store_room, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(store_room, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.StoreRoomUpdate(**store_room.to_dict())
        store_room = await StoreRoomService().update(store_room.uid, obj_in)
        return types.StoreRoomType(**store_room.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.STORAGE)]
        )]
    )
    async def create_storage_location(
            self, info, payload: StorageLocationInputType
    ) -> StorageLocationResponse:
        felicity_user = await auth_from_info(info)

        exists = await StorageLocationService().get(name=payload.name)
        if exists:
            return OperationError(error="StorageLocation with this name already exists")

        store_room = await StoreRoomService().get(uid=payload.store_room_uid)
        if not store_room:
            return OperationError(
                error=f"StorageRoom with uid {payload.store_room_uid} does not exists"
            )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StorageLocationCreate(**incoming)
        storage_location = await StorageLocationService().create(obj_in)
        return types.StorageLocationType(**storage_location.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.STORAGE)]
        )]
    )
    async def update_storage_location(
            self, info, uid: str, payload: StorageLocationInputType
    ) -> StorageLocationResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        storage_location = await StorageLocationService().get(uid=uid)
        if not storage_location:
            return OperationError(
                error=f"storage_location with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = storage_location.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(storage_location, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(storage_location, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.StorageLocationUpdate(**storage_location.to_dict())
        storage_location = await StorageLocationService().update(
            storage_location.uid, obj_in
        )
        return types.StorageLocationType(**storage_location.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.STORAGE)]
        )]
    )
    async def create_storage_section(
            self, info, payload: StorageSectionInputType
    ) -> StorageSectionResponse:
        felicity_user = await auth_from_info(info)

        exists = await StorageSectionService().get(name=payload.name)
        if exists:
            return OperationError(error="StorageSection with this name already exists")

        storage_location = await StorageLocationService().get(
            uid=payload.storage_location_uid
        )
        if not storage_location:
            return OperationError(
                error=f"storage_location with uid {payload.storage_location_uid} does not exists"
            )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StorageSectionCreate(**incoming)
        storage_section = await StorageSectionService().create(obj_in)
        return types.StorageSectionType(**storage_section.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.STORAGE)]
        )]
    )
    async def update_storage_section(
            self, info, uid: str, payload: StorageSectionInputType
    ) -> StorageSectionResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        storage_section = await StorageSectionService().get(uid=uid)
        if not storage_section:
            return OperationError(
                error=f"StorageSection with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = storage_section.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(storage_section, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(storage_section, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.StorageSectionUpdate(**storage_section.to_dict())
        storage_section = await StorageSectionService().update(
            storage_section.uid, obj_in
        )
        return types.StorageSectionType(**storage_section.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.STORAGE)]
        )]
    )
    async def create_storage_container(
            self, info, payload: StorageContainerInputType
    ) -> StorageContainerResponse:
        felicity_user = await auth_from_info(info)

        exists = await StorageContainerService().get(name=payload.name)
        if exists:
            return OperationError(
                error="StorageContainer with this name already exists"
            )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "stored_count": 0,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StorageContainerCreate(**incoming)
        storage_container = await StorageContainerService().create(obj_in)

        storage_container = await StorageContainerService().get(
            uid=storage_container.uid
        )
        return types.StorageContainerType(
            **storage_container.marshal_simple(exclude=["samples"])
        )

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.STORAGE)]
        )]
    )
    async def update_storage_container(
            self, info, uid: str, payload: StorageContainerInputType
    ) -> StorageContainerResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        storage_container = await StorageContainerService().get(uid=uid)
        if not storage_container:
            return OperationError(
                error=f"StorageContainer with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = storage_container.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(storage_container, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(storage_container, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.StorageContainerUpdate(**storage_container.to_dict())
        storage_container = await StorageContainerService().update(
            storage_container.uid, obj_in
        )
        return types.StorageContainerType(
            **storage_container.marshal_simple(exclude=["samples"])
        )

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.STORE, FObject.SAMPLE)]
        )]
    )
    async def store_samples(
            info, payload: List[StoreSamplesInputType]
    ) -> StoreSampleResponse:
        felicity_user = await auth_from_info(info)

        if len(payload) == 0:
            return OperationError(error="No Samples to store are provided!")

        # group by container
        container_uids = set()
        for s_item in payload:
            container_uids.add(s_item.storage_container_uid)

        for container_uid in container_uids:
            sample_data = list(
                filter(lambda x: x.storage_container_uid == container_uid, payload)
            )
            samples = await SampleService().get_by_uids(
                uids=[s.sample_uid for s in sample_data]
            )
            container = await StorageContainerService().get(uid=container_uid)

            if len(samples) > container.slots:
                return OperationError(
                    error=f"Selected samples ({len(samples)}) is more than available slots ({container.slots})"
                )

            for idx, _sample in enumerate(samples):
                sample_datum = list(
                    filter(lambda x: x.sample_uid == _sample.uid, sample_data)
                )[0]
                storage_object = {
                    "storage_container_uid": container_uid,
                    "storage_slot": sample_datum.storage_slot,
                    "storage_slot_index": sample_datum.storage_slot_index,
                    "status": SampleState.STORED,
                    "stored_by_uid": felicity_user.uid,
                }
                await SampleService().update(uid=_sample.uid, update=storage_object)

            await StorageContainerService().reset_stored_count(container.uid)

        samples = await SampleService().get_by_uids(
            uids=[s.sample_uid for s in payload]
        )

        return StoredSamplesType(samples=samples)

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.STORE, FObject.SAMPLE)]
        )]
    )
    async def recover_samples(info, sample_uids: List[str]) -> StoreSampleResponse:
        if len(sample_uids) == 0:
            return OperationError(error="No Samples to recover are provided!")

        samples = await SampleService().get_by_uids(uids=sample_uids)

        await SampleService().bulk_update_with_mappings(
            [
                {
                    "uid": _sample.uid,
                    "storage_container_uid": None,
                    "storage_slot": None,
                    "status": SampleState.RECEIVED,
                }
                for idx, _sample in enumerate(samples)
            ]
        )

        samples = await SampleService().get_by_uids(uids=sample_uids)
        return StoredSamplesType(samples=samples)
