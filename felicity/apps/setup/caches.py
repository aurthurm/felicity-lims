from cache import AsyncLRU

from felicity.apps.setup.entities import Laboratory, LaboratorySetting
from felicity.apps.setup.services import LaboratoryService, LaboratorySettingService


@AsyncLRU(maxsize=128)
async def get_laboratory() -> Laboratory:
    lab = await LaboratoryService().get_by_setup_name()
    return lab


@AsyncLRU(maxsize=128)
async def get_laboratory_setting() -> tuple[Laboratory, LaboratorySetting]:
    lab = await LaboratoryService().get_by_setup_name()
    setting = await LaboratorySettingService().get(laboratory_uid=lab.uid)
    return lab, setting
