import logging

import pytest
from apps.analysis.tasks import submit_results, verify_results
from tests.utils.user import make_password, make_username

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(80)
async def test_submit_results(gql_client, auth_data):
    add_gql = """
     mutation SubmitAnalysisResults($analysisResults: [ARResultInputType!]!, $sourceObject: String!, $sourceObjectUid: Int!) {
        submitAnalysisResults(analysisResults: $analysisResults, sourceObject: $sourceObject, sourceObjectUid: $sourceObjectUid){
          ... on OperationSuccess {
            message
          }
      
          ... on OperationError {
            __typename
            error
            suggestion
          }
        }
      }
    """

    response = await gql_client.post(
        "/felicity-gql",
        json={
            "query": add_gql,
            "variables": {
                "analysisResults": [
                    {"uid": 1, "result": "Target Not Detected"},
                    {"uid": 2, "result": "Target Not Detected"},
                    {"uid": 3, "result": "Target Not Detected"},
                    {"uid": 4, "result": "Target Not Detected"},
                    {"uid": 5, "result": "Target Not Detected"},
                ],
                "sourceObject": "worksheet",
                "sourceObjectUid": 1,
            },
        },
        headers=auth_data["headers"],
    )

    logger.info(f"submitting worksheet results response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["submitAnalysisResults"]
    assert _data["message"] == "Your results are being submitted in the background."

    # process job for the next test
    await submit_results(2)


@pytest.mark.asyncio
@pytest.mark.order(81)
async def test_retract_result(gql_client, auth_data):
    add_gql = """
      mutation RetractAnalysisResults ($analyses: [Int!]!) {
        retractAnalysisResults(analyses: $analyses){
          ... on ResultListingType {
            results {
              uid
              status
              sampleUid
              result
              sample{
                uid
                sampleId
                status
                rejectionReasons {
                  uid
                  reason
                }
              }
              analysisUid
              analysis {
                uid
                name
                unitUid
                unit {
                  uid
                  name
                }
                sortKey
                interims {
                  uid
                  key
                  value
                  analysisUid
                  instrumentUid
                }
                resultOptions {
                  uid
                  optionKey
                  value
                }
              }
              retest
              reportable
              createdAt
              createdByUid
              updatedAt
              updatedByUid
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

    response = await gql_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"analyses": [2]}},
        headers=auth_data["headers"],
    )

    logger.info(f"retract result response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["retractAnalysisResults"]
    assert len(_data["results"]) == 2
    for _, result in enumerate(_data["results"]):
        if result["uid"] == 2:
            assert result["status"] == "retracted"
            assert result["result"] == "Target Not Detected"
            assert result["retest"] is False
            assert result["reportable"] is False
        else:
            assert result["uid"] == 6
            assert result["status"] == "pending"
            assert result["result"] is None
            assert result["retest"] is True
            assert result["reportable"] is True


@pytest.mark.asyncio
@pytest.mark.order(82)
async def test_retest_result(gql_client, auth_data):
    add_gql = """
      mutation RetestAnalysisResults ($analyses: [Int!]!) {
        retestAnalysisResults(analyses: $analyses){
          ... on ResultListingType {
            results {
              uid
              status
              sampleUid
              result
              sample{
                uid
                sampleId
                status
                rejectionReasons {
                  uid
                  reason
                }
              }
              analysisUid
              analysis {
                uid
                name
                unitUid
                unit {
                  uid
                  name
                }
                sortKey
                interims {
                  uid
                  key
                  value
                  analysisUid
                  instrumentUid
                }
                resultOptions {
                  uid
                  optionKey
                  value
                }
              }
              retest
              reportable
              createdAt
              createdByUid
              updatedAt
              updatedByUid
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

    response = await gql_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"analyses": [3]}},
        headers=auth_data["headers"],
    )

    logger.info(f"retest result response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["retestAnalysisResults"]
    assert len(_data["results"]) == 2
    for _, result in enumerate(_data["results"]):
        if result["uid"] == 3:
            assert result["status"] == "approved"
            assert result["result"] == "Target Not Detected"
            assert result["retest"] is False
            assert result["reportable"] is False
        else:
            assert result["uid"] == 7
            assert result["status"] == "pending"
            assert result["result"] is None
            assert result["retest"] is True
            assert result["reportable"] is True


@pytest.mark.asyncio
@pytest.mark.order(83)
async def test_submit_results_for_reflexed(gql_client, auth_data):
    """Add results to retested and retracted"""
    add_gql = """
     mutation SubmitAnalysisResults($analysisResults: [ARResultInputType!]!, $sourceObject: String!, $sourceObjectUid: Int!) {
        submitAnalysisResults(analysisResults: $analysisResults, sourceObject: $sourceObject, sourceObjectUid: $sourceObjectUid){
          ... on OperationSuccess {
            message
          }

          ... on OperationError {
            __typename
            error
            suggestion
          }
        }
      }
    """

    response = await gql_client.post(
        "/felicity-gql",
        json={
            "query": add_gql,
            "variables": {
                "analysisResults": [
                    {"uid": 6, "result": "TND"},
                    {"uid": 7, "result": "TND"},
                ],
                "sourceObject": "worksheet",
                "sourceObjectUid": 1,
            },
        },
        headers=auth_data["headers"],
    )

    logger.info(f"submitting worksheet results response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["submitAnalysisResults"]
    assert _data["message"] == "Your results are being submitted in the background."

    # process job for the next test
    await submit_results(3)


@pytest.mark.asyncio
@pytest.mark.order(84)
async def test_verify_ws_results(client, gql_client):
    add_gql = """
      mutation VerifyAnalysisResults ($analyses: [Int!]!, $sourceObject: String!, $sourceObjectUid: Int!) {
        verifyAnalysisResults(analyses: $analyses, sourceObject: $sourceObject, sourceObjectUid: $sourceObjectUid){
          ... on OperationSuccess {
            message
          }

          ... on OperationError {
            __typename
            error
            suggestion
          }
        }
      }
    """

    response = await client.post(
        "/login/access-token",
        data={"username": make_username("Daniel"), "password": make_password("Daniel")},
    )

    response = await gql_client.post(
        "/felicity-gql",
        json={
            "query": add_gql,
            "variables": {
                "analyses": [1, 4, 5, 6],
                "sourceObject": "worksheet",
                "sourceObjectUid": 1,
            },
        },
        headers={"Authorization": f"bearer {response.json()['access_token']}"},
    )

    logger.info(f"verifying worksheet results response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["verifyAnalysisResults"]
    assert _data["message"] == "Your results are being verified in the background."

    # process job for the next test
    await verify_results(4)


@pytest.mark.asyncio
@pytest.mark.order(85)
async def test_verify_sample_results(client, gql_client):
    """retested results cease to be part of worksheet"""
    add_gql = """
      mutation VerifyAnalysisResults ($analyses: [Int!]!, $sourceObject: String!, $sourceObjectUid: Int!) {
        verifyAnalysisResults(analyses: $analyses, sourceObject: $sourceObject, sourceObjectUid: $sourceObjectUid){
          ... on OperationSuccess {
            message
          }

          ... on OperationError {
            __typename
            error
            suggestion
          }
        }
      }
    """

    verifier = await client.post(
        "/login/access-token",
        data={"username": make_username("Daniel"), "password": make_password("Daniel")},
    )

    response = await gql_client.post(
        "/felicity-gql",
        json={
            "query": add_gql,
            "variables": {
                "analyses": [7],
                "sourceObject": "sample",
                "sourceObjectUid": 3,  # retested
            },
        },
        headers={"Authorization": f"bearer {verifier.json()['access_token']}"},
    )

    logger.info(f"verifying worksheet results response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["verifyAnalysisResults"]
    assert _data["message"] == "Your results are being verified in the background."

    # process job for the next test
    await verify_results(5)


@pytest.mark.asyncio
@pytest.mark.order(86)
async def test_check_results(gql_client, auth_data):
    add_gql = """
      query getAnalysesResultsBySampleUid($uid: Int!) {
        analysisResultBySampleUid(uid: $uid) {
            uid
            status
            sampleUid
            result
              method {
                uid
                name
              }
              instrument {
                uid
                name
              }
            sample {
              uid
              sampleId
              status
              rejectionReasons {
                uid
                reason
              }
            }
            analysisUid
            analysis {
              uid
              name
              unitUid
              unit {
                uid
                name
              }
              sortKey
              interims {
                uid
                key
                value
                analysisUid
                instrumentUid
              }
              resultOptions {
                uid
                optionKey
                value
              }
            }
            retest
            reportable
            createdAt
            createdByUid
            updatedAt
            updatedByUid
          }
    }
    """

    response = await gql_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"uid": 1}},
        headers=auth_data["headers"],
    )

    logger.info(f"get results by sample uid response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["analysisResultBySampleUid"]
    assert len(_data) > 0
    result = _data[0]
    assert result["uid"] == 1
    assert result["status"] == "approved"
    assert result["result"] == "Target Not Detected"
    assert result["retest"] is False
    assert result["reportable"] is True
