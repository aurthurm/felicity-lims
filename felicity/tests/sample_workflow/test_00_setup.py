import logging

import pytest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(1)
async def test_check_installation(app):
    _, response = await app.asgi_client.get("api/v1/setup/installation")
    logger.info(f"reset-password response: {response} {response.json}")
    assert response.status_code == 200
    logger.info(f"reset-password response: {response} {response.json}")
    _data = response.json
    assert _data["laboratory"] is None
    assert _data["installed"] is False
    assert _data["message"] == "Laboratory installation required"


@pytest.mark.asyncio
@pytest.mark.order(2)
async def test_install(app):
    _, response = await app.asgi_client.post(
        "api/v1/setup/installation", json={"name": "Test Laboratory"}
    )
    logger.info(f"reset-password response: {response} {response.json}")
    assert response.status_code == 200
    logger.info(f"reset-password response: {response} {response.json}")
    assert response.json["installed"] is True
    assert response.json["installed"] is True
    assert response.json["laboratory"]["setup_name"] == "felicity"
    assert response.json["laboratory"]["lab_name"] == "Test Laboratory"
    assert response.json["message"] == "installation success"
