import asyncio
import logging
import random

import pytest_asyncio
from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine

from core.config import settings
from database.base_class import DBModel
from init.setup.create_superuser import create_super_user
from main import felicity

fake_engine = Faker()

engine = create_async_engine(settings.SQLALCHEMY_TEST_DATABASE_URI)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest_asyncio.fixture(scope="session")
async def setup():
    logger.info(f"pytest_configure ...")
    async with engine.begin() as conn:
        # await conn.run_sync(DBModel.metadata.drop_all)
        await conn.run_sync(DBModel.metadata.create_all)

    connection = engine.connect()
    yield connection

    async with engine.begin() as conn:
        await conn.run_sync(DBModel.metadata.drop_all)


@pytest_asyncio.fixture(scope="session")
def event_loop():
    """Overrides pytest default function scoped event loop"""
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def initialise(setup):
    logger.info(f"init_db_add_super_user start")
    await create_super_user()
    yield
    logger.info(f"init_db_add_super_user teardown")


@pytest_asyncio.fixture
def app():
    yield felicity


@pytest_asyncio.fixture(autouse=True)
async def auth_data(app):
    authe = """
        mutation Auth($username: String!, $password: String!){
          authenticateUser(username: $username, password: $password) {
            ... on AuthenticatedData {
                user {
                    uid
                    firstName
                    lastName
                }
                token  
            }
            ... on OperationError {
                error
            }
          }
        }
    """

    req, response = await app.asgi_client.post("felicity-gql", json={
        "query": authe, "variables": {
            "username": settings.FIRST_SEPERUSER_USERNAME,
            "password": settings.FIRST_SUPERUSER_PASSWORD
        }
    })
    data = response.json["data"]["authenticateUser"]
    return {
        "token": data["token"],
        "headers": {"Authorization": f"bearer {data['token']}"},
    }


@pytest_asyncio.fixture(autouse=True)
async def users():
    return [
        {
            "firstName": "Daniel",
            "lastName": "Diesel",
            "email": f"daniel@felcity.com",
            "openReg": False,
        },
        {
            "firstName": "Brian",
            "lastName": "Moyo",
            "email": f"brian@felcity.com",
            "openReg": False,
        },
        {
            "firstName": "Teddy",
            "lastName": "Estat",
            "email": f"teddy@felcity.com",
            "openReg": False,
        },
        {
            "firstName": "Samantha",
            "lastName": "Mapako",
            "email": f"samantha@felcity.com",
            "openReg": False,
        },
        {
            "firstName": "Peter",
            "lastName": "Tosh",
            "email": f"peter@felcity.com",
            "openReg": False,
        },
    ]


@pytest_asyncio.fixture(autouse=True)
async def patients():
    return [
        {
            "payload": {
                "clientPatientId": fake_engine.ssn(),
                "firstName": fake_engine.first_name(),
                "middleName": fake_engine.first_name(),
                "lastName": fake_engine.last_name(),
                "age": random.randint(1, 90),
                "gender": random.choice([1, 2, 3]),
                "dateOfBirth": str(fake_engine.date_time()),
                "ageDobEstimated": fake_engine.boolean(),
                "clientUid": random.randint(1, 2),
                "phoneMobile": fake_engine.phone_number(),
                "phoneHome": fake_engine.phone_number(),
                "consentSms": fake_engine.boolean(),
            }
        }
        for i in range(1)
    ]
