from asyncio import current_task

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_scoped_session,
    async_sessionmaker,
    create_async_engine,
)

from beak.core import get_settings
from beak.core.tenant_context import get_tenant_context
from beak.database.tenant_engine_registry import (
    get_tenant_session_factory,
    has_tenant_session_factory,
)

settings = get_settings()

engine = create_engine(
    (
        settings.SQLALCHEMY_TEST_DATABASE_URI
        if settings.TESTING
        else settings.SQLALCHEMY_DATABASE_URI
    ),
)
async_engine = create_async_engine(
    (
        settings.SQLALCHEMY_TEST_DATABASE_URI
        if settings.TESTING
        else settings.SQLALCHEMY_DATABASE_URI
    ),
    pool_pre_ping=True,
    echo=False,
    future=True,
)
# async_session_factory can be used directly using: async with async_session_factory() as session: ...
_default_async_session_factory = async_sessionmaker(
    bind=async_engine, expire_on_commit=False, autoflush=False, class_=AsyncSession
)
_DefaultSessionScoped = async_scoped_session(
    _default_async_session_factory, scopefunc=current_task
)


class _TenantAwareSessionProxy:
    """Route sessions to tenant schema when context is available."""

    def __call__(self):
        context = get_tenant_context()
        if context and context.schema_name:
            if has_tenant_session_factory(context.schema_name):
                return get_tenant_session_factory(context.schema_name)()
            # Lazy warm-up the session factory for this schema.
            return get_tenant_session_factory(context.schema_name)()
        return _DefaultSessionScoped()


async_session = _TenantAwareSessionProxy()


async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
