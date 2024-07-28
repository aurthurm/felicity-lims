from pydantic import BaseModel
import pytest
from unittest.mock import AsyncMock, create_autospec

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from felicity.apps.abstract.entity import BaseEntity
from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.abstract.service import BaseService


# Define mock classes for entities and Pydantic models
class MockEntity(BaseEntity):
    __tablename__ = "mock_table"
    name: Mapped[str] = mapped_column(String)
    bio: Mapped[str] = mapped_column(String)

class CreateModel(BaseModel):
    name: str
    bio: str

class UpdateModel(BaseModel):
    name: str | None
    bio: str | None


# Define a custom repository for testing
class MockRepository(BaseRepository[MockEntity]):
    def __init__(self):
        super().__init__(MockEntity)


# Define a custom service for testing
class MockService(BaseService[MockEntity, CreateModel, UpdateModel]):
    def __init__(self):
        super().__init__(MockRepository)


# Define the test fixtures
@pytest.fixture
def mock_repo():
    return create_autospec(MockRepository, spec_set=True, instance=True)

@pytest.fixture
def test_service(mock_repo):
    service = MockService()
    service.repository = mock_repo
    return service


# Test cases
@pytest.mark.asyncio
async def test_paging_filter(test_service):
    test_service.repository.paginate = AsyncMock(return_value=["item1", "item2"])
    result = await test_service.paging_filter(page_size=10)
    assert result == ["item1", "item2"]
    test_service.repository.paginate.assert_awaited_once_with(10, None, None, None, None)

@pytest.mark.asyncio
async def test_search(test_service):
    test_service.repository.search = AsyncMock(return_value=["item1", "item2"])
    result = await test_service.search(query="test")
    assert result == ["item1", "item2"]
    test_service.repository.search.assert_awaited_once_with(query="test")

@pytest.mark.asyncio
async def test_all(test_service):
    test_service.repository.all = AsyncMock(return_value=["item1", "item2"])
    result = await test_service.all()
    assert result == ["item1", "item2"]
    test_service.repository.all.assert_awaited_once_with()

@pytest.mark.asyncio
async def test_get(test_service):
    mock_entity = MockEntity(uid="1", name="test", bio="test bio")
    test_service.repository.get = AsyncMock(return_value=mock_entity)
    result = await test_service.get(uid="1")
    assert result == mock_entity
    test_service.repository.get.assert_awaited_once_with(uid="1")

@pytest.mark.asyncio
async def test_get_by_uids(test_service):
    mock_entities = [MockEntity(uid="1", name="test1", bio="bio1"), MockEntity(uid="2", name="test2", bio="bio2")]
    test_service.repository.get_by_uids = AsyncMock(return_value=mock_entities)
    result = await test_service.get_by_uids(uids=["1", "2"])
    assert result == mock_entities
    test_service.repository.get_by_uids.assert_awaited_once_with(["1", "2"])

@pytest.mark.asyncio
async def test_get_related(test_service):
    mock_entity = MockEntity(uid="1", name="test", bio="test bio")
    test_service.repository.get_related = AsyncMock(return_value=mock_entity)
    result = await test_service.get_related(related=["related1"], uid="1")
    assert result == mock_entity
    test_service.repository.get_related.assert_awaited_once_with(related=["related1"], uid="1")

@pytest.mark.asyncio
async def test_create(test_service):
    create_model = CreateModel(name="test", bio="test bio")
    mock_entity = MockEntity(uid="1", name="test", bio="test bio")
    test_service.repository.create = AsyncMock(return_value=mock_entity)
    result = await test_service.create(create_model)
    assert result == mock_entity
    test_service.repository.create.assert_awaited_once_with(name="test", bio="test bio")

@pytest.mark.asyncio
async def test_update(test_service):
    update_model = UpdateModel(name="updated_test", bio="updated bio")
    mock_entity = MockEntity(uid="1", name="updated_test", bio="updated bio")
    test_service.repository.update = AsyncMock(return_value=mock_entity)
    result = await test_service.update(uid="1", update=update_model)
    assert result == mock_entity
    test_service.repository.update.assert_awaited_once_with("1", name="updated_test", bio="updated bio")

@pytest.mark.asyncio
async def test_save(test_service):
    mock_entity = MockEntity(uid="1", name="test", bio="test bio")
    test_service.repository.save = AsyncMock(return_value=mock_entity)
    result = await test_service.save(mock_entity)
    assert result == mock_entity
    test_service.repository.save.assert_awaited_once_with(mock_entity)

@pytest.mark.asyncio
async def test_delete(test_service):
    test_service.repository.delete = AsyncMock(return_value=None)
    result = await test_service.delete(uid="1")
    assert result is None
    test_service.repository.delete.assert_awaited_once_with("1")
