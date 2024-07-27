# from unittest.mock import AsyncMock

# import pytest

# from felicity.apps.user.entities import User
# from felicity.apps.user.schemas import UserCreate


# @pytest.mark.asyncio
# async def test_create_user():
#     user_in = UserCreate(
#         first_name="John", last_name="Doe", email="john.doe@example.com"
#     )
#     user = await User.create(user_in)
#     assert user.first_name == "John"
#     assert user.last_name == "Doe"
#     assert user.email == "john.doe@example.com"


# @pytest.mark.asyncio
# async def test_get_by_email():
#     user_in = UserCreate(
#         first_name="John", last_name="Doe", email="john.doe@example.com"
#     )
#     user = await User.create(user_in)
#     fetched_user = await user.get_by_email("john.doe@example.com")
#     assert fetched_user.email == "john.doe@example.com"


# @pytest.mark.asyncio
# async def test_give_super_powers():
#     user_in = UserCreate(
#         first_name="John", last_name="Doe", email="john.doe@example.com"
#     )
#     user = await User.create(user_in)
#     await user.give_super_powers()
#     assert user.is_superuser is True


# @pytest.mark.asyncio
# async def test_strip_super_powers():
#     user_in = UserCreate(
#         first_name="John", last_name="Doe", email="john.doe@example.com"
#     )
#     user = await User.create(user_in)
#     await user.give_super_powers()
#     await user.strip_super_powers()
#     assert user.is_superuser is False


# @pytest.mark.asyncio
# async def test_activate():
#     user_in = UserCreate(
#         first_name="John", last_name="Doe", email="john.doe@example.com"
#     )
#     user = await User.create(user_in)
#     await user.deactivate()
#     await user.activate()
#     assert user.is_active is True


# @pytest.mark.asyncio
# async def test_deactivate():
#     user_in = UserCreate(
#         first_name="John", last_name="Doe", email="john.doe@example.com"
#     )
#     user = await User.create(user_in)
#     await user.activate()
#     await user.deactivate()
#     assert user.is_active is False


# @pytest.fixture
# def mock_user_auth() -> AsyncMock:
#     """
#     User Auth Async Mock Fixture
#     :return:
#     """
#     mock_thing = AsyncMock()
#     mock_thing.UserAuth.acquire_user_type = AsyncMock(return_value="lcuser")
#     mock_thing.UserAuth.has_access = AsyncMock(return_value=True)
#     mock_thing.UserAuth.authenticate = AsyncMock(return_value=True)
#     return mock_thing


# @pytest.mark.asyncio
# async def test_user_propagate_user_type(mock_user_auth):
#     user_in = UserCreate(
#         first_name="John", last_name="Doe", email="john.doe@example.com"
#     )
#     user = await User.create(user_in)
#     user_auth = mock_user_auth.UserAuth
#     user.auth = user_auth
#     await user.propagate_user_type()
#     user_auth.acquire_user_type.assert_called_once_with("lcuser")
