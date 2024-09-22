import io
import logging
from typing import BinaryIO

from minio import Minio
from minio.error import S3Error

from felicity.core.config import settings
from .enum import MinioBucket

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MinioClient:
    def __init__(self):
        self.client = Minio(
            endpoint=settings.MINIO_SERVER,
            access_key=settings.MINIO_ACCESS,
            secret_key=settings.MINIO_SECRET,
            secure=False,
        )

    def bucket_exists(self, bucket: MinioBucket):
        return self.client.bucket_exists(bucket)

    def make_bucket(self, bucket: MinioBucket):
        logger.info(f"minio -- add {bucket} bucket --")
        if not self.bucket_exists(bucket):
            self.client.make_bucket(bucket)

    def put_object(
        self,
        bucket: MinioBucket,
        object_name: str,
        data,
        metadata,
        content_type="application/pdf",
    ):
        logger.info(f"minio -- put {bucket} object --")
        self.make_bucket(bucket)

        if not isinstance(data, BinaryIO):
            data = io.BytesIO(data)

        try:
            return self.client.put_object(
                bucket_name=bucket,
                object_name=f"{object_name}.pdf",
                data=data,
                length=len(data.getvalue()),
                content_type=content_type,
                metadata=metadata,
            )
        except S3Error as e:
            raise Exception(f"Failed to upload file: {str(e)}")

    def get_object(self, bucket: MinioBucket, object_names: list[str]):
        logger.info(f"minio -- get {bucket} object --")
        objects = []
        try:
            for obj_name in object_names:
                obj = self.client.get_object(bucket, f"{obj_name}.pdf")
                objects.append(obj.read())
            return objects
        except S3Error as e:
            raise Exception(f"File not found: {str(e)}")
