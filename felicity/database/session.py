from asyncio import current_task

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_scoped_session,
    create_async_engine,
    async_sessionmaker
)
from sqlalchemy.orm import sessionmaker

from felicity.core import get_settings

settings = get_settings()

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
async_engine = create_async_engine(
    settings.SQLALCHEMY_TEST_DATABASE_URI
    if settings.TESTING
    else settings.SQLALCHEMY_DATABASE_URI,
    pool_pre_ping=True,
    echo=False,
    future=True,
)
# async_session_factory can be used directly using: async with async_session_factory() as session: ...
async_session = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,
    autoflush=False,
    class_=AsyncSession
)
AsyncSessionScoped = async_scoped_session(async_session, scopefunc=current_task)

