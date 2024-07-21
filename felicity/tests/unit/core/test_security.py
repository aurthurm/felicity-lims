import pytest
import passlib
from datetime import timedelta
from core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    generate_password_reset_token,
    verify_password_reset_token,
    password_similarity,
    password_check,
)


@pytest.fixture
def trial_data():
    return {
        "username": "johnndoe",
        "email": "johnndoe@test.here",
        "pass_weak": "jd123",
        "pass_similar": "johnndoe123456",
        "pass_strong": "!AT3#876j^$#fg",
    }


@pytest.mark.asyncio
async def test_password_hash_ok(trial_data):
    hashed = get_password_hash(trial_data["pass_weak"])
    assert verify_password(trial_data["pass_weak"], hashed) == True


@pytest.mark.asyncio
async def test_password_hash_not(trial_data):
    with pytest.raises(passlib.exc.UnknownHashError):
        assert verify_password(trial_data["pass_weak"], "1233444") == False


@pytest.mark.asyncio
async def test_password_hash_mismatch(trial_data):
    hashed = get_password_hash(trial_data["pass_similar"])
    assert verify_password(trial_data["pass_weak"], hashed) == False


@pytest.mark.asyncio
async def test_access_token(trial_data):
    token = create_access_token(trial_data["username"], timedelta(5))
    assert type(token) == str


@pytest.mark.asyncio
async def test_access_token_timedelta(trial_data):
    with pytest.raises(TypeError):
        create_access_token(trial_data["username"], 5)


@pytest.mark.asyncio
async def test_access_token_verify(trial_data):
    token = create_access_token(trial_data["username"], timedelta(5))
    sub = verify_password_reset_token(token)
    assert trial_data["username"] == sub


@pytest.mark.asyncio
async def test_access_token_verify_incorrect(trial_data):
    token = create_access_token(trial_data["username"], timedelta(5))
    sub = verify_password_reset_token(token)
    assert "marryndoe" != sub


@pytest.mark.asyncio
async def test_reset_token(trial_data):
    token = generate_password_reset_token(trial_data["email"])
    assert type(token) == str


@pytest.mark.asyncio
async def test_reset_token_verify(trial_data):
    token = generate_password_reset_token(trial_data["email"])
    sub = verify_password_reset_token(token)
    assert trial_data["email"] == sub


@pytest.mark.asyncio
async def test_reset_token_verify_incorrect(trial_data):
    token = generate_password_reset_token(trial_data["username"])
    sub = verify_password_reset_token(token)
    assert "marryndoe@here.now" != sub


@pytest.mark.asyncio
async def test_password_similarity_strong(trial_data):
    margin = 0.7
    similar, pct = password_similarity(
        trial_data["username"], trial_data["pass_similar"], margin
    )
    assert similar == True
    assert pct > margin


@pytest.mark.asyncio
async def test_password_similarity_weak(trial_data):
    margin = 0.7
    similar, pct = password_similarity("dieselvin", trial_data["pass_similar"], margin)
    assert similar == False
    assert pct < margin


@pytest.mark.asyncio
async def test_password_policy_weak(trial_data):
    output = password_check(trial_data["pass_weak"], trial_data["username"])
    assert output["password_ok"] == False


@pytest.mark.asyncio
async def test_password_policy_weak(trial_data):
    output = password_check(trial_data["pass_strong"], trial_data["username"])
    assert output["password_ok"] == True
