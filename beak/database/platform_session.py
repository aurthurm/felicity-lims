from asyncio import current_task

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_scoped_session,
    async_sessionmaker,
    create_async_engine,
)

from beak.core.config import get_settings

settings = get_settings()

platform_async_engine = create_async_engine(
    settings.SQLALCHEMY_TEST_DATABASE_URI
    if settings.TESTING
    else settings.SQLALCHEMY_DATABASE_URI,
    pool_pre_ping=True,
    echo=False,
    future=True,
    connect_args={
        "server_settings": {
            "search_path": f'"{settings.PLATFORM_SCHEMA}",public'
        }
    },
)

_platform_session = async_sessionmaker(
    bind=platform_async_engine,
    expire_on_commit=False,
    autoflush=False,
    class_=AsyncSession,
)
PlatformSessionScoped = async_scoped_session(_platform_session, scopefunc=current_task)


async def get_platform_db():
    async with PlatformSessionScoped() as session:
        try:
            yield session
        finally:
            await session.close()
