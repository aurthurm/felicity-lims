"""Uses dragonfly as redis"""

from broadcaster import Broadcast

from felicity.core.config import settings

broadcast = Broadcast(f"redis://{settings.REDIS_SERVER}")
