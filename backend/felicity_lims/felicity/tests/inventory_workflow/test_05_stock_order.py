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
@pytest.mark.order(340)
async def test_stock_order(gql_client, auth_data):
    add_stock_order_mutation = """
      mutation AddStockOrder($payload: StockOrderInputType!){
          createStockOrder(payload: $payload) {
            ... on StockOrderLineType {
                stockOrder {
                    uid
                    orderNumber
                    status
                }
                orderProducts {
                    productUid
                    orderUid
                    price
                    quantity  
                }
            }
            ... on OperationError {
                error
            }
          }
      }
    """

    stock_order = {
        'orderProducts': [
            {
                "productUid": 1,
                "quantity": 2
            }
        ]
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_stock_order_mutation,
        "variables": {
            "payload": stock_order
        }
    }, headers=auth_data['headers'])

    logger.info(f"register stock order response: {response} {response.json()}")

    assert response.status_code == 200
    order_line = response.json()["data"]["createStockOrder"]
    order = order_line["stockOrder"]
    assert order["uid"] == 1
    assert order["orderNumber"] == "SON22-00006"
    assert order["status"] == "created"
    order_products = order_line["orderProducts"]
    assert len(order_products) == 1
    order_product = order_products[0]
    assert order_product["productUid"] == 1
    assert order_product["orderUid"] == 1
    assert order_product["price"] == 150
    assert order_product["quantity"] == 2
