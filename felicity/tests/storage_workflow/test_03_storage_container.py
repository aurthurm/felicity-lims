# import logging
#
# import pytest
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
# add_storage_container_query = """
#   mutation AddStorageContainer($payload: StorageContainerInputType!){
#   createStorageContainer(payload: $payload) {
#     ... on StorageContainerType {
#         uid
#         name
#         description
#         storageSectionUid
#         slots
#         rows
#         cols
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
# @pytest.mark.order(230)
# async def test_add_storage_container(app, auth_data):
#     storage_container = {
#         "storageSectionUid": 1,
#         "name": "Storage Location 1",
#         "description": "Storage section one",
#         "slots": 100,
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": add_storage_container_query,
#             "variables": {"payload": storage_container},
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"register storage container response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _st_c = response.json["data"]["createStorageContainer"]
#     assert _st_c["uid"] is not None
#     assert _st_c["name"] == storage_container["name"]
#     assert _st_c["storageSectionUid"] == 1
#     assert _st_c["slots"] == storage_container["slots"]
