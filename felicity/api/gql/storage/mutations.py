import logging
from typing import Dict, List, Optional

import strawberry  # noqa
from api.gql import OperationError, auth_from_info, verify_user_auth
from api.gql.analysis.types.analysis import SampleType
from api.gql.storage import types
from apps.analysis.conf import states as analysis_states
from apps.analysis.models import analysis as an_models
from apps.storage import models, schemas
from core.uid_gen import FelicityID

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

StoreRoomResponse = strawberry.union(
    "StoreRoomResponse", (types.StoreRoomType, OperationError), description=""  # noqa
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
    description: Optional[str]
    store_room_uid: FelicityID


StorageSectionResponse = strawberry.union(
    "StorageSectionResponse",
    (types.StorageSectionType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StorageSectionInputType:
    name: str
    description: Optional[str]
    storage_location_uid: FelicityID


StorageContainerResponse = strawberry.union(
    "StorageContainerResponse",
    (types.StorageContainerType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StorageContainerInputType:
    name: str
    description: Optional[str]
    storage_section_uid: FelicityID
    grid: Optional[bool] = False
    row_wise: Optional[bool] = False
    cols: Optional[int] = 0
    rows: Optional[int] = 0
    slots: Optional[int] = 0


@strawberry.type
class StoredSamplesType:
    samples: List[SampleType]


StoreSampleResponse = strawberry.union(
    "StoreSampleResponse", (StoredSamplesType, OperationError), description=""  # noqa
)


@strawberry.input
class StoreSamplesInputType:
    sample_uid: FelicityID
    storage_slot: str
    storage_slot_index: int
    storage_container_uid: FelicityID


@strawberry.type
class StorageMutations:
    @strawberry.mutation
    async def create_store_room(
        self, info, payload: StoreRoomInputType
    ) -> StoreRoomResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create store rooms",
        )
        if not auth_success:
            return auth_error

        exists = await models.StoreRoom.get(name=payload.name)
        if exists:
            return OperationError(error=f"StoreRoom with this name already exists")

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StoreRoomCreate(**incoming)
        store_room: models.StoreRoom = await models.StoreRoom.create(obj_in)
        return types.StoreRoomType(**store_room.marshal_simple())

    @strawberry.mutation
    async def update_store_room(
        self, info, uid: FelicityID, payload: StoreRoomInputType
    ) -> StoreRoomResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update store rooms",
        )

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        store_room: models.StoreRoom = await models.StoreRoom.get(uid=uid)
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
        store_room = await store_room.update(obj_in)
        return types.StoreRoomType(**store_room.marshal_simple())

    @strawberry.mutation
    async def create_storage_location(
        self, info, payload: StorageLocationInputType
    ) -> StorageLocationResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create storage locations",
        )
        if not auth_success:
            return auth_error

        exists = await models.StorageLocation.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"StorageLocation with this name already exists"
            )

        store_room = await models.StoreRoom.get(uid=payload.store_room_uid)
        if not store_room:
            return OperationError(
                error=f"StorageRoom with uid {payload.store_room_uid} does not exists"
            )

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StorageLocationCreate(**incoming)
        storage_location: models.StorageLocation = await models.StorageLocation.create(
            obj_in
        )
        return types.StorageLocationType(**storage_location.marshal_simple())

    @strawberry.mutation
    async def update_storage_location(
        self, info, uid: FelicityID, payload: StorageLocationInputType
    ) -> StorageLocationResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update storage locations",
        )

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        storage_location: models.StorageLocation = await models.StorageLocation.get(
            uid=uid
        )
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
        storage_location = await storage_location.update(obj_in)
        return types.StorageLocationType(**storage_location.marshal_simple())

    @strawberry.mutation
    async def create_storage_section(
        self, info, payload: StorageSectionInputType
    ) -> StorageSectionResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create storage sections",
        )
        if not auth_success:
            return auth_error

        exists = await models.StorageSection.get(name=payload.name)
        if exists:
            return OperationError(error=f"StorageSection with this name already exists")

        storage_location = await models.StorageLocation.get(
            uid=payload.storage_location_uid
        )
        if not storage_location:
            return OperationError(
                error=f"storage_location with uid {payload.storage_location_uid} does not exists"
            )

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StorageSectionCreate(**incoming)
        storage_section: models.StorageSection = await models.StorageSection.create(
            obj_in
        )
        return types.StorageSectionType(**storage_section.marshal_simple())

    @strawberry.mutation
    async def update_storage_section(
        self, info, uid: FelicityID, payload: StorageSectionInputType
    ) -> StorageSectionResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update storage sections",
        )

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        storage_section: models.StorageSection = await models.StorageSection.get(
            uid=uid
        )
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
        storage_section = await storage_section.update(obj_in)
        return types.StorageSectionType(**storage_section.marshal_simple())

    @strawberry.mutation
    async def create_storage_container(
        self, info, payload: StorageContainerInputType
    ) -> StorageContainerResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create storage containers",
        )
        if not auth_success:
            return auth_error

        exists = await models.StorageContainer.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"StorageContainer with this name already exists"
            )

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "stored_count": 0,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StorageContainerCreate(**incoming)
        storage_container: models.StorageContainer = (
            await models.StorageContainer.create(obj_in)
        )

        storage_container = await models.StorageContainer.get(uid=storage_container.uid)
        return types.StorageContainerType(
            **storage_container.marshal_simple(exclude=["samples"])
        )

    @strawberry.mutation
    async def update_storage_container(
        self, info, uid: FelicityID, payload: StorageContainerInputType
    ) -> StorageContainerResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update storage container",
        )

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        storage_container: models.StorageContainer = await models.StorageContainer.get(
            uid=uid
        )
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
        storage_container = await storage_container.update(obj_in)
        return types.StorageContainerType(
            **storage_container.marshal_simple(exclude=["samples"])
        )

    @strawberry.mutation
    async def store_samples(
        info, payload: List[StoreSamplesInputType]
    ) -> StoreSampleResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can submit analysis results",
        )

        if len(payload) == 0:
            return OperationError(error=f"No Samples to store are provided!")

        # group by container
        container_uids = set()
        for s_item in payload:
            container_uids.add(s_item.storage_container_uid)

        for container_uid in container_uids:
            sample_data = list(
                filter(lambda x: x.storage_container_uid ==
                       container_uid, payload)
            )
            samples = await an_models.Sample.get_by_uids(
                uids=[s.sample_uid for s in sample_data]
            )
            container: models.StorageContainer = await models.StorageContainer.get(
                uid=container_uid
            )

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
                    "status": analysis_states.sample.STORED,
                    "stored_by_uid": felicity_user.uid,
                }
                await _sample.update(obj_in=storage_object)

            await container.reset_stored_count()

        samples = await an_models.Sample.get_by_uids(
            uids=[s.sample_uid for s in payload]
        )

        return StoredSamplesType(samples=samples)

    @strawberry.mutation
    async def recover_samples(
        info, sample_uids: List[FelicityID]
    ) -> StoreSampleResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can recover stored samples",
        )

        if len(sample_uids) == 0:
            return OperationError(error=f"No Samples to recover are provided!")

        samples = await an_models.Sample.get_by_uids(uids=sample_uids)

        await an_models.Sample.bulk_update_with_mappings(
            [
                {
                    "uid": _sample.uid,
                    "storage_container_uid": None,
                    "storage_slot": None,
                    "status": analysis_states.sample.RECEIVED,
                }
                for idx, _sample in enumerate(samples)
            ]
        )

        samples = await an_models.Sample.get_by_uids(uids=sample_uids)
        return StoredSamplesType(samples=samples)
