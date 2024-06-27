from cache import AsyncLRU

from felicity.apps.setup.models.setup import Laboratory, LaboratorySetting


@AsyncLRU(maxsize=128)
async def get_laboratory():
    lab = await Laboratory.get_by_setup_name()
    return lab


@AsyncLRU(maxsize=128)
async def get_laboratory_setting():
    lab = await Laboratory.get_by_setup_name()
    setting = await LaboratorySetting.get(laboratory_uid=lab.uid)
    return lab, setting
