import pytest
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(60)
async def test_add_analysis_request(gql_client, auth_data):
    add_gql = """
        mutation AddAnalysisRequest ($payload: AnalysisRequestInputType!) {
          createAnalysisRequest(payload: $payload) {
            ... on AnalysisRequestWithSamples{
              __typename
              uid
              clientRequestId
              createdAt
              patient {
                uid
                firstName
                lastName
                clientPatientId
                gender
                dateOfBirth
                age
                ageDobEstimated
                consentSms
              }
              client {
                uid
                name
              }
              samples {
                uid
                sampleType {
                  uid
                  name
                }
                sampleId
                priority
                status
                analyses {
                  uid
                  name
                  sortKey
                }
                profiles {
                  uid
                  name
                }
              }
            }
        
            ... on OperationError {
              __typename
              error
              suggestion
            }
          }
        }
    """

    analysis_request = {
        "clientRequestId": "AAA111",
        "clientUid": 1,
        "clientContactUid": 1,
        "patientUid": 1,
        "priority": 1,
        "samples": [
            {"sampleType": 1, "profiles": [1], "analyses": []},
            {"sampleType": 1, "profiles": [1], "analyses": []},
            {"sampleType": 1, "profiles": [1], "analyses": []},
            {"sampleType": 1, "profiles": [1], "analyses": []},
            {"sampleType": 1, "profiles": [1], "analyses": []}
        ]
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_gql,
        "variables": {
            "payload": analysis_request
        }
    }, headers=auth_data['headers'])

    logger.info(f"add analysis request response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["createAnalysisRequest"]
    assert _data["uid"] == 1
    assert _data["clientRequestId"] == analysis_request["clientRequestId"]
    assert _data["clientRequestId"] == analysis_request["clientRequestId"]
    assert _data["patient"]["uid"] == 1
    assert _data["client"]["uid"] == 1
    assert _data["createdAt"] is not None
    assert len(_data["samples"]) == 5
    for idx, sample in enumerate(_data["samples"]):
        sample_uid = idx + 1
        assert sample["uid"] == sample_uid
