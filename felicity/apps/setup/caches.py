from cache import AsyncLRU

from felicity.apps.setup.entities import Laboratory, LaboratorySetting
from felicity.apps.setup.services import LaboratoryService, LaboratorySettingService
from felicity.apps.user.entities import User
from felicity.apps.user.services import UserService
from felicity.core.config import settings


@AsyncLRU(maxsize=128)
async def get_laboratory() -> Laboratory:
    lab = await LaboratoryService().get_by_setup_name()
    return lab


@AsyncLRU(maxsize=128)
async def get_laboratory_setting() -> tuple[Laboratory, LaboratorySetting]:
    lab = await LaboratoryService().get_by_setup_name()
    setting = await LaboratorySettingService().get(laboratory_uid=lab.uid)
    return lab, setting


@AsyncLRU(maxsize=128)
async def get_system_daemon() -> User:
    return await UserService().get(user_name=settings.SYSTEM_DAEMON_USERNAME)
