import logging

import pytest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

STOCK_ITEM_UID: str | None = None

add_stock_item_query = """
  mutation AddStockItem($payload: StockItemInputType!){
  createStockItem(payload: $payload) {
    ... on StockItemType {
        uid
        name
        description
    }
    ... on OperationError {
        error
    }
  }
}
"""

update_stock_item_query = """
  mutation EditStockItem($uid: String!, $payload: StockItemInputType!){
  updateStockItem(uid: $uid, payload: $payload) {
    ... on StockItemType {
        uid
        name
        description
    }
    ... on OperationError {
        error
    }
  }
}
"""

stock_item_all_query = """
  query StockItemAll($text: String){
    stockItemAll(text: $text) {
      items {
        uid
        name
        description
      }
    }
  }
"""


@pytest.mark.asyncio
@pytest.mark.order(300)
async def test_add_stock_item(app_gql, auth_data):
    stock_item = {
        "name": "Cuvete",
        "description": "Chemistry testing cuvette for BS500",
    }
    response = await app_gql.post(
        "/beak-gql",
        json={"query": add_stock_item_query, "variables": {"payload": stock_item}},
        headers=auth_data["headers"],
    )

    logger.info(f"register stock item response: {response} {response.json()}")

    assert response.status_code == 200
    _st = response.json()["data"]["createStockItem"]
    global STOCK_ITEM_UID
    if "uid" not in _st:
        lookup = await app_gql.post(
            "/beak-gql",
            json={
                "query": stock_item_all_query,
                "variables": {"text": stock_item["name"]},
            },
            headers=auth_data["headers"],
        )
        items = lookup.json()["data"]["stockItemAll"]["items"] or []
        existing = next(
            (item for item in items if item["name"] == stock_item["name"]), None
        )
        assert existing is not None
        STOCK_ITEM_UID = existing["uid"]
    else:
        STOCK_ITEM_UID = _st["uid"]
        assert _st["name"] == stock_item["name"]
        assert _st["description"] == stock_item["description"]


@pytest.mark.asyncio
@pytest.mark.order(301)
async def test_update_stock_item(app_gql, auth_data):
    stock_item = {
        "name": "Cuvette",
        "description": "Chemistry testing cuvette for Mindray BS500",
    }
    response = await app_gql.post(
        "/beak-gql",
        json={
            "query": update_stock_item_query,
            "variables": {"uid": STOCK_ITEM_UID, "payload": stock_item},
        },
        headers=auth_data["headers"],
    )

    logger.info(f"register store room response: {response} {response.json()}")

    assert response.status_code == 200
    assert STOCK_ITEM_UID is not None
    _st = response.json()["data"]["updateStockItem"]
    assert _st["uid"] is not None
    assert _st["name"] == stock_item["name"]
    assert _st["description"] == stock_item["description"]
