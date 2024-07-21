from domain.client.ports.repository import IClientRepository, IClientContactRepository
from domain.client.ports.service import IClientContactService, IClientService
from domain.client.schemas import (
    Client,
    ClientCreate,
    ClientUpdate,
    ClientContact,
    ClientContactCreate,
    ClientContactUpdate,
)
from domain.exceptions import AlreadyExistsError
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.schemas import User


class ClientService(BaseService[Client], IClientService):
    def __init__(self, repository: IClientRepository):
        self.repository = repository
        super().__init__(repository)

    async def search(self, query: str) -> list[Client]:
        return await super().search(name=query, code=query)

    async def create(
            self,
            user: User,
            name: str,
            code: str,
            district_uid: str | None = None,
            email: str | None = None,
            email_cc: str | None = None,
            consent_email: bool | None = False,
            phone_mobile: str | None = None,
            phone_business: str | None = None,
            consent_sms: bool | None = False,
            internal_use: bool | None = False,
            active: bool | None = True,
    ) -> Client:
        payload = locals()

        exists = await self.get(code=code)
        if exists:
            raise AlreadyExistsError(
                f"Client code {code} already belong to client {exists.name}"
            )

        incoming: dict = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = ClientCreate(**incoming)
        return await self.create(**marshal(obj_in))

    async def update(
            self,
            uid: str,
            user: User,
            name: str,
            code: str,
            district_uid: str | None = None,
            email: str | None = None,
            email_cc: str | None = None,
            consent_email: bool | None = False,
            phone_mobile: str | None = None,
            phone_business: str | None = None,
            consent_sms: bool | None = False,
            internal_use: bool | None = False,
            active: bool | None = True,
    ) -> Client:
        payload = locals()

        client = await self.get(uid=uid)

        obj_data = client.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(client, field, payload.__dict__[field])
                except Exception as e:
                    # logger.warning(f"failed to set attribute {field}: {e}")
                    pass

        obj_in = ClientUpdate(**client.to_dict())
        return await client.update(client, **marshal(obj_in))


class ClientContactService(BaseService[ClientContact], IClientContactService):
    def __init__(
            self, repository: IClientContactRepository, client_service: IClientService
    ):
        self.repository = repository
        self.client_service = client_service
        super().__init__(repository)

    async def create(
            self,
            user: User,
            first_name: str,
            client_uid: str,
            last_name: str | None = None,
            email: str | None = None,
            email_cc: str | None = None,
            mobile_phone: str | None = None,
            consent_sms: bool | None = False,
            is_active: bool = True,
    ) -> ClientContact:
        payload = locals()

        client_exists = await self.client_service.get(uid=client_uid)

        contact_exists = await self.get_all(
            client_uid=client_uid, first_name=first_name
        )
        if contact_exists:
            raise AlreadyExistsError(
                f"Client Contact with name {first_name} already exists"
            )

        incoming: dict = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = ClientContactCreate(**incoming)
        return await self.repository.create(**marshal(obj_in))

    async def update(
            self,
            user: User,
            uid: str,
            first_name: str,
            client_uid: str,
            last_name: str | None = None,
            email: str | None = None,
            email_cc: str | None = None,
            mobile_phone: str | None = None,
            consent_sms: bool | None = False,
            is_active: bool = True,
    ) -> ClientContact:
        payload = locals()

        client_contact = await self.get(uid=uid)
        obj_data = client_contact.to_dict()

        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(client_contact, field, payload.__dict__[field])
                except Exception as e:
                    # logger.warning(f"failed to set attribute {field}: {e}")
                    pass

        obj_in = ClientContactUpdate(**client_contact.to_dict())
        return await self.repository.update(client_contact, **marshal(obj_in))

    async def delete(self, uid: str):
        client_contact = await self.get(uid=uid)

        try:
            setattr(client_contact, "is_active", False)
        except Exception as e:
            # logger.warning(f"failed to set attribute is_active: {e}")
            pass

        obj_in = ClientContactUpdate(**client_contact.to_dict())
        await self.repository.update(client_contact, **marshal(obj_in))
