import pytest

from felicity.apps.exceptions import (AlreadyExistsError,
                                      ValidationError)
from felicity.apps.user.repository import UserRepository
from felicity.apps.user.schemas import User, UserCreate
from felicity.apps.user.services import UserService


@pytest.fixture
def user_service(mocker):
    repository = mocker.create_autospec(UserRepository)
    # group_service = mocker.AsyncMock()
    # permission_service = mocker.AsyncMock()
    # user_preference_service = mocker.AsyncMock()

    user_service = UserService()
    user_service.repository = repository
    return user_service


@pytest.fixture
def user_data():
    return {
        "first_name": "anesu",
        "last_name": "mpofu",
        "email": "amusewem@gmail.com",
        "user_name": "amusem",
        "password": "!Try#@8787?",
        "passwordc": "!Try#@8787?",
        "open_reg": False,
    }


@pytest.mark.asyncio
async def test_add_user(user_service, mocker, user_data):
    uid = "111"
    mocker.patch.object(user_service.repository, "get", return_value=None)
    mocker.patch.object(
        user_service.repository,
        "create",
        return_value=mocker.AsyncMock(return_value=User(**{"uid": uid, **user_data})),
    )

    result = await user_service.create(UserCreate(**user_data))

    user_service.repository.get.assert_called_once_with(user_name=user_data["user_name"])
    user_service.repository.create.assert_called_once()

    assert result.return_value.uid is not None
    assert result.return_value.uid == uid
    assert result.return_value.first_name == user_data["first_name"]


# @pytest.mark.asyncio
# async def test_add_user_open_reg_not_allowed(user_service, mocker, user_data):
#     mocker.patch.object(user_service.repository, "get", return_value=None)

#     with pytest.raises(NotAllowedError):
#         await user_service.add_user(**{**user_data, "open_reg": True})


@pytest.mark.asyncio
async def test_add_user_email_already_exists(user_service, mocker, user_data):
    mocker.patch.object(user_service.repository, "get", return_value=User(**user_data))

    with pytest.raises(AlreadyExistsError):
        await user_service.create(UserCreate(**user_data))


@pytest.mark.asyncio
async def test_add_user_password_policy_weak(user_service, mocker, user_data):
    mocker.patch.object(user_service.repository, "get", return_value=None)

    with pytest.raises(ValidationError):
        await user_service.create(
            UserCreate(**{
                **user_data,
                "password": "12345",
                "passwordc": "12345",
            })
        )


# @pytest.mark.asyncio
# async def test_add_user_password_mismatch(user_service, mocker, user_data):
#     mocker.patch.object(user_service.repository, "get", return_value=None)

#     with pytest.raises(ValidationError):
#         await user_service.add_user(
#             **{
#                 **user_data,
#                 "password": "!Am65$#@1u",
#                 "passwordc": "!Am65$#@iu",
#             }
#         )
