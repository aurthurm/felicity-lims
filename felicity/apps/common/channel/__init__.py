from broadcaster import Broadcast

from felicity.core.config import settings
from .channel import FelicityBroadcast

if bool(settings.REDIS_SERVER):
    broadcast = Broadcast(f"redis://{settings.REDIS_SERVER}")
else:
    broadcast = FelicityBroadcast()
