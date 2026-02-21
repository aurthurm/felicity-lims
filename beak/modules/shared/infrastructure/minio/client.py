"""Shared MinIO client with optional tenant/laboratory scoping."""

from __future__ import annotations

import io
import logging
from typing import BinaryIO

from minio import Minio
from minio.error import S3Error

from beak.core.config import settings
from beak.modules.shared.infrastructure.minio.buckets import MinioBucket
from beak.modules.shared.infrastructure.minio.paths import build_scoped_object_name
from beak.modules.shared.infrastructure.scope import TenantStorageScope

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MinioClient:
    def __init__(self) -> None:
        self.client = Minio(
            endpoint=settings.MINIO_SERVER,
            access_key=settings.MINIO_ACCESS,
            secret_key=settings.MINIO_SECRET,
            secure=False,
        )

    def bucket_exists(self, bucket: MinioBucket) -> bool:
        return self.client.bucket_exists(bucket)

    def make_bucket(self, bucket: MinioBucket) -> None:
        logger.info("minio -- add %s bucket --", bucket)
        if not self.bucket_exists(bucket):
            self.client.make_bucket(bucket)

    def put_object(
        self,
        bucket: MinioBucket,
        object_name: str,
        data: BinaryIO | bytes,
        metadata: dict,
        content_type: str = "application/pdf",
        scope: TenantStorageScope | None = None,
        domain: str | None = None,
    ):
        logger.info("minio -- put %s object --", bucket)
        self.make_bucket(bucket)

        if not isinstance(data, BinaryIO):
            data = io.BytesIO(data)

        scoped_object_name = build_scoped_object_name(
            object_name,
            scope=scope,
            domain=domain,
        )

        try:
            return self.client.put_object(
                bucket_name=bucket,
                object_name=scoped_object_name,
                data=data,
                length=len(data.getvalue()),
                content_type=content_type,
                metadata=metadata,
            )
        except S3Error as exc:
            raise Exception(f"Failed to upload file: {str(exc)}")

    def get_object(
        self,
        bucket: MinioBucket,
        object_names: list[str],
        *,
        scope: TenantStorageScope | None = None,
        domain: str | None = None,
    ) -> list[bytes]:
        logger.info("minio -- get %s object --", bucket)
        objects: list[bytes] = []
        try:
            for obj_name in object_names:
                scoped_object_name = build_scoped_object_name(
                    obj_name,
                    scope=scope,
                    domain=domain,
                )
                obj = self.client.get_object(bucket, scoped_object_name)
                objects.append(obj.read())
            return objects
        except S3Error as exc:
            raise Exception(f"File not found: {str(exc)}")

    def remove_object(
        self,
        bucket: MinioBucket,
        object_name: str,
        *,
        scope: TenantStorageScope | None = None,
        domain: str | None = None,
    ) -> None:
        logger.info("minio -- removing %s object --", bucket)
        scoped_object_name = build_scoped_object_name(
            object_name,
            scope=scope,
            domain=domain,
        )
        try:
            self.client.remove_object(bucket, scoped_object_name)
        except S3Error as exc:
            raise Exception(f"Failed to remove file: {str(exc)}")
