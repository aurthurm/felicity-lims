import pytest


@pytest.mark.asyncio
async def test_login(client):
    data = {"username": "testing", "password": "testing"}
    response = await client.post("/login/access-token", content=data)
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@nofoobar.com"
    assert response.json()["is_active"] == True


@pytest.mark.asyncio
async def test_password_reset(client):
    email = "admin@felicitylabs.com"
    response = await client.post(f"/password-recovery/{email}")
    assert response.status_code == 200
    assert response.json()["msg"] == "Password recovery email sent"
