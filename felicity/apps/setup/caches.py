from functools import lru_cache

from felicity.apps.setup.models.setup import Laboratory, LaboratorySetting


@lru_cache
async def get_laboratory():
    return await Laboratory.get_by_setup_name()


@lru_cache
async def get_laboratory_setting():
    lab = await Laboratory.get_by_setup_name()
    return lab, await LaboratorySetting.get(laboratory_uid=lab.uid)
