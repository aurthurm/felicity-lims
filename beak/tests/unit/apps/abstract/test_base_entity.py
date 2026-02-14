import pytest
import pytest_asyncio
from sqlalchemy import Column, String
from sqlalchemy.ext.asyncio import AsyncAttrs, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped
from sqlalchemy_mixins.utils import classproperty

from beak.core.dtz import format_datetime, timenow_dt
from beak.core.uid_gen import get_flake_uid
from beak.database.session import async_engine


class TestBase(DeclarativeBase, AsyncAttrs):
    __abstract__ = True

    uid: Mapped[str] = Column(
        String,
        primary_key=True,
        index=True,
        nullable=False,
        default=get_flake_uid,
    )

    @classproperty
    def settable_attributes(cls):
        return list(cls.__table__.columns.keys())

    def fill(self, **kwargs):
        valid_keys = set(self.__table__.columns.keys())
        for key, value in kwargs.items():
            if key not in valid_keys:
                raise KeyError(f"Attribute '{key}' doesn't exist")
            setattr(self, key, value)
        return self

    def marshal_simple(self, exclude=None):
        if exclude is None:
            exclude = []
        exclude.append("_sa_instance_state")
        return {key: value for key, value in self.__dict__.items() if key not in exclude}


class TestEntity(TestBase):
    __tablename__ = "test_entity"
    name = Column(String)
    created_at = Column(
        String,
        default=lambda: format_datetime(
            timenow_dt(), human_format=False, with_time=True
        ),
    )


@pytest_asyncio.fixture(scope="function")
async def async_session():
    async with async_engine.begin() as conn:
        await conn.run_sync(
            TestBase.metadata.drop_all, tables=[TestEntity.__table__]
        )
        await conn.run_sync(
            TestBase.metadata.create_all, tables=[TestEntity.__table__]
        )

    session_factory = async_sessionmaker(
        bind=async_engine, expire_on_commit=False, class_=AsyncSession
    )
    async with session_factory() as session:
        yield session

    async with async_engine.begin() as conn:
        await conn.run_sync(
            TestBase.metadata.drop_all, tables=[TestEntity.__table__]
        )
    await async_engine.dispose()


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
