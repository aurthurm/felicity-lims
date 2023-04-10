import logging

from init import requisite_setup

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("Creating initial data")
    requisite_setup()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
