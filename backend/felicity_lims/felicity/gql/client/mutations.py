import logging
import inspect
from typing import Optional, List, Dict
import strawberry
from strawberry.types import Info

from felicity.apps.client import schemas, models
from felicity.gql.client.types import ClientType, ClientContactType
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class ClientMutations:
    @strawberry.mutation
    async def create_client(self, info: Info, name: str, code: str, district_uid: Optional[int] = None,
                            email: Optional[str] = None, email_cc: Optional[str] = None,
                            consent_email: Optional[bool] = False, phone_mobile: Optional[str] = None,
                            phone_business: Optional[str] = None, consent_sms: Optional[bool] = False,
                            internal_use: Optional[bool] = False, active: Optional[bool] = True) -> ClientType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not code or not name:
            raise Exception("Please Provide a name and a unique client code")

        exists = await models.Client.get(code=code)
        if exists:
            raise Exception(f"Client code {code} already belong to client {exists.name}")

        # incoming = {
        #     "name": name,
        #     "code": code,
        #     "active": active,
        # }

        incoming: Dict = dict()
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.ClientCreate(**incoming)
        client = await models.Client.create(obj_in)
        return client

    @strawberry.mutation
    async def update_client(self, info, uid: int, name: Optional[str] = None, code: Optional[str] = None, district_uid: Optional[int] = None,
                            email: Optional[str] = None, email_cc: Optional[str] = None, consent_email: Optional[bool] = False,
                            mobile_phone: Optional[str] = None, business_phone: Optional[str] = None, consent_sms: Optional[bool] = False,
                            internal_use: Optional[bool] = False, active: Optional[bool] = True) -> ClientType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identify update obj")

        client = await models.Client.get(uid=uid)
        if not client:
            raise Exception(f"Client with uid {uid} not found. Cannot update obj ...")

        obj_data = client.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(client, field, passed_args[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")
        obj_in = schemas.ClientUpdate(**client.to_dict())
        client = await client.update(obj_in)
        return client

    @strawberry.mutation
    async def create_client_contact(self, info, first_name: str, client_uid: int, last_name: Optional[str] = None,
                                    email: Optional[str] = None, email_cc: Optional[str] = None,
                                    mobile_phone: Optional[str] = None, consent_sms: Optional[bool] = False,
                                    is_active: bool = True) -> ClientContactType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not client_uid or not first_name:
            raise Exception("Please Provide a first_name and a client uid")

        client_exists = await models.Client.get(uid=client_uid)
        if not client_exists:
            raise Exception(f"Client with uid {client_uid} does not exist")

        contact_exists = await models.ClientContact.get_all(client_uid=client_uid, first_name=first_name)
        logger.warning(contact_exists)
        if contact_exists:
            raise Exception(f"Client Contact with name {first_name} already exists")

        # incoming = {
        #     "first_name": first_name,
        #     "client_uid": client_uid,
        #     "is_active": True,
        #     "is_superuser": False,
        # }
        incoming: Dict = dict()
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.ClientContactCreate(**incoming)
        client_contact = await models.ClientContact.create(obj_in)
        return client_contact

    @strawberry.mutation
    async def update_client_contact(self, info, uid: int, first_name: str, last_name: Optional[str] = None,
                                    email: Optional[str] = None, email_cc: Optional[str] = None, mobile_phone: Optional[str] = None,
                                    consent_sms: Optional[bool] = False, is_active: bool = True) -> ClientContactType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identify update obj")

        client_contact = await models.ClientContact.get(uid=uid)
        if not client_contact:
            raise Exception(f"Client Contact with uid {uid} not found. Cannot update obj ...")

        obj_data = client_contact.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(client_contact, field, passed_args[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")
        obj_in = schemas.ClientContactUpdate(**client_contact.to_dict())
        client_contact = await client_contact.update(obj_in)
        return client_contact
