import json

from felicity.apps.common.channel import broadcast
from felicity.apps.notification.enum import NotificationChannel
from felicity.core.config import settings
from .client import create_redis_client


class TaskGuard:
    """Track background processing
    This will help notify the frontend to lock and prevent user taking action
    on these objects

    Note: Easiest implementation is by using Job service.
    Reason is that all bg tasks go through job - samples, worksheets :)
    However for minute objects like Result actions we might action on the specific implementations :)
    """

    def __init__(self):
        self._store = {}

    @property
    def _has_redis(self):
        return bool(settings.REDIS_SERVER)

    @staticmethod
    async def connect():
        return await create_redis_client()

    async def process(self, uid: str, object_type: str):
        if self._has_redis:
            redis = await self.connect()
            await redis.hset(f"{uid}", "status", "processing")  # Updated for hset instead of hmset
        else:
            self._store[uid] = {"status": "processing"}

        await broadcast.publish(
            NotificationChannel.PROCESSING,
            json.dumps(
                {"uid": uid, "object_type": object_type, "status": "processing"}
            ),
        )

    async def release(self, uid: str, object_type: str):
        if self._has_redis:
            redis = await self.connect()
            await redis.delete(uid)
        else:
            self._store.pop(uid, None)

        await broadcast.publish(
            NotificationChannel.PROCESSING,
            json.dumps({"uid": uid, "object_type": object_type, "status": "released"}),
        )

    async def is_processing(self, uid: str, object_type: str):
        if self._has_redis:
            redis = await self.connect()
            exists = await redis.exists(uid)
        else:
            exists = uid in self._store

        await broadcast.publish(
            NotificationChannel.PROCESSING,
            json.dumps(
                {"uid": uid, "object_type": object_type, "status": "processing"}
            ),
        )
        return exists


task_guard = TaskGuard()
