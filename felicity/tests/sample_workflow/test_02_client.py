import logging

import pytest
from faker import Faker

fake_engine = Faker()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

add_client_query = """
  mutation AddClient($payload: ClientInputType!){
      createClient(payload: $payload) {
        __typename
        ... on ClientType {
          uid
          name
          code
          email
          phoneMobile
          phoneBusiness
          active
        }
        ... on OperationError {
          error
          suggestion
        }
      }
    }
"""


@pytest.mark.asyncio
@pytest.mark.order(20)
async def test_register_client(app, auth_data):
    client = {
        "name": fake_engine.name(),
        "code": fake_engine.ssn(),
        "phoneMobile": fake_engine.phone_number(),
        "email": fake_engine.email(),
        "phoneBusiness": fake_engine.phone_number(),
        "consentSms": fake_engine.boolean(),
        "active": True,
    }
    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={"query": add_client_query, "variables": {"payload": client}},
        headers=auth_data["headers"],
    )

    logger.info(f"register client response: {response} {response.json}")

    assert response.status_code == 200
    _patient = response.json["data"]["createClient"]
    assert _patient["uid"] is not None
    assert _patient["code"] == client["code"]
    assert _patient["name"] == client["name"]
    assert _patient["phoneMobile"] == client["phoneMobile"]
    assert _patient["active"] is True
