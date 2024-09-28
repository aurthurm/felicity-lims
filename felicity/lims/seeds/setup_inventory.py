import logging

from felicity.apps.inventory import schemas
from felicity.apps.inventory.services import (
    HazardService,
    StockCategoryService,
    StockUnitService,
)
from felicity.core.config import get_settings

from .data import get_seeds

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_stock_units() -> None:
    logger.info("Setting up stock units .....")
    stock_unit_service = StockUnitService()

    data = get_seeds("inventory")
    if not data:
        logger.error("Failed to load person seed data")
        return

    stock_units = data.get("units", [])

    for _unit in stock_units:
        stock_unit = await stock_unit_service.get(name=_unit.get("name"))
        if not stock_unit:
            su_in = schemas.StockUnitCreate(
                name=_unit.get("name"),
                description=_unit.get("description"),
                synonym="",
            )
            await stock_unit_service.create(su_in)


async def seed_stock_categories() -> None:
    logger.info("Setting up stock categories .....")
    stock_category_service = StockCategoryService()

    data = get_seeds("inventory")
    if not data:
        logger.error("Failed to load person seed data")
        return

    stock_categories = data.get("categories", [])

    for _cat in stock_categories:
        stock_category = await stock_category_service.get(name=_cat.get("name"))
        if not stock_category:
            cu_in = schemas.StockCategoryCreate(
                name=_cat.get("name"),
                description=_cat.get("description"),
            )
            await stock_category_service.create(cu_in)


async def seed_stock_hazards() -> None:
    logger.info("Setting up stock hazards .....")
    hazard_service = HazardService()

    data = get_seeds("inventory")
    if not data:
        logger.error("Failed to load person seed data")
        return

    hazards = data.get("hazards", [])

    for _hzd in hazards:
        hazard = await hazard_service.get(name=_hzd.get("name"))
        if not hazard:
            sh_in = schemas.HazardCreate(
                name=_hzd.get("name"),
                description=_hzd.get("description"),
            )
            await hazard_service.create(sh_in)
