import pytest
import logging
from faker import  Faker

from felicity.tests.utils.client import add_client_query
fake_engine = Faker()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(20)
async def test_register_client(gql_client, auth_data):
    client = {
                'name': fake_engine.name(),
                'code': fake_engine.ssn(),
                'phoneMobile': fake_engine.phone_number(),
                'email': fake_engine.email(),
                'phoneBusiness': fake_engine.phone_number(),
                'consentSms': fake_engine.boolean(),
                'active': True,
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_client_query,
        "variables": {
            "payload": client
        }
    }, headers=auth_data['headers'])

    logger.info(f"register client response: {response} {response.json()}")

    assert response.status_code == 200
    _patient = response.json()["data"]["createClient"]
    assert _patient["uid"] == 1
    assert _patient["code"] == client["code"]
    assert _patient["name"] == client["name"]
    assert _patient["phoneMobile"] == client["phoneMobile"]
    assert _patient["active"] is True
