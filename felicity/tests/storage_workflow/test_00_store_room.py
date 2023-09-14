# import logging
#
# import pytest
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
# add_store_room_query = """
#   mutation AddStoreRoom($payload: StoreRoomInputType!){
#   createStoreRoom(payload: $payload) {
#     ... on StoreRoomType {
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
# update_store_room_query = """
#   mutation EditStoreRoom($uid: Int!, $payload: StoreRoomInputType!){
#   updateStoreRoom(uid: $uid, payload: $payload) {
#     ... on StoreRoomType {
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
# @pytest.mark.order(200)
# async def test_add_store_room(app, auth_data):
#     store_room = {"name": "Store Room 1", "description": "Storage area one"}
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={"query": add_store_room_query, "variables": {"payload": store_room}},
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"register store room response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _st = response.json["data"]["createStoreRoom"]
#     assert _st["uid"] is not None
#     assert _st["name"] == store_room["name"]
#     assert _st["description"] == store_room["description"]
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(201)
# async def test_update_store_room(app, auth_data):
#     store_room = {
#         "name": "Store Room 1 Updated",
#         "description": "Storage area one Updated",
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": update_store_room_query,
#             "variables": {"uid": 1, "payload": store_room},
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"register store room response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _st = response.json["data"]["updateStoreRoom"]
#     assert _st["uid"] is not None
#     assert _st["name"] == store_room["name"]
#     assert _st["description"] == store_room["description"]
