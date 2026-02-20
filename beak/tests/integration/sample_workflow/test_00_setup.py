import logging

import pytest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(1)
async def test_installation_lookup_removed(app_api):
    response = await app_api.get("/setup/installation")
    assert response.status_code == 404


@pytest.mark.asyncio
@pytest.mark.order(2)
async def test_installation_register_removed(app_api):
    response = await app_api.post(
        "/setup/installation",
        json={
            "organisation_name": "Beak Inc",
            "laboratory_name": "Test Laboratory",
        },
    )
    assert response.status_code == 404
