from cache import AsyncLRU
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.setup.entities import Laboratory, LaboratorySetting
from felicity.apps.setup.services import LaboratoryService, LaboratorySettingService
from felicity.apps.user.entities import User
from felicity.apps.user.services import UserService
from felicity.core.config import settings
from felicity.core.tenant_context import get_current_lab_uid


@AsyncLRU(maxsize=128)
async def get_laboratory(lab_uid: str = None, session: Optional[AsyncSession] = None) -> Laboratory:
    if not lab_uid:
        lab_uid = get_current_lab_uid()
    lab = await LaboratoryService().get(uid=lab_uid, session=session)
    return lab


@AsyncLRU(maxsize=128)
async def get_laboratory_setting(lab_uid: str = None, session: Optional[AsyncSession] = None) -> tuple[Laboratory, LaboratorySetting]:
    if not lab_uid:
        lab_uid = get_current_lab_uid()
    lab = await LaboratoryService().get(uid=lab_uid, session=session)
    setting = await LaboratorySettingService().get(laboratory_uid=lab.uid, session=session)
    return lab, setting


@AsyncLRU(maxsize=128)
async def get_system_daemon() -> User:
    return await UserService().get(user_name=settings.SYSTEM_DAEMON_USERNAME)
