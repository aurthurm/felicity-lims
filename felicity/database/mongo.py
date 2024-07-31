from enum import StrEnum
from typing import Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://felicity:felicity@localhost:27027")


class MongoCollection(StrEnum):
    DIAGNOSTIC_REPORT = "diagnostic-report"
    INVOICE = "invoice"


class MongoService:
    def __init__(self):
        self.db = client.felicity

    async def create(self, collection: MongoCollection, data: dict) -> Optional[dict]:
        collection = self.db.get_collection(collection)
        created = await collection.insert_one(data)
        return await collection.find_one({"_id": created.inserted_id})

    async def upsert(self, collection: MongoCollection, uid: str, data: dict) -> Optional[dict]:
        collection = self.db.get_collection(collection)
        result = await collection.update_one({'_id': self.oid(uid)}, {'$set': data}, upsert=True)
        return await collection.find_one({"_id": result.upserted_id})

    async def retrieve(self, collection: MongoCollection, uid: str):
        collection = self.db.get_collection(collection)
        item = await collection.find_one({"_id": self.oid(uid)})
        item['_id'] = self.flake_id_from_hex(str(item['_id']))
        return item

    async def update(self, collection: MongoCollection, uid: str, data: dict) -> Optional[bool]:
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
