import asyncio_redis

from felicity.core.config import settings


async def create_redis_pool():
    server = settings.REDIS_SERVER.split(":")
    return await asyncio_redis.Pool.create(
        host=server[0], port=server[1], poolsize=10
    )
