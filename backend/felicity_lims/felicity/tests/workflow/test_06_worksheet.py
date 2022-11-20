import pytest
import logging

from felicity.apps.worksheet.tasks import populate_worksheet_plate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(70)
async def test_add_worksheet_template(gql_client, auth_data):
    add_gql = """
        mutation AddWorkSheetTemplate($payload: WorksheetTemplateInputType!){
          createWorksheetTemplate(payload: $payload)
          {
            ... on WorkSheetTemplateType {
              __typename
              uid
              name
              reserved
              plate
              numberOfSamples
              rows
              cols
              rowWise
              worksheetType
              instrumentUid
              instrument {
                uid
                name
              }
              sampleTypeUid
              sampleType {
                uid
                name
              }
              description
              qcTemplate {
                uid
                name
                description
                qcLevels {
                  uid
                  level
                }
              }
              qcLevels {
                uid
                level
              }
              analysisUid
              analysis {
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

    ws_template = {
        "name": "Roche Viral Load",
        "sampleTypeUid": 1,
        "analysisUid": 1,
        "numberOfSamples": 21,
        "worksheetType": "FLAT",
        "rows": 1,
        "cols": 1,
        "rowWise": False,
        "description": "Run Batch VL tests tat match this workflow setup",
        "instrumentUid": 1,
        "reserved": []
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_gql,
        "variables": {
            "payload": ws_template
        }
    }, headers=auth_data['headers'])

    logger.info(f"add analysis request response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["createWorksheetTemplate"]
    assert _data["uid"] == 1
    assert _data["name"] == ws_template["name"]
    assert _data["sampleTypeUid"] == ws_template["sampleTypeUid"]
    assert _data["name"] == ws_template["name"]
    assert _data["sampleTypeUid"] == ws_template["sampleTypeUid"]
    assert _data["numberOfSamples"] == ws_template["numberOfSamples"]
    assert _data["rows"] == ws_template["rows"]
    assert _data["cols"] == ws_template["cols"]
    assert _data["rowWise"] == ws_template["rowWise"]
    assert _data["worksheetType"] == ws_template["worksheetType"]


@pytest.mark.asyncio
@pytest.mark.order(71)
async def test_add_worksheet_using_template(gql_client, auth_data):
    add_gql = """
      mutation AddWorkSheet($analystUid:Int!, $templateUid: Int!, $count: Int){
        createWorksheet(analystUid: $analystUid, templateUid: $templateUid, count:$count)
        {
          ... on WorksheetListingType {
            __typename
            worksheets {
              uid
              worksheetId
              numberOfSamples
              assignedCount
              analyst {
                uid
                auth{
                  uid
                  userName
                }
                firstName
                lastName
              }
              instrumentUid
              instrument {
                uid
                name
              }
              analysisUid
              analysis {
                uid
                name
              }
              state
              createdAt
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

    worksheet = {
        "analystUid": 2,
        "templateUid": 1,
        "count": 1
    }
    response = await gql_client.post('/felicity-gql', json={
        "query": add_gql,
        "variables": {
            **worksheet
        }
    }, headers=auth_data['headers'])

    logger.info(f"add worksheet using template response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["createWorksheet"]
    assert len(_data["worksheets"]) == 1
    worksheet = _data["worksheets"][0]
    assert worksheet["uid"] == 1
    assert worksheet["instrumentUid"] == 1
    assert worksheet["analysisUid"] == 1
    assert worksheet["state"] == "empty"

    # process job for the next test
    await populate_worksheet_plate(1)


@pytest.mark.asyncio
@pytest.mark.order(72)
async def test_get_worksheet_by_uid(gql_client, auth_data):
    add_gql = """
      query getWorkSheetByUid($worksheetUid: Int!) {
        worksheetByUid(worksheetUid: $worksheetUid) {
          uid
          worksheetId
          numberOfSamples
          assignedCount
          reserved
          state
          createdAt
          analyst {
            uid
            auth{
              uid
              userName
            }
            firstName
            lastName
          }
          sampleType {
            name
            name
          }
          instrument {
            uid
            name
          }
          template {
            uid
            name
          }
          analysis {
            uid
            name
          }
          plate
          analysisResults {
            uid
            result
            status
            worksheetPosition
            retest 
            reportable
            method {
              uid
              name
            }
            instrument {
              uid
              name
            }
            analysis {
              uid
              name
              unitUid
              unit {
                uid
                name
              }
              resultOptions {
                uid
                optionKey
                value
              }
            }
            sample {
              uid
              sampleId
              priority
              analysisRequest {
                uid
                client {
                  uid
                  name
                }
                patient {
                  uid
                  firstName
                  lastName
                  clientPatientId
                  patientId
                }
              }
              qcLevel {
                uid
                level
              }
            }
          }
        }
      }
    """

    response = await gql_client.post('/felicity-gql', json={
        "query": add_gql,
        "variables": {
            "worksheetUid": 1
        }
    }, headers=auth_data['headers'])

    logger.info(f"query worksheet using worksheet uid response: {response} {response.json()}")

    assert response.status_code == 200
    _data = response.json()["data"]["worksheetByUid"]
    assert _data["uid"] == 1
    assert _data["worksheetId"] == "WS22-00006"
    assert _data["numberOfSamples"] == 21
    assert _data["assignedCount"] == 5
    assert _data["state"] == "pending"
    assert len(_data["analysisResults"]) == 5
    for _, result in enumerate(_data["analysisResults"]):
        assert result["uid"] is not None
        assert result["result"] is None
        assert result["sample"]["uid"]is not None
        assert result["sample"]["analysisRequest"]["uid"] == 1
