import logging

import asyncio
from felicity.lims.checks import check_db_conn_status

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main() -> None:
    logger.info("Initializing database service")
    await check_db_conn_status()
    logger.info("Database service finished initializing")


if __name__ == "__main__":
    asyncio.run(main())
