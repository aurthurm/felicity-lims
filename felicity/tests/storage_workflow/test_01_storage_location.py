# import logging
# 
# import pytest
# 
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# 
# add_storage_location_query = """
#   mutation AddStorageLocation($payload: StorageLocationInputType!){
#   createStorageLocation(payload: $payload) {
#     ... on StorageLocationType {
#         uid
#         name
#         description  
#         storeRoomUid
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
# @pytest.mark.order(210)
# async def test_add_storage_location(app, auth_data):
#     storage_location = {
#         "storeRoomUid": 1,
#         "name": "Storage Location 1",
#         "description": "Storage location one",
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": add_storage_location_query,
#             "variables": {"payload": storage_location},
#         },
#         headers=auth_data["headers"],
#     )
# 
#     logger.info(f"register storage location response: {response} {response.json}")
# 
#     assert response.status_code == 200
#     _st_l = response.json["data"]["createStorageLocation"]
#     assert _st_l["uid"] is not None
#     assert _st_l["name"] == storage_location["name"]
#     assert _st_l["storeRoomUid"] == 1
# import logging
# 
# import pytest
# 
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# 
# add_storage_location_query = """
#   mutation AddStorageLocation($payload: StorageLocationInputType!){
#   createStorageLocation(payload: $payload) {
#     ... on StorageLocationType {
#         uid
#         name
#         description  
#         storeRoomUid
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
# @pytest.mark.order(210)
# async def test_add_storage_location(app, auth_data):
#     storage_location = {
#         "storeRoomUid": 1,
#         "name": "Storage Location 1",
#         "description": "Storage location one",
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": add_storage_location_query,
#             "variables": {"payload": storage_location},
#         },
#         headers=auth_data["headers"],
#     )
# 
#     logger.info(f"register storage location response: {response} {response.json}")
# 
#     assert response.status_code == 200
#     _st_l = response.json["data"]["createStorageLocation"]
#     assert _st_l["uid"] is not None
#     assert _st_l["name"] == storage_location["name"]
#     assert _st_l["storeRoomUid"] == 1
