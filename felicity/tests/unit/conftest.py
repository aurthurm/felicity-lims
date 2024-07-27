import logging

import pytest_asyncio
from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine

from felicity.database.base import BaseEntity
from felicity.core.config import settings

fake_engine = Faker()

engine = create_async_engine(settings.SQLALCHEMY_TEST_DATABASE_URI)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest_asyncio.fixture(scope="function", autouse=True)
async def setup():
    logger.info("pytest_configure unittest...")
    async with engine.begin() as conn:
        await conn.run_sync(BaseEntity.metadata.create_all)

    connection = engine.connect()
    yield connection

    async with engine.begin() as conn:
        await conn.run_sync(BaseEntity.metadata.drop_all)
