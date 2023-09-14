# import logging
#
# import pytest
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(320)
# async def test_add_stock_product(app, auth_data):
#     add_stock_product_mutation = """
#       mutation AddStockProduct($payload: StockProductInputType!){
#           createStockProduct(payload: $payload) {
#             ... on StockProductType {
#                 uid
#                 name
#                 categoryUid
#                 hazardUid
#                 storeRoomUid
#                 lotNumber
#                 batch
#                 quantityReceived
#                 minimumLevel
#                 remaining
#             }
#             ... on OperationError {
#                 error
#             }
#           }
#       }
#     """
#
#     stock_product = {
#         "name": "Stramatolyser FB",
#         "categoryUid": 1,
#         "hazardUid": 1,
#         "storeRoomUid": 1,
#         "lotNumber": "AGT52525",
#         "batch": "ER777722",
#         "size": 50,
#         "unitUid": 1,
#         "packagingUid": 1,
#         "price": 150.00,
#         "quantityReceived": 10,
#         "minimumLevel": 2,
#     }
#     for idx, item in enumerate(
#         ["Stromatolyser FB", "Petri Dish", "Pipette", "S-Tube", "Blood Culture Bottle"]
#     ):
#         stock_product["name"] = item
#         _, response = await app.asgi_client.post(
#             "/felicity-gql",
#             json={
#                 "query": add_stock_product_mutation,
#                 "variables": {"payload": stock_product},
#             },
#             headers=auth_data["headers"],
#         )
#
#         logger.info(f"register stock product response: {response} {response.json}")
#
#         assert response.status_code == 200
#         data = response.json["data"]["createStockProduct"]
#         assert data["uid"] == idx + 1
#         assert data["name"] == stock_product["name"]
#         assert data["categoryUid"] == stock_product["categoryUid"]
#         assert data["hazardUid"] == stock_product["hazardUid"]
#         assert data["storeRoomUid"] == stock_product["storeRoomUid"]
#         assert data["lotNumber"] == stock_product["lotNumber"]
#         assert data["batch"] == stock_product["batch"]
#         assert data["quantityReceived"] == stock_product["quantityReceived"]
#         assert data["minimumLevel"] == stock_product["minimumLevel"]
#         assert data["remaining"] == stock_product["quantityReceived"]
