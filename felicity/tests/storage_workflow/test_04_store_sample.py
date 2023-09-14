# import logging
#
# import pytest
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(240)
# async def test_add_sample_to_storage(app, auth_data):
#     add_ar_gql = """
#         mutation AddAnalysisRequest ($payload: AnalysisRequestInputType!) {
#           createAnalysisRequest(payload: $payload) {
#             ... on AnalysisRequestWithSamples{
#               __typename
#               uid
#               clientRequestId
#               createdAt
#               patient {
#                 uid
#                 firstName
#                 lastName
#                 clientPatientId
#                 gender
#                 dateOfBirth
#                 age
#                 ageDobEstimated
#                 consentSms
#               }
#               client {
#                 uid
#                 name
#               }
#               samples {
#                 uid
#                 sampleType {
#                   uid
#                   name
#                 }
#                 sampleId
#                 priority
#                 status
#                 analyses {
#                   uid
#                   name
#                   sortKey
#                 }
#                 profiles {
#                   uid
#                   name
#                 }
#               }
#             }
#
#             ... on OperationError {
#               __typename
#               error
#               suggestion
#             }
#           }
#         }
#     """
#
#     analysis_request = {
#         "clientRequestId": "BBB2222",
#         "clientUid": 1,
#         "clientContactUid": 1,
#         "patientUid": 1,
#         "priority": 1,
#         "samples": [
#             {"sampleType": 1, "profiles": [1], "analyses": []},
#             {"sampleType": 1, "profiles": [1], "analyses": []},
#             {"sampleType": 1, "profiles": [1], "analyses": []},
#             {"sampleType": 1, "profiles": [1], "analyses": []},
#             {"sampleType": 1, "profiles": [1], "analyses": []},
#         ],
#     }
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={"query": add_ar_gql, "variables": {"payload": analysis_request}},
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"add analysis request response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _data = response.json["data"]["createAnalysisRequest"]
#     assert _data["uid"] is not None
#     assert len(_data["samples"]) == 5
#
#     selected_samples = _data["samples"]
#     sample_uids = [sample["uid"] for sample in selected_samples]
#
#     store_samples_query = """
#         mutation SampleStorage($payload: [StoreSamplesInputType!]!){
#           storeSamples(payload: $payload) {
#             ... on StoredSamplesType {
#               samples {
#                 sampleId
#                 storageContainerUid
#                 storageSlot
#                 storageSlotIndex
#                 status
#               }
#             }
#             ... on OperationError {
#                 error
#             }
#           }
#         }
#     """
#
#     store_samples_data = []
#     for idx, suid in enumerate(sample_uids):
#         store_samples_data.append(
#             {
#                 "storageContainerUid": 1,
#                 "storageSlot": str(idx),
#                 "storageSlotIndex": idx,
#                 "sampleUid": suid,
#             }
#         )
#
#     _, response = await app.asgi_client.post(
#         "/felicity-gql",
#         json={
#             "query": store_samples_query,
#             "variables": {"payload": store_samples_data},
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"store samples response: {response} {response.json}")
#
#     assert response.status_code == 200
#     _data = response.json["data"]["storeSamples"]
#     assert len(_data["samples"]) == 5
#     for sample in _data["samples"]:
#         assert sample["storageSlot"] is not None
#         assert sample["storageContainerUid"] == 1
