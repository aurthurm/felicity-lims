import logging
import random
from typing import Any, AsyncGenerator

import pytest_asyncio
from faker import Faker
from httpx import AsyncClient
from felicity.lims.seeds.superusers import seed_super_user
from felicity.lims.seeds.groups_perms import seed_groups_perms

from felicity.core.config import settings
from felicity.main import felicity

fake_engine = Faker()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest_asyncio.fixture(scope="session", autouse=True)
async def initialise(setup):
    logger.info("init_db_add_super_user start")
    await seed_groups_perms()
    await seed_super_user()
    yield
    logger.info("init_db_add_super_user teardown")


@pytest_asyncio.fixture(scope="function")
async def app_root() -> AsyncGenerator[AsyncClient, Any, None]:
    async with AsyncClient(app=felicity, base_url="http://localhost:8080") as clt:
        yield clt


@pytest_asyncio.fixture(scope="function")
async def app_api() -> AsyncGenerator[AsyncClient, Any, None]:
    async with AsyncClient(
        app=felicity, base_url="http://localhost:8080/api/v1"
    ) as clt:
        yield clt


@pytest_asyncio.fixture(scope="function")
async def app_gql() -> AsyncGenerator[AsyncClient, Any, None]:
    async with AsyncClient(app=felicity, base_url="http://localhost:8080") as clt:
        yield clt


@pytest_asyncio.fixture(autouse=True)
async def auth_data(app_gql):
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

    response = await app_gql.post(
        "felicity-gql",
        json={
            "query": authe,
            "variables": {
                "username": settings.FIRST_SUPERUSER_USERNAME,
                "password": settings.FIRST_SUPERUSER_PASSWORD,
            },
        },
    )
    data = response.json()["data"]["authenticateUser"]
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
            "email": "daniel@felcity.com",
            "openReg": False,
        },
        {
            "firstName": "Brian",
            "lastName": "Moyo",
            "email": "brian@felcity.com",
            "openReg": False,
        },
        {
            "firstName": "Teddy",
            "lastName": "Estat",
            "email": "teddy@felcity.com",
            "openReg": False,
        },
        {
            "firstName": "Samantha",
            "lastName": "Mapako",
            "email": "samantha@felcity.com",
            "openReg": False,
        },
        {
            "firstName": "Peter",
            "lastName": "Tosh",
            "email": "peter@felcity.com",
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
