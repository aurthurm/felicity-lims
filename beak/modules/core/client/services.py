from beak.modules.core.abstract.service import BaseService
from beak.modules.core.client.entities import Client, ClientContact
from beak.modules.core.client.repositories import ClientContactRepository, ClientRepository
from beak.modules.core.client.schemas import (
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
