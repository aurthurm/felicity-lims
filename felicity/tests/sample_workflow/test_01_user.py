import logging

import pytest

from core.config import settings
from tests.utils.user import (
    add_auth_mutation,
    add_user_mutation,
    make_password,
    make_username,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(10)
async def test_user_login(app):
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
                tokenType
            }
            ... on OperationError {
                error
            }
          }
        }
    """

    _, response = await app.asgi_client.post("felicity-gql", json={
        "query": authe, "variables": {
            "username": settings.FIRST_SEPERUSER_USERNAME,
            "password": settings.FIRST_SUPERUSER_PASSWORD
        }
    })
    data = response.json["data"]["authenticateUser"]
    logger.info(f"superuser_login response: {response} {response.json}")
    assert response.status_code == 200
    assert data["token"] is not None
    assert data["tokenType"] == "bearer"


@pytest.mark.asyncio
@pytest.mark.order(14)
async def test_register_users(app, users, auth_data):
    _final = []
    for user in users:
        _, response = await app.asgi_client.post(
            "felicity-gql", json={"query": add_user_mutation, "variables": user},
            headers=auth_data["headers"]
        )

        logger.info(f"register_users response: {response} {response.json}")

        assert response.status_code == 200
        _user = response.json["data"]["createUser"]
        assert _user["uid"] is not None
        assert _user["firstName"] == user["firstName"]
        assert _user["lastName"] == user["lastName"]
        assert _user["uid"] is not True
        _final.append(_user)

    _auths = []
    for auth in _final:
        _, response = await app.asgi_client.post(
            "/felicity-gql",
            json={
                "query": add_auth_mutation,
                "variables": {
                    "userUid": auth["uid"],
                    "userName": make_username(auth["firstName"]),
                    "password": make_password(auth["firstName"]),
                    "passwordc": make_password(auth["firstName"]),
                },
            },
            headers=auth_data["headers"]
        )

        logger.info(f"add-auth response: {response} {response.json}")
        assert response.status_code == 200
        _auth = response.json["data"]["createUserAuth"]
        _auths.append(_auth)
        assert _auth["uid"] == auth["uid"]
        assert _auth["auth"]["userName"] == auth["firstName"].lower()

    assert len(_final) == len(_auths)
