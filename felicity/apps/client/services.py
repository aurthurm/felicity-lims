from felicity.apps.abstract.service import BaseService
from felicity.apps.client.entities import Client, ClientContact
from felicity.apps.client.repositories import ClientContactRepository, ClientRepository
from felicity.apps.client.schemas import (
    ClientContactCreate,
    ClientContactUpdate,
    ClientCreate,
    ClientUpdate,
)


class ClientService(BaseService[Client, ClientCreate, ClientUpdate]):
    def __init__(self):
        super().__init__(ClientRepository())

    async def search(self, query: str | None = None) -> list[Client]:
        return await super().search(name=query, code=query)


class ClientContactService(
    BaseService[ClientContact, ClientContactCreate, ClientContactUpdate]
):
    def __init__(self):
        super().__init__(ClientContactRepository())
