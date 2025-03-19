from felicity.apps.impress.shipment.engine import ManifetReport
from felicity.apps.iol.minio import MinioClient
from felicity.apps.iol.minio.enum import MinioBucket
from felicity.apps.shipment.schemas import ShipmentUpdate
from felicity.apps.shipment.services import ShipmentService
from felicity.core.config import settings
from felicity.database.mongo import MongoService, MongoCollection


async def gen_pdf_manifest(data, shipment):
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
            content_type="application/pdf"
        )

        # Save the json to mongodb
    if settings.DOCUMENT_STORAGE:
        await MongoService().upsert(
            collection_name=MongoCollection.SHIPMENT, uid=shipment.uid, data={"data": data}
        )
