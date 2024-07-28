import pytest
from datetime import datetime
import pytest_asyncio
from sqlalchemy import Column, String
from felicity.database.session import (
    async_engine, async_session as async_session_factory
)
from felicity.core.dtz import format_datetime
from felicity.apps.abstract.entity import BaseEntity


class TestEntity(BaseEntity):
    __tablename__ = 'test_entity'
    name = Column(String)
    created_at = Column(String, default=lambda: format_datetime(datetime.utcnow(), human_format=False, with_time=True))


@pytest_asyncio.fixture(scope="function")
async def async_session():
    async with async_engine.begin() as conn:
        await conn.run_sync(BaseEntity.metadata.drop_all, tables=[TestEntity.__table__])
        await conn.run_sync(BaseEntity.metadata.create_all, tables=[TestEntity.__table__])

    async with async_session_factory() as session:
        yield session


@pytest.mark.asyncio
async def test_instance_creation(async_session):
    instance = TestEntity(name="Test Name")
    async_session.add(instance)
    await async_session.commit()
    assert instance.uid is not None


@pytest.mark.asyncio
async def test_fill_method(async_session):
    instance = TestEntity()
    instance.fill(name="Test Fill", created_at="2024-01-01T00:00:00")
    async_session.add(instance)
    await async_session.commit()
    assert instance.name == "Test Fill"
    assert instance.created_at == "2024-01-01T00:00:00"


@pytest.mark.asyncio
async def test_marshal_simple_method(async_session):
    instance = TestEntity(name="Test Marshal", created_at="2024-01-01T00:00:00")
    async_session.add(instance)
    await async_session.commit()

    marshaled_data = instance.marshal_simple()
    assert marshaled_data["uid"] == instance.uid
    assert marshaled_data["name"] == "Test Marshal"
    assert marshaled_data["created_at"] == "2024-01-01T00:00:00"


@pytest.mark.asyncio
async def test_settable_attributes():
    assert "uid" in TestEntity.settable_attributes
    assert "name" in TestEntity.settable_attributes
    assert "created_at" in TestEntity.settable_attributes


@pytest.mark.asyncio
async def test_invalid_fill_key():
    instance = TestEntity()
    with pytest.raises(KeyError):
        instance.fill(invalid_attr="Test")
