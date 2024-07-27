from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.client.entities import Client, ClientContact


class ClientRepository(BaseRepository[Client]):
    def __init__(self) -> None:
        super().__init__(Client)


class ClientContactRepository(BaseRepository[ClientContact]):
    def __init__(self) -> None:
        super().__init__(ClientContact)
