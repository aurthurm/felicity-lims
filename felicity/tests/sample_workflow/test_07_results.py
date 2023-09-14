import logging

import pytest

from apps.analysis.tasks import submit_results, verify_results
from tests.utils.user import make_password, make_username

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(80)
async def test_submit_results(app, auth_data, samples, worksheets):
    add_gql = """
     mutation SubmitAnalysisResults($analysisResults: [ARResultInputType!]!, $sourceObject: String!, $sourceObjectUid: String!) {
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

    results = [r["analysisResults"][0] for r in samples]

    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={
            "query": add_gql,
            "variables": {
                "analysisResults": [
                    {"uid": results[0]["uid"], "result": "Target Not Detected"},
                    {"uid": results[1]["uid"], "result": "Target Not Detected"},
                    {"uid": results[2]["uid"], "result": "Target Not Detected"},
                    {"uid": results[3]["uid"], "result": "Target Not Detected"},
                    {"uid": results[4]["uid"], "result": "Target Not Detected"},
                ],
                "sourceObject": "worksheet",
                "sourceObjectUid": worksheets[0]["uid"],
            },
        },
        headers=auth_data["headers"],
    )

    logger.info(f"submitting worksheet results response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json["data"]["submitAnalysisResults"]
    assert _data["message"] == "Your results are being submitted in the background."

    # process job for the next test
    _, job_response = await app.asgi_client.get("api/v1/jobs")
    logger.info(f"job response: {job_response} {job_response.json}")
    jobs = list(filter(lambda j: j['status'] == "pending", job_response.json["data"]))
    await submit_results(jobs[0]["uid"])


@pytest.mark.asyncio
@pytest.mark.order(81)
async def test_retract_result(app, auth_data, samples):
    add_gql = """
      mutation RetractAnalysisResults ($analyses: [String!]!) {
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

    results = [r["analysisResults"][0] for r in samples]
    resulted = list(filter(lambda r: r['status'] == "resulted", results))
    logger.info(f"resulted, results: {resulted} {results}")

    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": add_gql, "variables": {"analyses": [resulted[0]["uid"]]}},
        headers=auth_data["headers"],
    )

    logger.info(f"retract result response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json["data"]["retractAnalysisResults"]
    assert len(_data["results"]) == 2
    for _, result in enumerate(_data["results"]):
        if result["status"] == "retracted":
            assert result["result"] == "Target Not Detected"
            assert result["retest"] is False
            assert result["reportable"] is False
        else:
            assert result["uid"] is not None
            assert result["status"] == "pending"
            assert result["result"] is None
            assert result["retest"] is True
            assert result["reportable"] is True


@pytest.mark.asyncio
@pytest.mark.order(82)
async def test_retest_result(app, auth_data, samples):
    add_gql = """
      mutation RetestAnalysisResults ($analyses: [String!]!) {
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

    results = [r["analysisResults"][0] for r in samples]
    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"analyses": [results[3]["uid"]]}},
        headers=auth_data["headers"],
    )

    logger.info(f"retest result response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json["data"]["retestAnalysisResults"]
    assert len(_data["results"]) == 2
    for _, result in enumerate(_data["results"]):
        if result["uid"] == results[3]["uid"]:
            assert result["status"] == "approved"
            assert result["result"] == "Target Not Detected"
            assert result["retest"] is False
            assert result["reportable"] is False
        else:
            assert result["uid"] is not None
            assert result["status"] == "pending"
            assert result["result"] is None
            assert result["retest"] is True
            assert result["reportable"] is True


@pytest.mark.asyncio
@pytest.mark.order(84)
async def test_verify_ws_results(app, samples, users, worksheets):
    add_gql = """
      mutation VerifyAnalysisResults ($analyses: [String!]!, $sourceObject: String!, $sourceObjectUid: String!) {
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

    authe = """
        mutation Auth($username: String!, $password: String!){
          authenticateUser(username: $username, password: $password) {
            ... on AuthenticatedData {
                user {
                    uid
                    firstName
                    lastName
                }
                token  
            }
            ... on OperationError {
                error
            }
          }
        }
    """
    _, auth_resp = await app.asgi_client.post(
        "/felicity-gql",
        json={
            "query": authe,
            "variables": {
                "username": make_username(users[1]['firstName']),
                "password": make_password(users[1]['firstName'])
            }
        }
    )
    logger.info(f"auth_resp: {auth_resp} {auth_resp.json}")

    auth_data = auth_resp.json["data"]["authenticateUser"]

    results = [r["analysisResults"][0] for r in samples]
    results = list(filter(lambda r: r["status"] == "resulted", results))
    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={
            "query": add_gql,
            "variables": {
                "analyses": [results[0]["uid"]],
                "sourceObject": "worksheet",
                "sourceObjectUid": worksheets[0]["uid"],
            },
        },
        headers={"Authorization": f"bearer {auth_data['token']}"},
    )

    logger.info(f"verifying worksheet results response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json["data"]["verifyAnalysisResults"]
    assert _data["message"] == "Your results are being verified in the background."

    # process job for the next test
    _, job_response = await app.asgi_client.get("api/v1/jobs")
    logger.info(f"job response: {job_response} {job_response.json}")
    jobs = list(filter(lambda j: j['status'] == "pending", job_response.json["data"]))
    await verify_results(jobs[0]["uid"])


@pytest.mark.asyncio
@pytest.mark.order(85)
async def test_verify_sample_results(app, users, samples):
    """retested results cease to be part of worksheet"""
    add_gql = """
      mutation VerifyAnalysisResults ($analyses: [String!]!, $sourceObject: String!, $sourceObjectUid: String!) {
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

    authe = """
           mutation Auth($username: String!, $password: String!){
             authenticateUser(username: $username, password: $password) {
               ... on AuthenticatedData {
                   user {
                       uid
                       firstName
                       lastName
                   }
                   token
                   tokenType
               }
               ... on OperationError {
                   error
               }
             }
           }
       """

    _, u_resp = await app.asgi_client.post("felicity-gql", json={
        "query": authe,
        "variables": {
            "username": make_username(users[0]["firstName"]),
            "password": make_password(users[0]["firstName"])
        }
    })

    user_data = u_resp.json["data"]["authenticateUser"]
    logger.info(f"verifier response: {u_resp} {u_resp.json}")

    samples = list(filter(lambda s: s["status"] == "awaiting", samples))
    results = samples[0]["analysisResults"]

    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={
            "query": add_gql,
            "variables": {
                "analyses": [results[0]["uid"]],
                "sourceObject": "sample",
                "sourceObjectUid": samples[0]["uid"],
            },
        },
        headers={"Authorization": f"bearer {user_data['token']}"},
    )

    logger.info(f"verifying worksheet results response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json["data"]["verifyAnalysisResults"]
    assert _data["message"] == "Your results are being verified in the background."

    # process job for the next test
    _, job_response = await app.asgi_client.get("api/v1/jobs")
    logger.info(f"job response: {job_response} {job_response.json}")
    jobs = list(filter(lambda j: j['status'] == "pending", job_response.json["data"]))
    await verify_results(jobs[0]["uid"])


@pytest.mark.asyncio
@pytest.mark.order(86)
async def test_check_results(app, auth_data, samples):
    add_gql = """
      query getAnalysesResultsBySampleUid($uid: String!) {
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
    samples = list(filter(lambda r: r["status"] == "approved", samples))
    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"uid": samples[0]['uid']}},
        headers=auth_data["headers"],
    )

    logger.info(f"get results by sample uid response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json["data"]["analysisResultBySampleUid"]
    assert len(_data) > 0
    result = _data[0]
    assert result["uid"] is not None
    assert result["status"] == "approved"
    assert result["result"] == "Target Not Detected"
    assert result["retest"] is False
    assert result["reportable"] is True
