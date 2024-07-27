import logging
import asyncio

import pytest_asyncio
from faker import Faker

from felicity.apps.abstract.entity import BaseEntity
from felicity.database.session import async_engine

fake_engine = Faker()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest_asyncio.fixture(scope="session")
def event_loop():
    """Overrides pytest default function scoped event loop"""
    # return asyncio.get_event_loop()
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()



@pytest_asyncio.fixture(scope="session")
async def setup():
    logger.info("pytest_configure integration tests...")
    async with async_engine.begin() as conn:
        await conn.run_sync(BaseEntity.metadata.drop_all)
        await conn.run_sync(BaseEntity.metadata.create_all)

    connection = async_engine.connect()
    yield connection

    # async with async_engine.begin() as conn:
    #     await conn.run_sync(BaseEntity.metadata.drop_all)