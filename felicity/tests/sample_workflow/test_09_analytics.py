# import io
# import logging
# from datetime import datetime, timedelta
#
# import pandas as pd
# import pytest
# from apps.analytics.tasks import generate_report
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(100)
# async def test_generate_report(app, auth_data):
#     time_now = datetime.now()
#     period_start = (time_now - timedelta(minutes=5)).isoformat()
#     period_end = time_now.isoformat()
#     _, response = await app.asgi_client.post(
#         "/reports/",
#         json={
#             "report_type": "line_listing",
#             "analyses_uids": [1],
#             "sample_states": ["published"],
#             "date_column": "date_published",
#             "period_start": period_start,
#             "period_end": period_end,
#         },
#         headers=auth_data["headers"],
#     )
#
#     logger.info(f"generate report response: {response} {response.json}")
#     assert response.status_code == 200
#     _data = response.json
#     assert _data["period_start"] == period_start
#     assert _data["period_end"] == period_end
#     assert _data["date_column"] == "date_published"
#     assert _data["sample_states"] == "published"
#     assert _data["status"] == "PENDING"
#     assert _data["analyses"][0]["uid"] is not None
#
#     # prepare for next test
#     await generate_report(7)
#
#
# @pytest.mark.asyncio
# @pytest.mark.order(101)
# async def test_fetch_reports(app, client_root, auth_data):
#     _, response = await app.asgi_client.get("/reports/", headers=auth_data["headers"])
#
#     logger.info(f"generate report response: {response} {response.json}")
#     assert response.status_code == 200
#     _data = response.json
#     assert len(_data) == 1
#     _report = _data[0]
#     assert _report["status"] == "READY"
#     assert _report["location"].endswith(".csv") == True
#
#     d_data = await client_root.get(f"/{_report['location']}")
#     assert d_data.status_code == 200
#     data = pd.read_csv(io.StringIO(d_data.content.decode("utf-8")), header=0)
#     assert data.shape[0] == 6  # include header row
