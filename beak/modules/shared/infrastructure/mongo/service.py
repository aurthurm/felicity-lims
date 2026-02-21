"""Shared MongoDB service with optional tenant/laboratory scoping."""

from __future__ import annotations

import logging
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

from beak.core.config import settings
from beak.modules.shared.infrastructure.scope import TenantStorageScope

from .collections import MongoCollection

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client: AsyncIOMotorClient = AsyncIOMotorClient(
    f"mongodb://{settings.MONGODB_USER}:{settings.MONGODB_PASS}@{settings.MONGODB_SERVER}"
)


class MongoService:
    def __init__(self) -> None:
        self.db = client.beak_lims

    @staticmethod
    def _with_scope(data: dict[str, Any], scope: TenantStorageScope | None) -> dict[str, Any]:
        if not scope:
            return data
        return {**data, **scope.as_filters()}

    @staticmethod
    def _scope_filters(scope: TenantStorageScope | None) -> dict[str, str]:
        return scope.as_filters() if scope else {}

    async def create(
        self,
        collection_name: MongoCollection,
        data: dict,
        *,
        scope: TenantStorageScope | None = None,
    ) -> dict | None:
        logger.info("mongodb -- create:%s --", collection_name)
        collection = self.db.get_collection(collection_name)
        payload = self._with_scope(data, scope)
        created = await collection.insert_one(payload)
        return await collection.find_one({"_id": created.inserted_id})

    async def upsert(
        self,
        collection_name: MongoCollection,
        uid: str,
        data: dict,
        *,
        scope: TenantStorageScope | None = None,
    ) -> dict | None:
        logger.info("mongodb -- upsert:%s --", collection_name)
        collection = self.db.get_collection(collection_name)
        filters = {"_id": self.oid(uid), **self._scope_filters(scope)}
        payload = self._with_scope(data, scope)
        await collection.update_one(filters, {"$set": payload}, upsert=True)
        return await collection.find_one(filters)

    async def retrieve(
        self,
        collection_name: MongoCollection,
        uid: str,
        *,
        scope: TenantStorageScope | None = None,
    ) -> dict | None:
        logger.info("mongodb -- retrieve:%s --", collection_name)
        collection = self.db.get_collection(collection_name)
        filters = {"_id": self.oid(uid), **self._scope_filters(scope)}
        item = await collection.find_one(filters)
        if item:
            item["_id"] = self.flake_id_from_hex(str(item["_id"]))
        return item

    async def search(
        self,
        collection_name: MongoCollection,
        filters: dict[str, Any],
        *,
        projection: dict[str, int] | None = None,
        limit: int = 100,
        scope: TenantStorageScope | None = None,
    ) -> list[dict[str, Any]]:
        logger.info("mongodb -- search:%s --", collection_name)
        collection = self.db.get_collection(collection_name)
        merged_filters = {**self._scope_filters(scope), **filters}
        cursor = collection.find(merged_filters, projection).limit(limit)
        results: list[dict[str, Any]] = []
        async for document in cursor:
            results.append(document)
        return results

    async def update(
        self,
        collection_name: MongoCollection,
        uid: str,
        data: dict,
        *,
        scope: TenantStorageScope | None = None,
    ) -> bool | None:
        logger.info("mongodb -- update:%s --", collection_name)
        collection = self.db.get_collection(collection_name)
        if len(data) < 1:
            return None
        filters = {"_id": self.oid(uid), **self._scope_filters(scope)}
        item = await collection.find_one(filters)
        if item:
            payload = self._with_scope(data, scope)
            updated = await collection.update_one(filters, {"$set": payload})
            return updated.matched_count > 0
        return False

    async def delete(
        self,
        collection_name: MongoCollection,
        uid: str,
        *,
        scope: TenantStorageScope | None = None,
    ) -> bool:
        logger.info("mongodb -- delete:%s --", collection_name)
        collection = self.db.get_collection(collection_name)
        filters = {"_id": self.oid(uid), **self._scope_filters(scope)}
        item = await collection.find_one(filters)
        if item:
            await collection.delete_one(filters)
            return True
        return False

    @staticmethod
    def oid(flake_id: str) -> ObjectId:
        return ObjectId(hex(int(flake_id))[2:].zfill(24))

    @staticmethod
    def flake_id_from_hex(hex_string: str) -> str:
        return str(int(hex_string, 16))
