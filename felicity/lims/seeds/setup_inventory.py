import logging

from felicity.apps.inventory import models, schemas
from felicity.core.config import get_settings
from .data import get_seeds

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_stock_units():
    logger.info("Setting up stock units .....")
    data = get_seeds("inventory")

    stock_units = data.get("units", [])

    for _unit in stock_units:
        stock_unit = await models.StockUnit.get(name=_unit.get("name"))
        if not stock_unit:
            su_in = schemas.StockUnitCreate(
                name=_unit.get("name"),
                description=_unit.get("description"),
                synonym="",
            )
            await models.StockUnit.create(su_in)


async def seed_stock_categories():
    logger.info("Setting up stock categories .....")
    data = get_seeds("inventory")

    stock_categories = data.get("categories", [])

    for _cat in stock_categories:
        stock_category = await models.StockCategory.get(name=_cat.get("name"))
        if not stock_category:
            cu_in = schemas.StockCategoryCreate(
                name=_cat.get("name"),
                description=_cat.get("description"),
            )
            await models.StockCategory.create(cu_in)


async def seed_stock_hazards():
    logger.info("Setting up stock hazards .....")
    data = get_seeds("inventory")

    hazards = data.get("hazards", [])

    for _hzd in hazards:
        hazard = await models.Hazard.get(name=_hzd.get("name"))
        if not hazard:
            sh_in = schemas.HazardCreate(
                name=_hzd.get("name"),
                description=_hzd.get("description"),
            )
            await models.Hazard.create(sh_in)
