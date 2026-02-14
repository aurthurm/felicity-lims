import logging

import pytest

from felicity.core.config import settings
from felicity.tests.integration.utils.user import (
    add_user_mutation,
    make_password,
    make_username,
)

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
        "beak-gql",
        json={
            "query": authe,
            "variables": {
                "username": settings.FIRST_SUPERUSER_USERNAME,
                "password": settings.FIRST_SUPERUSER_PASSWORD,
            },
        },
    )
    data = response.json()["data"]["authenticateUser"]
    logger.info(f"superuser_login response: {response} {response.json()}")
    assert response.status_code == 200
    assert data["token"] is not None
    assert data["tokenType"] == "bearer"


@pytest.mark.asyncio
@pytest.mark.order(14)
async def test_register_users(app_gql, users, auth_data):
    response = await app_gql.post(
        "beak-gql",
        json={
            "query": """query GetGroups {
                groupAll {
                    uid
                    name
                }
            }""",
            "variables": {}
        },
        headers=auth_data["headers"],
    )

    logger.info(f"fetch groups response: {response} {response.json()}")
    _groups = response.json()["data"]["groupAll"]

    # make everyone an admin to simplify testing
    _group_uid = None
    for group in _groups:
        if group["name"].upper() == "ADMINISTRATOR":
            _group_uid = group["uid"]
            break

    assert _group_uid is not None
    _lab_uid = auth_data["activeLaboratory"]["uid"]
    assert _lab_uid is not None

    for user in users:
        user = {
            **user,
            "userName": make_username(user["firstName"]),
            "password": make_password(user["firstName"]),
            "passwordc": make_password(user["firstName"]),
            "groupUid": _group_uid,
            "activeLaboratoryUid": _lab_uid,
            "laboratoryUids": [_lab_uid]
        }
        response = await app_gql.post(
            "beak-gql",
            json={"query": add_user_mutation, "variables": user},
            headers=auth_data["headers"],
        )

        logger.info(f"register_users response: {response} {response.json()}")

        assert response.status_code == 200
        _user = response.json()["data"]["createUser"]
        assert _user["uid"] is not None
        assert _user["firstName"] == user["firstName"]
        assert _user["lastName"] == user["lastName"]
        assert _user["uid"] is not True

        # Set active laboratory
        set_lab_response = await app_gql.post(
            "beak-gql",
            json={
                "query": """
                    mutation SetActiveLab($userUid: String!, $laboratoryUid: String!){
                      setUserActiveLaboratory(userUid: $userUid, laboratoryUid: $laboratoryUid) {
                        ... on UserType {
                            uid
                            activeLaboratoryUid
                        }
                        ... on OperationError {
                            error
                        }
                      }
                    }
                """,
                "variables": {
                    "userUid": _user["uid"],
                    "laboratoryUid": _lab_uid,
                },
            },
            headers=auth_data["headers"],
        )
        logger.info(f"set active laboratory response: {set_lab_response.json()}")
        set_lab_data = set_lab_response.json()["data"]["setUserActiveLaboratory"]
        assert set_lab_data["activeLaboratoryUid"] == _lab_uid
