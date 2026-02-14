from broadcaster import Broadcast

from beak.core.config import settings
from .channel import BeakBroadcast

if bool(settings.REDIS_SERVER):
    broadcast = Broadcast(settings.REDIS_SERVER)
else:
    broadcast = BeakBroadcast()
