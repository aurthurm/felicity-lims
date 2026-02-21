"""Shared Mongo infrastructure exports."""

from beak.modules.shared.infrastructure.mongo.collections import MongoCollection
from beak.modules.shared.infrastructure.mongo.service import MongoService

__all__ = ["MongoCollection", "MongoService"]
