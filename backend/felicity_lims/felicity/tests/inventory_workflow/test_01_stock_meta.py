import pytest
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(310)
async def test_add_stock_item(gql_client, auth_data):
    add_stock_category_mutation = """
      mutation AddStockCategory($payload: StockCategoryInputType!){
          createStockCategory(payload: $payload) {
            ... on StockCategoryType {
                uid
                name
                description  
            }
            ... on OperationError {
                error
            }
          }
      }
    """

    stock_category = {
        'name': "Consumables",
        'description': "Consumables"
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_stock_category_mutation,
        "variables": {
            "payload": stock_category
        }
    }, headers=auth_data['headers'])

    logger.info(f"register stock category response: {response} {response.json()}")

    assert response.status_code == 200
    data = response.json()["data"]["createStockCategory"]
    assert data["uid"] == 1
    assert data["name"] == stock_category["name"]
    assert data["description"] == stock_category["description"]


@pytest.mark.asyncio
@pytest.mark.order(311)
async def test_add_hazar(gql_client, auth_data):
    add_hazard_mutation = """
      mutation AddHazard($payload: HazardInputType!){
          createHazard(payload: $payload) {
            ... on HazardType {
                uid
                name
                description  
            }
            ... on OperationError {
                error
            }
          }
      }
    """

    hazard = {
        'name': "Caution",
        'description': "Caution hazard"
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_hazard_mutation,
        "variables": {
            "payload": hazard
        }
    }, headers=auth_data['headers'])

    logger.info(f"register hazard response: {response} {response.json()}")

    assert response.status_code == 200
    data = response.json()["data"]["createHazard"]
    assert data["uid"] == 1
    assert data["name"] == hazard["name"]
    assert data["description"] == hazard["description"]


@pytest.mark.asyncio
@pytest.mark.order(312)
async def test_add_stock_unit(gql_client, auth_data):
    add_stock_unit_mutation = """
      mutation AddStockUnit($payload: StockUnitInputType!){
          createStockUnit(payload: $payload) {
            ... on StockUnitType {
                uid
                name
            }
            ... on OperationError {
                error
            }
          }
      }
    """

    stock_unit = {
        'name': "ml",
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_stock_unit_mutation,
        "variables": {
            "payload": stock_unit
        }
    }, headers=auth_data['headers'])

    logger.info(f"register stock unit response: {response} {response.json()}")

    assert response.status_code == 200
    data = response.json()["data"]["createStockUnit"]
    assert data["uid"] == 1
    assert data["name"] == stock_unit["name"]


@pytest.mark.asyncio
@pytest.mark.order(313)
async def test_add_stock_packaging(gql_client, auth_data):
    add_stock_packaging_mutation = """
      mutation AddStockPackaging($payload: StockPackagingInputType!){
          createStockPackaging(payload: $payload) {
            ... on StockPackagingType {
                uid
                name
            }
            ... on OperationError {
                error
            }
          }
      }
    """

    stock_packaging = {
        'name': "container",
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_stock_packaging_mutation,
        "variables": {
            "payload": stock_packaging
        }
    }, headers=auth_data['headers'])

    logger.info(f"register stock package response: {response} {response.json()}")

    assert response.status_code == 200
    data = response.json()["data"]["createStockPackaging"]
    assert data["uid"] == 1
    assert data["name"] == stock_packaging["name"]
