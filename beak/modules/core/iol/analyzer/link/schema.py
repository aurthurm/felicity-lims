from typing import Union

from pydantic import BaseModel

from .conf import ProtocolType, SocketType, ConnectionType


class InstrumentConfig(BaseModel):
    uid: int
    name: str
    code: Union[str, None] = None
    host: Union[str, None] = None
    port: Union[int, None] = None
    auto_reconnect: bool = True
    connection_type: Union[ConnectionType, None] = None
    socket_type: Union[SocketType, None] = None
    protocol_type: Union[ProtocolType, None] = None
    is_active: bool
