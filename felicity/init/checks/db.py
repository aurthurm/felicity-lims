import logging

from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from database.session import async_session_factory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def check_db_conn_status() -> None:
    logger.info("Checking database status ...")
    try:
        session = async_session_factory()
        # Try to create session to check if DB is awake
        await session.execute("SELECT 1")
        await session.close()
        logger.info("database session connection established. ")
    except Exception as e:
        logger.error(e)
        raise e
