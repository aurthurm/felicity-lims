# import logging
#
# import pytest
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
# get_all_stocks_product_query = """
#   query FetchStockProducts {
#       stockProductAll {
#         totalCount
#         items {
#             name
#             quantityReceived
#             remaining
#         }
#     }
#   }
# """
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(340)
# async def test_create_stock_order(app, auth_data):
#     add_stock_order_mutation = """
#       mutation AddStockOrder($payload: StockOrderInputType!){
#           createStockOrder(payload: $payload) {
#             ... on StockOrderLineType {
#                 stockOrder {
#                     uid
#                     orderNumber
#                     status
#                 }
#                 orderProducts {
#                     productUid
#                     orderUid
#                     price
#                     quantity
#                 }
#             }
#             ... on OperationError {
#                 error
#             }
#           }
#       }
#     """
#
#     stock_order = {
#         "orderProducts": [
#             {"productUid": 1, "quantity": 5},
#             {"productUid": 2, "quantity": 5},
#             {"productUid": 3, "quantity": 5},
#             {"productUid": 4, "quantity": 5},
#             {"productUid": 5, "quantity": 5},
#         ]
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={"query": add_stock_order_mutation, "variables": {"payload": stock_order}},
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"register stock order response: {response} {response.json}")
#
#     assert response.status_code == 200
#     order_line = response.json["data"]["createStockOrder"]
#     order = order_line["stockOrder"]
#     assert order["uid"] is not None
#     assert order["orderNumber"] == "SON23-00006"
#     assert order["status"] == "preparation"
#     order_products = order_line["orderProducts"]
#     assert len(order_products) == 5
#     order_product = order_products[0]
#     assert order_product["productUid"] is not None
#     assert order_product["orderUid"] == 1
#     assert order_product["price"] == 150
#     assert order_product["quantity"] == 5
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(341)
# async def test_update_stock_order(app, auth_data):
#     add_stock_order_mutation = """
#       mutation EditStockOrder($uid: Int!, $payload: [StockOrderProductLineInputType!]!){
#           updateStockOrder(uid: $uid, payload: $payload) {
#             ... on StockOrderLineType {
#                 stockOrder {
#                     uid
#                     orderNumber
#                     status
#                 }
#                 orderProducts {
#                     productUid
#                     orderUid
#                     price
#                     quantity
#                 }
#             }
#             ... on OperationError {
#                 error
#             }
#           }
#       }
#     """
#
#     stock_mods = [
#         {"productUid": 1, "quantity": 7},
#         {"productUid": 2, "quantity": 3},
#         {"productUid": 3, "quantity": 6},
#         {"productUid": 4, "quantity": 5},
#     ]
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": add_stock_order_mutation,
#             "variables": {"uid": 1, "payload": stock_mods},
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"register stock order response: {response} {response.json}")
#     assert response.status_code == 200
#     order_line = response.json["data"]["updateStockOrder"]
#     order = order_line["stockOrder"]
#     assert order["uid"] is not None
#     assert order["orderNumber"] == "SON23-00006"
#     assert order["status"] == "preparation"
#     order_products = order_line["orderProducts"]
#     assert len(order_products) == 4
#     for order_product in order_products:
#         assert order_product["productUid"] is not None
#         assert order_product["orderUid"] == 1
#         assert order_product["price"] == 150
#         assert order_product["quantity"] in [7, 3, 6, 5]
