import pytest
import logging

from felicity.apps.analysis.tasks import submit_results, verify_results
from felicity.tests.utils.user import make_username, make_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(90)
async def test_sample_publish(gql_client, auth_data):
    add_gql = """
       mutation PublishSamples ($samples: [Int!]!) {
        publishSamples(samples: $samples){
          ... on SampleListingType{
            __typename
            samples {
              uid
              status
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

    response = await gql_client.post('/felicity-gql', json={
        "query": add_gql,
        "variables": {
            "samples": [1,2,3,4,5],
        }
    }, headers=auth_data['headers'])

    logger.info(f"publishing samples response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["publishSamples"]
    assert len(_data["samples"]) == 5
    for _, sample in enumerate(_data["samples"]):
        assert sample["uid"] is not None
        assert sample["status"] == "published"


@pytest.mark.asyncio
@pytest.mark.order(91)
async def test_sample_invalidate(gql_client, auth_data):
    add_gql = """
      mutation InvalidateSamples ($samples: [Int!]!) {
        invalidateSamples(samples: $samples){
          ... on SampleListingType{
            __typename
            samples {
              uid
              status
              sampleId
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

    response = await gql_client.post('/felicity-gql', json={
        "query": add_gql,
        "variables": {
            "samples": [1],
        }
    }, headers=auth_data['headers'])

    logger.info(f"publishing samples response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["invalidateSamples"]
    assert len(_data["samples"]) == 2
    for _, sample in enumerate(_data["samples"]):
        if sample['uid'] == 1:
            assert sample['status'] == "invalidated"
            assert sample['sampleId'].endswith("_R01") is False
        else:
            assert sample['status'] == "received"
            assert sample['sampleId'].endswith("_R01") is True
