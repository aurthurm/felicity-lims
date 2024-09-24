import unittest
from unittest import mock

from felicity.apps.exceptions import AlreadyExistsError, ValidationError
from felicity.apps.user.repository import UserRepository
from felicity.apps.user.schemas import User, UserCreate
from felicity.apps.user.services import UserService


class UserServiceTestCase(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.repository = mock.create_autospec(UserRepository())
        self.group_service = mock.AsyncMock()
        self.permission_service = mock.AsyncMock()
        self.user_preference_service = mock.AsyncMock()

        self.user_service = UserService()
        self.user_service.repository = self.repository

        self.user_data = {
            "first_name": "anesu",
            "last_name": "mpofu",
            "email": "amusewem@gmail.com",
            "user_name": "amusem",
            "password": "!Try#@8787?",
            "passwordc": "!Try#@8787?",
            "open_reg": False,
        }

    async def test_add_user(self):
        uid = "111"
        self.repository.get.return_value = None
        self.repository.create.return_value = mock.AsyncMock(
            return_value=User(**{"uid": uid, **self.user_data})
        )
        result = await self.user_service.create(UserCreate(**self.user_data))
        self.repository.get.assert_called_once_with(
            user_name=self.user_data["user_name"]
        )
        self.repository.create.assert_called_once()
        self.assertIsNotNone(result.return_value.uid)
        self.assertEqual(result.return_value.uid, uid)
        self.assertEqual(result.return_value.first_name, self.user_data["first_name"])

    async def test_add_user_email_already_exists(self):
        self.repository.get.return_value = User(**self.user_data)
        with self.assertRaises(AlreadyExistsError):
            await self.user_service.create(User(**self.user_data))

    async def test_add_user_password_policy_weak(self):
        self.repository.get.return_value = None
        with self.assertRaises(ValidationError):
            await self.user_service.create(
                UserCreate(
                    **{
                        **self.user_data,
                        "password": "12345",
                        "passwordc": "12345",
                    }
                )
            )
