import logging

import pytest
from felicity.tests.integration.utils.user import (
    add_user_mutation,
    make_password,
    make_username,
)

from felicity.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(10)
async def test_user_login(app_gql):
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
    logger.info(f"superuser_login response: {response} {response.json}")
    assert response.status_code == 200
    assert data["token"] is not None
    assert data["tokenType"] == "bearer"


@pytest.mark.asyncio
@pytest.mark.order(14)
async def test_register_users(app_gql, users, auth_data):
    for user in users:
        user = {
            **user,
            "userName": make_username(user["firstName"]),
            "password": make_password(user["firstName"]),
            "passwordc": make_password(user["firstName"]),
        }
        response = await app_gql.post(
            "felicity-gql",
            json={"query": add_user_mutation, "variables": user},
            headers=auth_data["headers"],
        )

        logger.info(f"register_users response: {response} {response.json}")

        assert response.status_code == 200
        _user = response.json()["data"]["createUser"]
        assert _user["uid"] is not None
        assert _user["firstName"] == user["firstName"]
        assert _user["lastName"] == user["lastName"]
        assert _user["uid"] is not True
