import logging

from init.checks.db import check_db_conn_status

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("Initializing database service")
    check_db_conn_status()
    logger.info("Database service finished initializing")


if __name__ == "__main__":
    main()
