import pytest
import pytest_asyncio
from sqlalchemy import Column, ForeignKey, Integer, String

from felicity.apps.abstract.repository import BaseRepository
from felicity.database.session import async_engine
from felicity.database.base import BaseEntity
from sqlalchemy.orm import relationship


class SomeTestModel(BaseEntity):
    __tablename__ = "test_model"
    name = Column(String)
    age = Column(Integer, nullable=True)


class TrialModel(BaseEntity):
    __tablename__ = "trial_model"
    content = Column(String)
    test_model_uid = Column(String, ForeignKey("test_model.uid"), nullable=True)
    test_model = relationship("SomeTestModel", backref="trials", lazy="selectin")


# Setup the async database session for testing
# scope="module" ensures that the session is created once for all tests in the module
# scope="function" creates a new session for each test function
@pytest_asyncio.fixture(scope="function")
async def async_session():
    async with async_engine.begin() as conn:
        # drop
        await conn.run_sync(
            BaseEntity.metadata.drop_all,
            tables=[SomeTestModel.__table__, TrialModel.__table__],
        )
        # create
        await conn.run_sync(
            BaseEntity.metadata.create_all,
            tables=[SomeTestModel.__table__, TrialModel.__table__],
        )

    connection = async_engine.connect()
    yield connection

    # async with async_engine.begin() as conn:
    #     await conn.run_sync(SomeTestModel.metadata.drop_all)


# Test fixtures
@pytest_asyncio.fixture
def some_test_repo(async_session):
    class TestRepository(BaseRepository[SomeTestModel]):
        def __init__(self):
            super().__init__(SomeTestModel)

    return TestRepository()


@pytest_asyncio.fixture
def trial_repo(async_session):
    class TrialRepository(BaseRepository[TrialModel]):
        def __init__(self):
            super().__init__(TrialModel)

    return TrialRepository()


# Test cases
@pytest.mark.asyncio
async def test_save(some_test_repo):
    model = SomeTestModel(name="test")
    saved_model = await some_test_repo.save(model)
    assert saved_model.uid is not None


@pytest.mark.asyncio
async def test_create(some_test_repo):
    model_data = {"name": "test_create"}
    created_model = await some_test_repo.create(**model_data)
    assert created_model.uid is not None
    assert created_model.name == model_data["name"]


@pytest.mark.asyncio
async def test_get(some_test_repo):
    model = SomeTestModel(name="test_get")
    await some_test_repo.save(model)
    fetched_model = await some_test_repo.get(uid=model.uid)
    assert fetched_model is not None
    assert fetched_model.uid == model.uid
    assert fetched_model.name == model.name


@pytest.mark.asyncio
async def test_all(some_test_repo):
    model1 = SomeTestModel(name="test_all_1")
    model2 = SomeTestModel(name="test_all_2")
    await some_test_repo.save(model1)
    await some_test_repo.save(model2)
    all_models = await some_test_repo.all()
    assert len(all_models) == 2


@pytest.mark.asyncio
async def test_all_empty(some_test_repo):
    all_models = await some_test_repo.all()
    assert len(all_models) == 0


@pytest.mark.asyncio
async def test_delete(some_test_repo):
    model = SomeTestModel(name="test_delete")
    saved_model = await some_test_repo.save(model)
    await some_test_repo.delete(saved_model.uid)
    deleted_model = await some_test_repo.get(uid=saved_model.uid)
    assert deleted_model is None


@pytest.mark.asyncio
async def test_save_all(some_test_repo):
    models = [SomeTestModel(name=f"test_save_all_{i}") for i in range(3)]
    saved_models = await some_test_repo.save_all(models)
    assert len(saved_models) == 3
    for model in saved_models:
        assert model.uid is not None


@pytest.mark.asyncio
async def test_bulk_create(some_test_repo):
    model_data = [{"name": f"bulk_create_{i}"} for i in range(3)]
    created_models = await some_test_repo.bulk_create(model_data)
    assert len(created_models) == 3
    for model in created_models:
        assert model.uid is not None


@pytest.mark.asyncio
async def test_update(some_test_repo):
    model = SomeTestModel(name="initial_name")
    saved_model = await some_test_repo.save(model)
    updated_model = await some_test_repo.update(saved_model.uid, name="updated_name")
    assert updated_model.name == "updated_name"


@pytest.mark.asyncio
async def test_get_nonexistent(some_test_repo):
    fetched_model = await some_test_repo.get(uid="nonexistent_uid")
    assert fetched_model is None


@pytest.mark.asyncio
async def test_delete_nonexistent(some_test_repo):
    with pytest.raises(Exception):
        await some_test_repo.delete("nonexistent_uid")


@pytest.mark.asyncio
async def test_bulk_update_with_mappings(some_test_repo):
    models = [SomeTestModel(name=f"bulk_update_{i}") for i in range(3)]
    saved_models = await some_test_repo.save_all(models)
    mappings = [
        {"uid": model.uid, "name": f"bulk_updated_{i}"}
        for i, model in enumerate(saved_models)
    ]
    await some_test_repo.bulk_update_with_mappings(mappings)
    updated_models = await some_test_repo.get_all(
        uid__in=[model.uid for model in saved_models]
    )
    for i, model in enumerate(updated_models):
        assert model.name == f"bulk_updated_{i}"


@pytest.mark.asyncio
async def test_full_text_search(some_test_repo):
    model1 = SomeTestModel(name="unique_test_search")
    model2 = SomeTestModel(name="another_test_search")
    await some_test_repo.save_all([model1, model2])
    search_results = await some_test_repo.full_text_search("unique", "name")
    assert len(search_results) == 1
    assert search_results[0].name == "unique_test_search"


@pytest.mark.asyncio
async def test_paginate(some_test_repo):
    models = [SomeTestModel(name=f"paginate_{i}") for i in range(5)]
    await some_test_repo.save_all(models)
    page_cursor = await some_test_repo.paginate(
        page_size=2, after_cursor=None, before_cursor=None, filters={}, sort_by=["uid"]
    )
    assert len(page_cursor.items) == 2
    assert page_cursor.page_info.has_next_page is True
    assert page_cursor.page_info.has_previous_page is False


@pytest.mark.asyncio
async def test_filter(some_test_repo):
    model1 = SomeTestModel(name="filter_test_1", age=30)
    model2 = SomeTestModel(name="filter_test_2", age=40)
    await some_test_repo.save_all([model1, model2])
    filtered_models = await some_test_repo.filter(filters=[{"age": 30}])
    assert len(filtered_models) == 1
    assert filtered_models[0].name == "filter_test_1"


@pytest.mark.asyncio
async def test_sort(some_test_repo):
    model1 = SomeTestModel(name="sort_test_20", age=20)
    model2 = SomeTestModel(name="sort_test_40", age=40)
    model3 = SomeTestModel(name="sort_test_30", age=30)
    await some_test_repo.save_all([model1, model2, model3])
    sorted_models = await some_test_repo.filter(
        filters=[{"name__ilike": "sort_test%"}], sort_attrs=["age"]
    )
    assert sorted_models[0].age == 20
    assert sorted_models[1].age == 30
    assert sorted_models[2].age == 40


@pytest.mark.asyncio
async def test_related(some_test_repo, trial_repo):
    model = SomeTestModel(name="parent_model", age=50)
    saved_model = await some_test_repo.save(model)
    trial = TrialModel(content="Relation trial", test_model_uid=saved_model.uid)
    trial_saved = await trial_repo.save(trial)

    fetched_model = await some_test_repo.get(
        uid=saved_model.uid, related=["trials"]
    )
    assert len(fetched_model.trials) == 1
    assert fetched_model.trials[0].uid == trial_saved.uid


@pytest.mark.asyncio
async def test_edge_cases(some_test_repo):
    # Empty model creation
    with pytest.raises(ValueError):
        await some_test_repo.create()

    # Invalid field update
    model = SomeTestModel(name="invalid_update")
    saved_model = await some_test_repo.save(model)
    with pytest.raises(Exception):
        await some_test_repo.update(saved_model.uid, non_existent_field="value")

    # Bulk create with empty list
    with pytest.raises(ValueError):
        await some_test_repo.bulk_create([])

    # Bulk update with empty mappings
    with pytest.raises(ValueError):
        await some_test_repo.bulk_update_with_mappings([])
