from beak.modules.core.impress.shipment.engine import ManifetReport
from beak.modules.shared.infrastructure.minio import MinioClient
from beak.modules.shared.infrastructure.minio.buckets import MinioBucket
from beak.modules.shared.infrastructure import resolve_storage_scope
from beak.modules.core.shipment.schemas import ShipmentUpdate
from beak.modules.core.shipment.services import ShipmentService
from beak.core.config import settings
from beak.modules.shared.infrastructure.mongo import MongoService, MongoCollection


async def gen_pdf_manifest(data, shipment):
    scope = resolve_storage_scope(laboratory_uid=shipment.laboratory_uid, require_tenant=True, require_lab=True)
    manifest_pdf = await ManifetReport().generate(data)
    sm_in = {
        "json_content": {"data": data},
        "pdf_content": manifest_pdf,
    }

    if settings.OBJECT_STORAGE:
        sm_in["pdf_content"] = manifest_pdf
    if settings.DOCUMENT_STORAGE:
        sm_in["json_content"] = {"data": data}

    if sm_in:
        update_in = ShipmentUpdate(**sm_in)
        await ShipmentService().update(shipment.uid, update=update_in)

    if settings.OBJECT_STORAGE:
        MinioClient().put_object(
            bucket=MinioBucket.SHIPMENT,
            object_name=f"{shipment.shipment_id}.pdf",
            data=manifest_pdf,
            metadata={
                "shipment_uid": shipment.uid,
            },
            content_type="application/pdf",
            scope=scope,
            domain="shipment",
        )

        # Save the json to mongodb
    if settings.DOCUMENT_STORAGE:
        await MongoService().upsert(
            collection_name=MongoCollection.SHIPMENT,
            uid=shipment.uid,
            data={"data": data},
            scope=scope,
        )
