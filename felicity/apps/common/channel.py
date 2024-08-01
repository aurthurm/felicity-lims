"""Uses dragonfly as redis"""

from broadcaster import Broadcast

broadcast = Broadcast("redis://localhost:6379")
