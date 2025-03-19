from broadcaster import Broadcast

from felicity.core.config import settings
from .channel import FelicityBroadcast

if bool(settings.REDIS_SERVER):
    broadcast = Broadcast(settings.REDIS_SERVER)
else:
    broadcast = FelicityBroadcast()
