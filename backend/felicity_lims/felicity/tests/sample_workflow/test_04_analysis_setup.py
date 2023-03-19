import logging

import pytest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(40)
async def test_add_sample_type(gql_client, auth_data):
    add_gql = """
      mutation AddSampleType($payload: SampleTypeInputType!){
          createSampleType(payload: $payload) {
            __typename
            ... on SampleTypeTyp {
              uid
              name
              abbr
              active
            }
            ... on OperationError {
              error
              suggestion
            }
          }
        }
    """
    sample_type = {
        "name": "Whole Blood",
        "abbr": "WB",
        "active": True,
    }
    response = await gql_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"payload": sample_type}},
        headers=auth_data["headers"],
    )

    logger.info(f"add sample type response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["createSampleType"]
    assert _data["uid"] == 1
    assert _data["name"] == sample_type["name"]
    assert _data["abbr"] == sample_type["abbr"]
    assert _data["active"] is True


@pytest.mark.asyncio
@pytest.mark.order(41)
async def test_add_instrument(gql_client, auth_data):
    add_gql = """
      mutation AddInstrument($payload: InstrumentInputType!){
          createInstrument(payload: $payload) {
            __typename
            ... on InstrumentType {
              uid
              name
              keyword
            }
            ... on OperationError {
              error
              suggestion
            }
          }
        }
    """
    instrument = {
        "name": "Roche Cobas Ampliprep, Taqman 96",
        "keyword": "HICAP96",
    }
    response = await gql_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"payload": instrument}},
        headers=auth_data["headers"],
    )

    logger.info(f"add instrument response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["createInstrument"]
    assert _data["uid"] == 1
    assert _data["name"] == instrument["name"]
    assert _data["keyword"] == instrument["keyword"]


@pytest.mark.asyncio
@pytest.mark.order(42)
async def test_add_method(gql_client, auth_data):
    add_gql = """
      mutation AddMethod($payload: MethodInputType!){
          createMethod(payload: $payload) {
            __typename
            ... on MethodType {
              uid
              name
              keyword
            }
            ... on OperationError {
              error
              suggestion
            }
          }
        }
    """
    method = {"name": "RT PCR", "keyword": "RTPCT", "instruments": [1]}
    response = await gql_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"payload": method}},
        headers=auth_data["headers"],
    )

    logger.info(f"add method response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["createMethod"]
    assert _data["uid"] == 1
    assert _data["name"] == method["name"]
    assert _data["keyword"] == method["keyword"]


@pytest.mark.asyncio
@pytest.mark.order(43)
async def test_add_analysis_service(gql_client, auth_data):
    add_gql = """
      mutation AddAnalysisService ($payload: AnalysisInputType!) {
        createAnalysis(payload: $payload){
          ... on AnalysisWithProfiles {
            __typename
            uid
            name
            keyword
            sortKey
            tatLengthMinutes
            precision
            requiredVerifications
            selfVerification
            description   
            categoryUid   
            departmentUid
            unitUid
            unit {
              uid
              name
            }
            sampleTypes {
              uid
              name
            }
            methods {
              uid
              name
            }
            resultOptions {
              uid
              optionKey
              value
            }
            category {
              uid
              name
            }
            profiles {
              uid
              name
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
    analysis_service = {
        "name": "HIV Viral Load",
        "description": "A test used to detect the peron's viral load",
        "keyword": "HVL",
        "sortKey": 1,
        "sampleTypes": [1],
        "methods": [1],
        "requiredVerifications": 1,
        "selfVerification": False,
    }
    response = await gql_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"payload": analysis_service}},
        headers=auth_data["headers"],
    )

    logger.info(f"add analysis service response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["createAnalysis"]
    assert _data["uid"] == 1
    assert _data["name"] == analysis_service["name"]
    assert _data["keyword"] == analysis_service["keyword"]
    assert _data["sortKey"] == analysis_service["sortKey"]
    assert _data["requiredVerifications"] == analysis_service["requiredVerifications"]
    assert _data["selfVerification"] is analysis_service["selfVerification"]
    assert _data["sampleTypes"][0]["uid"] in analysis_service["sampleTypes"]
    assert _data["methods"][0]["uid"] in analysis_service["methods"]


@pytest.mark.asyncio
@pytest.mark.order(44)
async def test_add_analysis_profile(gql_client, auth_data):
    add_gql = """
      mutation AddAnalysisProfile ($payload: ProfileInputType!) {
        createProfile(payload: $payload){
          ... on ProfileType {
            uid
            name
            description
            keyword
            active
            departmentUid
            sampleTypes {
              uid
              name
            }
            analyses {
              uid
              name
              keyword
              active
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
    analysis_profile = {
        "name": "HIV Viral Load",
        "description": "Lets detect a peron's viral load",
        "keyword": "HVL",
        "sampleTypes": [1],
        "services": [1],
        "active": True,
    }
    response = await gql_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"payload": analysis_profile}},
        headers=auth_data["headers"],
    )

    logger.info(f"add analysis profile response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["createProfile"]
    assert _data["uid"] == 1
    assert _data["name"] == analysis_profile["name"]
    assert _data["keyword"] == analysis_profile["keyword"]
    assert _data["active"] is True
    assert _data["sampleTypes"][0]["uid"] in analysis_profile["sampleTypes"]
    assert _data["analyses"][0]["uid"] in analysis_profile["services"]
