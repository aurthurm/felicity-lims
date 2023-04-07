import logging

import pytest

from felicity.core.config import settings
from felicity.tests.utils.user import (
    add_auth_mutation,
    add_user_mutation,
    make_password,
    make_username,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(10)
async def test_user_login(client):
    superuser = {
        "username": settings.FIRST_SEPERUSER_USERNAME,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = await client.post("/login/access-token", data=superuser)
    logger.info(f"superuser_login response: {response} {response.json()}")
    assert response.status_code == 200
    assert response.json()["access_token"] is not None
    assert response.json()["token_type"] == "bearer"


@pytest.mark.asyncio
@pytest.mark.order(11)
async def test_user_password_recover(client):
    email = settings.FIRST_SUPERUSER_EMAIL
    response = await client.post(f"/login/password-recovery/{email}")
    logger.info(f"password_reset response: {response} {response.json()}")
    assert response.status_code == 200
    assert response.json()["msg"] == "Password recovery email sent"


@pytest.mark.asyncio
@pytest.mark.order(12)
async def test_user_password_reset(client, auth_data):
    reset_data = {
        "token": auth_data["token"],
        "new_password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = await client.post("/login/reset-password", json=reset_data)
    logger.info(f"reset-password response: {response} {response.json()}")
    assert response.status_code == 200
    logger.info(f"reset-password response: {response} {response.json()}")
    assert response.json()["msg"] == "Password updated successfully"


@pytest.mark.asyncio
@pytest.mark.order(13)
async def test_access_token(client, auth_data):
    token = {"token": auth_data["token"]}
    response = await client.post(
        "/login/test-token", data=token, headers=auth_data["headers"]
    )
    logger.info(f"test-token response: {response} {response.json()}")
    assert response.status_code == 200
    assert response.json()["email"] == settings.FIRST_SUPERUSER_EMAIL


@pytest.mark.asyncio
@pytest.mark.order(14)
async def test_register_users(gql_client, users):
    _final = []
    for user in users:
        response = await gql_client.post(
            "/felicity-gql", json={"query": add_user_mutation, "variables": user}
        )

        logger.info(f"register_users response: {response} {response.json()}")

        assert response.status_code == 200
        _user = response.json()["data"]["createUser"]
        assert _user["uid"] is not None
        assert _user["firstName"] == user["firstName"]
        assert _user["lastName"] == user["lastName"]
        assert _user["uid"] is not True
        _final.append(_user)

    _auths = []
    for auth in _final:
        response = await gql_client.post(
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
        )

        logger.info(f"add-auth response: {response} {response.json()}")
        assert response.status_code == 200
        _auth = response.json()["data"]["createUserAuth"]
        _auths.append(_auth)
        assert _auth["uid"] == auth["uid"]
        assert _auth["auth"]["userName"] == auth["firstName"].lower()

    assert len(_final) == len(_auths)
