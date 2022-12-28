import pytest
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

get_all_stocks_product_query = """
  query FetchStockProducts {
      stockProductAll {
        totalCount
        items {
            name
            quantityReceived
            remaining
        }
    }
  }
"""


@pytest.mark.asyncio
@pytest.mark.order(330)
async def test_stock_adjustments(gql_client, auth_data):
    add_stock_adjustment_mutation = """
      mutation AddStockAdjustment($payload: StockAdjustmentInputType!){
          createStockAdjustment(payload: $payload) {
            ... on StockAdjustmentType {
                uid
                adjust
                adjustmentType
            }
            ... on OperationError {
                error
            }
          }
      }
    """

    stock_adjustment = {
        'productUid': 1,
        "adjust": 3,
        "adjustmentType": "lost",
        "remarks": "These items were lost"
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_stock_adjustment_mutation,
        "variables": {
            "payload": stock_adjustment
        }
    }, headers=auth_data['headers'])

    logger.info(f"register stock adjustment response: {response} {response.json()}")

    assert response.status_code == 200
    data = response.json()["data"]["createStockAdjustment"]
    assert data["uid"] == 1
    assert data["adjust"] == stock_adjustment["adjust"]
    assert data["adjustmentType"] == stock_adjustment["adjustmentType"]

    stocks_response = await gql_client.post('/felicity-gql', json={
        "query": get_all_stocks_product_query,
    }, headers=auth_data['headers'])

    logger.info(f"stocks_response: {stocks_response} {stocks_response.json()}")
    assert stocks_response.status_code == 200
    spa = stocks_response.json()["data"]["stockProductAll"]
    assert spa["totalCount"] == 1
    assert len(spa["items"]) == 1
    less_product = spa["items"][0]
    assert less_product["remaining"] == less_product["quantityReceived"] - data["adjust"]

    # Addition adjustment
    new_stock_adjustment = {
        'productUid': 1,
        "adjust": 2,
        "adjustmentType": "transfer in",
        "remarks": "Recovered property"
    }
    new_response = await gql_client.post('/felicity-gql', json={
        "query": add_stock_adjustment_mutation,
        "variables": {
            "payload": new_stock_adjustment
        }
    }, headers=auth_data['headers'])

    logger.info(f"register stock adjustment response: {new_response} {new_response.json()}")

    assert new_response.status_code == 200
    new_data = new_response.json()["data"]["createStockAdjustment"]
    assert new_data["uid"] == 2
    assert new_data["adjust"] == new_stock_adjustment["adjust"]
    assert new_data["adjustmentType"] == new_stock_adjustment["adjustmentType"]

    new_stocks_response = await gql_client.post('/felicity-gql', json={
        "query": get_all_stocks_product_query,
    }, headers=auth_data['headers'])

    logger.info(f"stocks_response: {new_stocks_response} {new_stocks_response.json()}")
    assert new_stocks_response.status_code == 200
    new_spa = new_stocks_response.json()["data"]["stockProductAll"]
    assert new_spa["totalCount"] == 1
    assert len(new_spa["items"]) == 1
    new_product = new_spa["items"][0]
    assert new_product["remaining"] == (less_product["remaining"] + new_data["adjust"])


@pytest.mark.asyncio
@pytest.mark.order(331)
async def test_stock_transaction(gql_client, auth_data):
    add_stock_transaction_mutation = """
      mutation AddStockTransaction($payload: StockTransactionInputType!){
          createStockTransaction(payload: $payload) {
            ... on StockTransactionType {
                uid
                productUid
                issued
            }
            ... on OperationError {
                error
            }
          }
      }
    """

    stock_transaction = {
        'productUid': 1,
        "issued": 5,
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_stock_transaction_mutation,
        "variables": {
            "payload": stock_transaction
        }
    }, headers=auth_data['headers'])

    logger.info(f"register stock transaction response: {response} {response.json()}")

    assert response.status_code == 200
    data = response.json()["data"]["createStockTransaction"]
    assert data["uid"] == 1
    assert data["issued"] == stock_transaction["issued"]

    stocks_response = await gql_client.post('/felicity-gql', json={
        "query": get_all_stocks_product_query,
    }, headers=auth_data['headers'])

    logger.info(f"stocks_response: {stocks_response} {stocks_response.json()}")
    assert stocks_response.status_code == 200
    spa = stocks_response.json()["data"]["stockProductAll"]
    assert spa["totalCount"] == 1
    assert len(spa["items"]) == 1
    product = spa["items"][0]
    assert product["remaining"] == 4
