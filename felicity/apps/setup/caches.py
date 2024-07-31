from cache import AsyncLRU

from felicity.apps.setup.services import LaboratoryService, LaboratorySettingService


@AsyncLRU(maxsize=128)
async def get_laboratory():
    lab = await LaboratoryService().get_by_setup_name()
    return lab


@AsyncLRU(maxsize=128)
async def get_laboratory_setting():
    lab = await LaboratoryService().get_by_setup_name()
    setting = await LaboratorySettingService().get(laboratory_uid=lab.uid)
    return lab, setting
