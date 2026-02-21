"""Tenant/lab aware task processing locks backed by Redis."""

from __future__ import annotations

import json

from beak.core.config import settings
from beak.modules.core.common.channel import broadcast
from beak.modules.core.notification.enum import NotificationChannel
from beak.modules.shared.infrastructure.redis.client import create_redis_client
from beak.modules.shared.infrastructure.redis.keys import processing_key
from beak.modules.shared.infrastructure.scope import TenantStorageScope, resolve_storage_scope


class TaskGuard:
    """Track processing state for background operations."""

    def __init__(self):
        self._store: dict[str, dict[str, str]] = {}

    @property
    def _has_redis(self):
        return bool(settings.REDIS_SERVER)

    @staticmethod
    async def connect():
        return await create_redis_client()

    async def process(
        self,
        uid: str,
        object_type: str,
        scope: TenantStorageScope | None = None,
    ):
        resolved_scope = scope or resolve_storage_scope()
        key = processing_key(uid=uid, object_type=object_type, scope=resolved_scope)

        if self._has_redis:
            redis = await self.connect()
            await redis.hset(key, "status", "processing")
        else:
            self._store[key] = {"status": "processing"}

        await broadcast.publish(
            NotificationChannel.PROCESSING,
            json.dumps(
                {
                    "uid": uid,
                    "object_type": object_type,
                    "status": "processing",
                    "tenant_slug": resolved_scope.tenant_slug,
                    "laboratory_uid": resolved_scope.laboratory_uid,
                }
            ),
        )

    async def release(
        self,
        uid: str,
        object_type: str,
        scope: TenantStorageScope | None = None,
    ):
        resolved_scope = scope or resolve_storage_scope()
        key = processing_key(uid=uid, object_type=object_type, scope=resolved_scope)

        if self._has_redis:
            redis = await self.connect()
            await redis.delete(key)
        else:
            self._store.pop(key, None)

        await broadcast.publish(
            NotificationChannel.PROCESSING,
            json.dumps(
                {
                    "uid": uid,
                    "object_type": object_type,
                    "status": "released",
                    "tenant_slug": resolved_scope.tenant_slug,
                    "laboratory_uid": resolved_scope.laboratory_uid,
                }
            ),
        )

    async def is_processing(
        self,
        uid: str,
        object_type: str,
        scope: TenantStorageScope | None = None,
    ):
        resolved_scope = scope or resolve_storage_scope()
        key = processing_key(uid=uid, object_type=object_type, scope=resolved_scope)

        if self._has_redis:
            redis = await self.connect()
            exists = await redis.exists(key)
        else:
            exists = key in self._store

        await broadcast.publish(
            NotificationChannel.PROCESSING,
            json.dumps(
                {
                    "uid": uid,
                    "object_type": object_type,
                    "status": "processing",
                    "tenant_slug": resolved_scope.tenant_slug,
                    "laboratory_uid": resolved_scope.laboratory_uid,
                }
            ),
        )
        return exists


task_guard = TaskGuard()
