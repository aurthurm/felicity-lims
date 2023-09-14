# import logging
#
# import pytest
# from apps.impress.tasks import impress_results
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(90)
# async def test_sample_publish(app, auth_data):
#     add_gql = """
#        mutation PublishSamples ($samples: [SamplePublishInputType!]!) {
#         publishSamples(samples: $samples){
#           ... on OperationSuccess{
#             __typename
#             message
#           }
#
#           ... on OperationError {
#             __typename
#             error
#             suggestion
#           }
#         }
#       }
#     """
#
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": add_gql,
#             "variables": {
#                 "samples": [
#                     {"uid": 1, "action": "publish"},
#                     {"uid": 2, "action": "publish"},
#                     {"uid": 3, "action": "publish"},
#                     {"uid": 4, "action": "publish"},
#                     {"uid": 5, "action": "publish"},
#                 ],
#             },
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"publishing samples response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _data = response.json["data"]["publishSamples"]
#     assert _data["message"] == "Your results are being published in the background."
#
#     # process job for the next test
#     await impress_results(6)
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(91)
# async def test_sample_invalidate(app, auth_data):
#     add_gql = """
#       mutation InvalidateSamples ($samples: [Int!]!) {
#         invalidateSamples(samples: $samples){
#           ... on SampleListingType{
#             __typename
#             samples {
#               uid
#               status
#               sampleId
#             }
#           }
#
#           ... on OperationError {
#             __typename
#             error
#             suggestion
#           }
#         }
#       }
#     """
#
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": add_gql,
#             "variables": {
#                 "samples": [1],
#             },
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"publishing samples response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _data = response.json["data"]["invalidateSamples"]
#     assert len(_data["samples"]) == 2
#     for _, sample in enumerate(_data["samples"]):
#         if sample["uid"] is not None:
#             assert sample["status"] == "invalidated"
#             assert sample["sampleId"].endswith("_R01") is False
#         else:
#             assert sample["status"] == "received"
#             assert sample["sampleId"].endswith("_R01") is True
