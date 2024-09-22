import logging
from enum import StrEnum
from typing import Optional, Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

from felicity.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = AsyncIOMotorClient(
    f"mongodb://{settings.MONGODB_USER}:{settings.MONGODB_PASS}@{settings.MONGODB_SERVER}"
)


class MongoCollection(StrEnum):
    DIAGNOSTIC_REPORT = "diagnostic-report"
    INVOICE = "invoice"
    AUDIT_LOG = "audit-log"
    SHIPMENT = "shipment"


class MongoService:
    def __init__(self):
        self.db = client.felicity

    async def create(self, collection: MongoCollection, data: dict) -> Optional[dict]:
        logger.info(f"mongodb -- create:{collection} --")
        collection = self.db.get_collection(collection)
        created = await collection.insert_one(data)
        return await collection.find_one({"_id": created.inserted_id})

    async def upsert(
        self, collection: MongoCollection, uid: str, data: dict
    ) -> Optional[dict]:
        logger.info(f"mongodb -- upsert:{collection} --")
        collection = self.db.get_collection(collection)
        result = await collection.update_one(
            {"_id": self.oid(uid)}, {"$set": data}, upsert=True
        )
        return await collection.find_one({"_id": result.upserted_id})

    async def retrieve(self, collection: MongoCollection, uid: str):
        logger.info(f"mongodb -- retrieve:{collection} --")
        collection = self.db.get_collection(collection)
        item = await collection.find_one({"_id": self.oid(uid)})
        if item:
            item["_id"] = self.flake_id_from_hex(str(item["_id"]))
        return item

    async def search(
        self,
        collection: MongoCollection,
        filters: dict[str, Any],
        projection: dict[str, int] = None,
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        """
        Search documents in MongoDB based on user-defined filters.

        :param filters: A dictionary of filters to apply.
        :param projection: A dictionary specifying fields to include or exclude (1 to include, 0 to exclude).
        :param limit: Maximum number of documents to return.
        :return: A list of documents matching the filters.
        """
        logger.info(f"mongodb -- search:{collection} --")
        collection = self.db.get_collection(collection)
        cursor = collection.find(filters, projection).limit(limit)
        results = []
        async for document in cursor:
            results.append(document)
        return results

    async def update(
        self, collection: MongoCollection, uid: str, data: dict
    ) -> Optional[bool]:
        logger.info(f"mongodb -- update:{collection} --")
        collection = self.db.get_collection(collection)
        if len(data) < 1:
            return None
        item = await collection.find_one({"_id": self.oid(uid)})
        if item:
            updated = await collection.update_one(
                {"_id": self.oid(uid)}, {"$set": data}
            )
            return updated.matched_count > 0
        return False

    async def delete(self, collection: MongoCollection, uid: str) -> bool:
        logger.info(f"mongodb -- delete:{collection} --")
        collection = self.db.get_collection(collection)
        item = await collection.find_one({"_id": self.oid(uid)})
        if item:
            await collection.delete_one({"_id": self.oid(uid)})
            return True
        return False

    @staticmethod
    def oid(flake_id: str) -> ObjectId:
        return ObjectId(hex(int(flake_id))[2:].zfill(24))

    @staticmethod
    def flake_id_from_hex(hex_string: str) -> str:
        return str(int(hex_string, 16))
