import json

from felicity.apps.common.channel import broadcast
from felicity.apps.notification.enum import NotificationChannel
from .client import create_redis_pool


class ProcessingTracker:

    @staticmethod
    async def connect():
        pool = await create_redis_pool()
        redis = await pool.get_connection()
        return pool, redis

    async def process(self, uid: str, object_type: str):
        pool, redis = await self.connect()
        await redis.hmset(f"{uid}", {"status": "processing"})
        pool.release(redis)
        await broadcast.publish(NotificationChannel.PROCESSING, json.dumps({
            "uid": uid, "object_type": object_type, "status": "processing"
        }))

    async def release(self, uid: str, object_type: str):
        pool, redis = await self.connect()
        await redis.delete(uid)
        pool.release(redis)
        await broadcast.publish(NotificationChannel.PROCESSING, json.dumps({
            "uid": uid, "object_type": object_type, "status": "released"
        }))

    async def is_processing(self, uid: str, object_type: str):
        pool, redis = await self.connect()
        exists = await redis.exists(uid)
        pool.release(redis)
        await broadcast.publish(NotificationChannel.PROCESSING, json.dumps({
            "uid": uid, "object_type": object_type, "status": "processing"
        }))
        return exists
