from typing import Any, Generator
import logging
import asyncio
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import create_engine
from faker import Faker
import random

from felicity.apps.job.sched import felicity_workforce_init
from felicity.main import flims
from felicity.core.config import settings
from felicity.database.base_class import DBModel
from felicity.init.setup.create_superuser import create_super_user

fake_engine = Faker()

sync_engine = create_engine(settings.SQLALCHEMY_TEST_DATABASE_URI)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def pytest_configure(config):
    logger.info(f"pytest_configure ...")
    if settings.RETAIN_TESTING_DB_DATA:
        DBModel.metadata.drop_all(bind=sync_engine)
    DBModel.metadata.create_all(bind=sync_engine)
    # start scheduler
    felicity_workforce_init()


def pytest_unconfigure(config):
    logger.info(f"pytest_un_configure ...")
    if not settings.RETAIN_TESTING_DB_DATA:
        DBModel.metadata.drop_all(bind=sync_engine)


@pytest_asyncio.fixture(scope="session")
def event_loop():
    """Overrides pytest default function scoped event loop"""
    # return asyncio.get_event_loop()
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def initialise():
    logger.info(f"init_db_add_super_user start")
    await create_super_user()
    yield
    logger.info(f"init_db_add_super_user teardown")


@pytest_asyncio.fixture(scope="function")
async def client_root() -> Generator[AsyncClient, Any, None]:
    async with AsyncClient(app=flims, base_url="http://localhost:8080") as clt:
        yield clt

@pytest_asyncio.fixture(scope="function")
async def client() -> Generator[AsyncClient, Any, None]:
    async with AsyncClient(app=flims, base_url="http://localhost:8080/api/v1") as clt:
        yield clt


@pytest_asyncio.fixture(scope="function")
async def gql_client() -> Generator[AsyncClient, Any, None]:
    async with AsyncClient(app=flims, base_url="http://localhost:8080") as clt:
        yield clt


@pytest_asyncio.fixture(autouse=True)
async def auth_data(client):
    superuser = {"username": settings.FIRST_SEPERUSER_USERNAME, "password": settings.FIRST_SUPERUSER_PASSWORD}
    response = await client.post("/login/access-token", data=superuser)
    return {
        "token": response.json()["access_token"],
        "headers": {
            "Authorization": f"bearer {response.json()['access_token']}"
        }
    }


@pytest_asyncio.fixture(autouse=True)
async def users():
    return [
        {'firstName': "Daniel", 'lastName': "Diesel", 'email': f"daniel@felcity.com", 'openReg': False},
        {'firstName': "Brian", 'lastName': "Moyo", 'email': f"brian@felcity.com", 'openReg': False},
        {'firstName': "Teddy", 'lastName': "Estat", 'email': f"teddy@felcity.com", 'openReg': False},
        {'firstName': "Samantha", 'lastName': "Mapako", 'email': f"samantha@felcity.com", 'openReg': False},
        {'firstName': "Peter", 'lastName': "Tosh", 'email': f"peter@felcity.com", 'openReg': False}
    ]


@pytest_asyncio.fixture(autouse=True)
async def patients():
    return [
        {
            'payload': {
                'clientPatientId': fake_engine.ssn(),
                'firstName': fake_engine.first_name(),
                'middleName': fake_engine.first_name(),
                'lastName': fake_engine.last_name(),
                'age': random.randint(1, 90),
                'gender': random.choice([1, 2, 3]),
                'dateOfBirth': str(fake_engine.date_time()),
                'ageDobEstimated': fake_engine.boolean(),
                'clientUid': random.randint(1, 2),
                'phoneMobile': fake_engine.phone_number(),
                'phoneHome': fake_engine.phone_number(),
                'consentSms': fake_engine.boolean(),
            }
        } for i in range(1)
    ]
