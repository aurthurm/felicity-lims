import logging

from felicity.init import initialize_felicity

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("Creating initial data")
    initialize_felicity()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
