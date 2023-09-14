# import logging
#
# import pytest
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
# add_storage_section_query = """
#   mutation AddStorageSection($payload: StorageSectionInputType!){
#   createStorageSection(payload: $payload) {
#     ... on StorageSectionType {
#         uid
#         name
#         description
#         storageLocationUid
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
# @pytest.mark.order(220)
# async def test_add_storage_section(app, auth_data):
#     storage_section = {
#         "storageLocationUid": 1,
#         "name": "Storage Section 1",
#         "description": "Storage section one",
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": add_storage_section_query,
#             "variables": {"payload": storage_section},
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"register storage section response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _st_s = response.json["data"]["createStorageSection"]
#     assert _st_s["uid"] is not None
#     assert _st_s["name"] == storage_section["name"]
#     assert _st_s["storageLocationUid"] == 1
