import logging

import pytest

from apps.worksheet.tasks import populate_worksheet_plate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
@pytest.mark.order(70)
async def test_add_worksheet_template(app, auth_data, sample_types, analyses, instruments):
    add_gql = """
        mutation AddWorkSheetTemplate($payload: WorksheetTemplateInputType!){
          createWorksheetTemplate(payload: $payload)
          {
            ... on WorkSheetTemplateType {
              __typename
              uid
              name
              reserved
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
        "sampleTypeUid": sample_types[0]["uid"],
        "analysisUid": analyses[0]["uid"],
        "numberOfSamples": 21,
        "worksheetType": "FLAT",
        "rows": 1,
        "cols": 1,
        "rowWise": False,
        "description": "Run Batch VL tests tat match this sample_workflow setup",
        "instrumentUid": instruments[0]["uid"],
        "reserved": [],
    }
    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"payload": ws_template}},
        headers=auth_data["headers"],
    )

    logger.info(f"add analysis request response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json["data"]["createWorksheetTemplate"]
    assert _data["uid"] is not None
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
async def test_add_worksheet_using_template(app, auth_data, users_db, ws_templates):
    add_gql = """
      mutation AddWorkSheet($analystUid:String!, $templateUid: String!, $count: Int){
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

    worksheet = {"analystUid": users_db[1]["uid"], "templateUid": ws_templates[0]["uid"], "count": 1}
    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {**worksheet}},
        headers=auth_data["headers"],
    )

    logger.info(f"add worksheet using template response: {response} {response.json}")

    assert response.status_code == 200
    _data = response.json["data"]["createWorksheet"]
    assert len(_data["worksheets"]) == 1
    worksheet = _data["worksheets"][0]
    assert worksheet["uid"] is not None
    assert worksheet["instrumentUid"] is not None
    assert worksheet["analysisUid"] is not None
    assert worksheet["state"] == "empty"

    _, job_response = await app.asgi_client.get("api/v1/jobs")
    logger.info(f"job response: {job_response} {job_response.json}")

    # process job for the next test
    await populate_worksheet_plate(job_response.json["data"][0]["uid"])


@pytest.mark.asyncio
@pytest.mark.order(72)
async def test_get_worksheet_by_uid(app, auth_data, worksheets):
    add_gql = """
      query getWorkSheetByUid($worksheetUid: String!) {
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

    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={"query": add_gql, "variables": {"worksheetUid": worksheets[0]["uid"]}},
        headers=auth_data["headers"],
    )

    logger.info(
        f"query worksheet using worksheet uid response: {response} {response.json}"
    )

    assert response.status_code == 200
    _data = response.json["data"]["worksheetByUid"]
    assert _data["uid"] == worksheets[0]["uid"]
    assert _data["worksheetId"] is not None
    assert _data["numberOfSamples"] == 21
    assert _data["assignedCount"] == 5
    assert _data["state"] == "pending"
    assert len(_data["analysisResults"]) == 5
    for _, result in enumerate(_data["analysisResults"]):
        assert result["uid"] is not None
        assert result["result"] is None
        assert result["sample"]["uid"] is not None
        assert result["sample"]["analysisRequest"]["uid"] is not None
