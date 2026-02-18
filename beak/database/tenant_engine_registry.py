import threading
from asyncio import current_task

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    async_scoped_session,
    async_sessionmaker,
    create_async_engine,
)

from beak.core.config import get_settings

settings = get_settings()

_ENGINE_CACHE: dict[str, AsyncEngine] = {}
_SESSION_FACTORY_CACHE: dict[str, async_scoped_session] = {}
_CACHE_LOCK = threading.RLock()


def _build_search_path(schema_name: str) -> str:
    return f'"{schema_name}",public'


def get_tenant_engine(schema_name: str) -> AsyncEngine:
    """Return a cached async engine for a tenant schema."""
    with _CACHE_LOCK:
        cached = _ENGINE_CACHE.get(schema_name)
        if cached:
            return cached

        engine = create_async_engine(
            settings.SQLALCHEMY_TEST_DATABASE_URI
            if settings.TESTING
            else settings.SQLALCHEMY_DATABASE_URI,
            pool_pre_ping=True,
            echo=False,
            future=True,
            connect_args={
                "server_settings": {"search_path": _build_search_path(schema_name)}
            },
        )
        _ENGINE_CACHE[schema_name] = engine
        return engine


def get_tenant_session_factory(schema_name: str) -> async_scoped_session:
    """Return a cached async scoped session factory for a tenant schema."""
    with _CACHE_LOCK:
        cached = _SESSION_FACTORY_CACHE.get(schema_name)
        if cached:
            return cached

        engine = get_tenant_engine(schema_name)
        factory = async_sessionmaker(
            bind=engine,
            expire_on_commit=False,
            autoflush=False,
            class_=AsyncSession,
        )
        scoped = async_scoped_session(factory, scopefunc=current_task)
        _SESSION_FACTORY_CACHE[schema_name] = scoped
        return scoped


async def dispose_tenant_engine(schema_name: str) -> None:
    """Dispose tenant engine and clear cached session factory."""
    with _CACHE_LOCK:
        engine = _ENGINE_CACHE.pop(schema_name, None)
        _SESSION_FACTORY_CACHE.pop(schema_name, None)

    if engine is not None:
        await engine.dispose()


def has_tenant_session_factory(schema_name: str) -> bool:
    with _CACHE_LOCK:
        return schema_name in _SESSION_FACTORY_CACHE


def list_cached_tenant_schemas() -> list[str]:
    with _CACHE_LOCK:
        return list(_SESSION_FACTORY_CACHE.keys())
