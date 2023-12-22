import logging

import pytest_asyncio
from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine

from core.config import settings
from database.base_class import DBModel

fake_engine = Faker()

engine = create_async_engine(settings.SQLALCHEMY_TEST_DATABASE_URI)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest_asyncio.fixture(scope="function", autouse=True)
async def setup():
    logger.info(f"pytest_configure unittest...")
    async with engine.begin() as conn:
        await conn.run_sync(DBModel.metadata.create_all)

    connection = engine.connect()
    yield connection

    async with engine.begin() as conn:
        await conn.run_sync(DBModel.metadata.drop_all)
