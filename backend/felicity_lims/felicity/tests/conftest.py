from typing import Any, Generator

import pytest_asyncio
from fastapi import FastAPI
from felicity.core.config import settings
from felicity.main import flims
from httpx import AsyncClient
from sqlalchemy import create_engine

engine = create_engine(settings.SQLALCHEMY_ASYNC_DATABASE_URI)


@pytest_asyncio.fixture(scope="function")
async def app() -> Generator[FastAPI, Any, None]:
    """
    Create a fresh database on each test case.
    """
    # async with async_engine.begin() as conn:
    #     await conn.run_sync(DBModel.metadata.create_all)

    yield flims

    # async with async_engine.begin() as conn:
    #     await conn.run_sync(DBModel.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def appX() -> Generator[FastAPI, Any, None]:
    from alembic.config import Config
    from alembic import command
    import os, inspect

    this_file_directory = os.path.dirname(os.path.abspath(inspect.stack()[0][1]))
    root_directory = os.path.join(this_file_directory, "../..")
    alembic_directory = os.path.join(root_directory, "migrations")
    ini_path = os.path.join(root_directory, "alembic.ini")

    config = Config(ini_path)
    config.set_main_option("script_location", alembic_directory)

    command.upgrade(config, "head")

    yield flims


@pytest_asyncio.fixture(scope="function")
async def client(app: FastAPI) -> Generator[AsyncClient, Any, None]:
    async with AsyncClient(app=app, base_url="http://localhost:8080/api/v1") as client:
        yield client


#  pytest tests --asyncio-mode=strict
