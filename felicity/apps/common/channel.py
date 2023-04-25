# from broadcaster import Broadcast
# broadcast = Broadcast()  # "redis://localhost:6379"

from asyncio import Queue
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from typing import Any, AsyncIterator, Dict, Set


@dataclass
class BroadcastEvent:
    channel: str
    message: Any


@dataclass
class Subscriber:
    queue: "Queue[BroadcastEvent]" = field(default_factory=Queue)

    async def __aiter__(self) -> AsyncIterator[BroadcastEvent]:
        while True:
            item = await self.get()
            yield item

    async def get(self) -> BroadcastEvent:
        item = await self.queue.get()
        return item


@dataclass
class Broadcast:
    subscribers: dict[str, Set[Queue]] = field(default_factory=dict)
    published: Queue = Queue()

    @asynccontextmanager
    async def subscribe(self, channel: str) -> AsyncIterator[Subscriber]:
        subscriber = Subscriber()
        subscribers_set = self.subscribers.get(channel, set())
        subscribers_set.add(subscriber.queue)
        self.subscribers[channel] = subscribers_set
        try:
            yield subscriber
        finally:
            # Remove subscriber on context close
            await self._unsubscribe(channel=channel, subscriber=subscriber)

    async def _unsubscribe(self, channel: str, subscriber: "Subscriber"):
        self.subscribers[channel].remove(subscriber.queue)
        if not self.subscribers[channel]:
            del self.subscribers[channel]

    async def publish(self, channel: str, message: Any):
        event = BroadcastEvent(channel=channel, message=message)
        for subscriber_queue in self.subscribers.get(channel, set()):
            await subscriber_queue.put(event)


broadcast = Broadcast()
