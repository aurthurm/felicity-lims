# import logging
#
# import pytest
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
# add_stock_item_query = """
#   mutation AddStockItem($payload: StockItemInputType!){
#   createStockItem(payload: $payload) {
#     ... on StockItemType {
#         uid
#         name
#         description
#     }
#     ... on OperationError {
#         error
#     }
#   }
# }
# """
#
# update_stock_item_query = """
#   mutation EditStockItem($uid: Int!, $payload: StockItemInputType!){
#   updateStockItem(uid: $uid, payload: $payload) {
#     ... on StockItemType {
#         uid
#         name
#         description
#     }
#     ... on OperationError {
#         error
#     }
#   }
# }
# """
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(300)
# async def test_add_stock_item(app, auth_data):
#     stock_item = {
#         "name": "Cuvete",
#         "description": "Chemistry testing cuvette for BS500",
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={"query": add_stock_item_query, "variables": {"payload": stock_item}},
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"register stock item response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _st = response.json["data"]["createStockItem"]
#     assert _st["uid"] is not None
#     assert _st["name"] == stock_item["name"]
#     assert _st["description"] == stock_item["description"]
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(301)
# async def test_update_stock_item(app, auth_data):
#     stock_item = {
#         "name": "Cuvette",
#         "description": "Chemistry testing cuvette for Mindray BS500",
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": update_stock_item_query,
#             "variables": {"uid": 1, "payload": stock_item},
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"register store room response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _st = response.json["data"]["updateStockItem"]
#     assert _st["uid"] is not None
#     assert _st["name"] == stock_item["name"]
#     assert _st["description"] == stock_item["description"]
