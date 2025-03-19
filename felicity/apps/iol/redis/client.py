from redis import asyncio as aioredis

from felicity.core.config import settings


def create_redis_pool():
    return aioredis.ConnectionPool.from_url(settings.REDIS_SERVER)


async def create_redis_pool_client():
    pool = create_redis_pool()
    return aioredis.Redis.from_pool(pool)


async def create_redis_client():
    return aioredis.from_url(settings.REDIS_SERVER, decode_responses=True)
