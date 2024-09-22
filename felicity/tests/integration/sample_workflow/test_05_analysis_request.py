import logging

import pytest
from faker import Faker

fake_engine = Faker()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(60)
async def test_add_analysis_request(
    app_gql, auth_data, profiles, sample_types, clients, client_contacts, patients
):
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
        "clientUid": clients[0]["uid"],
        "clientContactUid": client_contacts[0]["uid"],
        "patientUid": patients[0]["uid"],
        "priority": 1,
        "samples": [
            {
                "sampleType": sample_types[0]["uid"],
                "profiles": [profiles[0]["uid"]],
                "dateCollected": fake_engine.date_time_between(
                    start_date="-2d", end_date="now"
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "analyses": [],
            },
            {
                "sampleType": sample_types[0]["uid"],
                "profiles": [profiles[0]["uid"]],
                "dateCollected": fake_engine.date_time_between(
                    start_date="-2d", end_date="now"
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "analyses": [],
            },
            {
                "sampleType": sample_types[0]["uid"],
                "profiles": [profiles[0]["uid"]],
                "dateCollected": fake_engine.date_time_between(
                    start_date="-2d", end_date="now"
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "analyses": [],
            },
            {
                "sampleType": sample_types[0]["uid"],
                "profiles": [profiles[0]["uid"]],
                "dateCollected": fake_engine.date_time_between(
                    start_date="-2d", end_date="now"
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "analyses": [],
            },
            {
                "sampleType": sample_types[0]["uid"],
                "profiles": [profiles[0]["uid"]],
                "dateCollected": fake_engine.date_time_between(
                    start_date="-2d", end_date="now"
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "analyses": [],
            },
        ],
    }
    response = await app_gql.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"payload": analysis_request}},
        headers=auth_data["headers"],
    )

    logger.info(f"add analysis request response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json()["data"]["createAnalysisRequest"]
    assert _data["uid"] is not None
    assert _data["clientRequestId"] == analysis_request["clientRequestId"]
    assert _data["clientRequestId"] == analysis_request["clientRequestId"]
    assert _data["patient"]["uid"] is not None
    assert _data["client"]["uid"] is not None
    # assert _data["createdAt"] is not None
    assert len(_data["samples"]) == 5
    for idx, sample in enumerate(_data["samples"]):
        assert sample["uid"] is not None
