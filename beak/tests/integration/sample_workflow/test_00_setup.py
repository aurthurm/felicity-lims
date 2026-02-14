import logging

import pytest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(1)
async def test_check_installation(app_api):
    response = await app_api.get("/setup/installation")
    logger.info(f"check installation response: {response} {response.json()}")
    assert response.status_code == 200
    _data = response.json()
    assert _data["laboratories"] is None
    assert _data["installed"] is False
    assert _data["message"] == "Instance installation required"


@pytest.mark.asyncio
@pytest.mark.order(2)
async def test_install(app_api, app_gql):
    response = await app_api.post(
        "/setup/installation", json={
            "organisation_name": "Beak Inc",
            "laboratory_name": "Test Laboratory"
        }
    )
    logger.info(f"installation response: {response} {response.json()}")
    assert response.status_code == 200
    assert response.json()["installed"] is True
    lab = response.json()["laboratories"][0]
    assert lab["name"] == "Test Laboratory"
    assert lab["organization"]["setup_name"] == "beak"
    assert response.json()["message"] == "Installation success"

    # Set active laboratory for the superuser
    from beak.core.config import settings

    # First authenticate to get user uid
    auth_response = await app_gql.post(
        "beak-gql",
        json={
            "query": """
                mutation Auth($username: String!, $password: String!){
                  authenticateUser(username: $username, password: $password) {
                    ... on AuthenticatedData {
                        user {
                            uid
                        }
                        token
                    }
                    ... on OperationError {
                        error
                    }
                  }
                }
            """,
            "variables": {
                "username": settings.FIRST_SUPERUSER_USERNAME,
                "password": settings.FIRST_SUPERUSER_PASSWORD,
            },
        },
    )
    auth_data = auth_response.json()["data"]["authenticateUser"]
    user_uid = auth_data["user"]["uid"]
    token = auth_data["token"]

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
                "userUid": user_uid,
                "laboratoryUid": lab["uid"],
            },
        },
        headers={"Authorization": f"bearer {token}"},
    )
    logger.info(f"set active laboratory response: {set_lab_response.json()}")
    set_lab_data = set_lab_response.json()["data"]["setUserActiveLaboratory"]
    assert set_lab_data["activeLaboratoryUid"] == lab["uid"]
