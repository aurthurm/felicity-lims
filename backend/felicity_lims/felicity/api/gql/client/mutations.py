import logging
from typing import Dict, Optional

import strawberry  # noqa
from felicity.api.gql import OperationError, auth_from_info, verify_user_auth
from felicity.api.gql.client.types import ClientContactType, ClientType
from felicity.apps.client import models, schemas
from strawberry.types import Info  # noqa

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ClientResponse = strawberry.union(
    "ClientResponse", (ClientType, OperationError), description=""  # noqa
)

ClientContactResponse = strawberry.union(
    "ClientContactResponse", (ClientContactType, OperationError), description=""  # noqa
)


@strawberry.input
class ClientInputType:
    name: str
    code: str
    district_uid: Optional[int] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    consent_email: Optional[bool] = False
    phone_mobile: Optional[str] = None
    phone_business: Optional[str] = None
    consent_sms: Optional[bool] = False
    internal_use: Optional[bool] = False
    active: Optional[bool] = True


@strawberry.input
class ClientContactInputType:
    first_name: str
    client_uid: int
    last_name: Optional[str] = None
    mail: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    consent_sms: Optional[bool] = False
    is_active: bool = True


@strawberry.type
class ClientMutations:
    @strawberry.mutation
    async def create_client(
        self, info: Info, payload: ClientInputType
    ) -> ClientResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        success, auth_err = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create clients",
        )
        if not success:
            return auth_err

        if not payload.code or not payload.name:
            return OperationError(
                error="Please Provide a name and a unique client code"
            )

        exists = await models.Client.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Client code {payload.code} already belong to client {exists.name}"
            )

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ClientCreate(**incoming)
        client: models.Client = await models.Client.create(obj_in)
        return ClientType(**client.marshal_simple())

    @strawberry.mutation
    async def update_client(
        self, info, uid: int, payload: ClientInputType
    ) -> ClientResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update clients",
        )

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        client = await models.Client.get(uid=uid)
        if not client:
            return OperationError(
                error=f"Client with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = client.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(client, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")
        obj_in = schemas.ClientUpdate(**client.to_dict())
        client = await client.update(obj_in)
        return ClientType(**client.marshal_simple())

    @strawberry.mutation
    async def create_client_contact(
        self, info, payload: ClientContactInputType
    ) -> ClientContactResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create client contacts",
        )

        if not payload.client_uid or not payload.first_name:
            return OperationError(error="Please Provide a first_name and a client uid")

        client_exists = await models.Client.get(uid=payload.client_uid)
        if not client_exists:
            return OperationError(
                error=f"Client with uid {payload.client_uid} does not exist"
            )

        contact_exists = await models.ClientContact.get_all(
            client_uid=payload.client_uid, first_name=payload.first_name
        )  # noqa
        logger.warning(contact_exists)
        if contact_exists:
            return OperationError(
                error=f"Client Contact with name {payload.first_name} already exists"
            )

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ClientContactCreate(**incoming)
        client_contact: models.ClientContact = await models.ClientContact.create(obj_in)
        return ClientContactType(**client_contact.marshal_simple())

    @strawberry.mutation
    async def update_client_contact(
        self, info, uid: int, payload: ClientContactInputType
    ) -> ClientContactResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update client contacts",
        )

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        client_contact = await models.ClientContact.get(uid=uid)
        if not client_contact:
            return OperationError(
                error=f"Client Contact with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = client_contact.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(client_contact, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")
        obj_in = schemas.ClientContactUpdate(**client_contact.to_dict())
        client_contact = await client_contact.update(obj_in)
        return ClientContactType(**client_contact.marshal_simple())
