import logging

import pytest

from felicity.apps.impress.sample.tasks import impress_results
from felicity.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(90)
async def test_sample_publish(app_gql, auth_data):
    publish_mutation = """
       mutation PublishSamples ($samples: [SamplePublishInputType!]!) {
        publishSamples(samples: $samples){
            ... on SampleListingType {
                samples {
                    uid
                    status
                }
                message
            }
        
            ... on OperationSuccess {
                message
            }
        }
      }
    """

    approved_samples_query = """
       query SearchSamples ($status: String!, $text: String!, $clientUid: String!) {
        sampleSearch(status: $status, text: $text, clientUid: $clientUid) {
            uid
            status
        }
      }
    """

    approved_response = await app_gql.post(
        "/beak-gql",
        json={
            "query": approved_samples_query,
            "variables": {"status": "approved", "text": "", "clientUid": ""},
        },
        headers=auth_data["headers"],
    )
    logger.info(f"approved_response samples response: {approved_response} {approved_response.json()}")
    _samples = approved_response.json()["data"]["sampleSearch"]

    response = await app_gql.post(
        "/beak-gql",
        json={
            "query": publish_mutation,
            "variables": {
                "samples": [{"uid": s["uid"], "action": "publish"} for s in _samples],
            },
        },
        headers=auth_data["headers"],
    )

    logger.info(f"publishing samples response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["publishSamples"]

    if not settings.ENABLE_BACKGROUND_PROCESSING:
        assert _data["message"] == "Samples have been impressed"
        assert len(_data["samples"]) == len(_samples)
    else:
        assert _data["message"] == "Your results are being published in the background."

        job_response = await app_gql.get("api/v1/jobs")
        logger.info(f"jobs ::::::::::::::: {job_response.json()}")
        jobs = list(filter(lambda j: j["status"] == "pending", job_response.json()))
        await impress_results(jobs[0]["uid"])


@pytest.mark.asyncio
@pytest.mark.order(91)
async def test_sample_invalidate(app_gql, auth_data):
    invalidation_mutation = """
      mutation InvalidateSamples ($samples: [String!]!) {
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

    published_samples_query = """
       query SearchSamples ($status: String!, $text: String!, $clientUid: String!) {
        sampleSearch(status: $status, text: $text, clientUid: $clientUid) {
            uid
            status
        }
      }
    """
    published_response = await app_gql.post(
        "/beak-gql",
        json={
            "query": published_samples_query,
            "variables": {"status": "published", "text": "", "clientUid": ""},
        },
        headers=auth_data["headers"],
    )
    logger.info(f"approved_response samples response: {published_response} {published_response.json()}")
    _samples = published_response.json()["data"]["sampleSearch"]

    response = await app_gql.post(
        "/beak-gql",
        json={
            "query": invalidation_mutation,
            "variables": {
                "samples": [_samples[0].get("uid")],
            },
        },
        headers=auth_data["headers"],
    )

    logger.info(f"publishing samples response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["invalidateSamples"]
    assert len(_data["samples"]) == 2
    for _, sample in enumerate(_data["samples"]):
        if not sample["sampleId"].endswith("_R01"):
            assert sample["status"] == "invalidated"
        else:
            assert sample["status"] == "received"
