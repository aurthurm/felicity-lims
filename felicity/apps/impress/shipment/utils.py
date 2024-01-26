from felicity.apps.impress.shipment.engine import ManifetReport
from felicity.apps.shipment.schemas import ShipmentUpdate


async def gen_pdf_manifest(data, shipment):
    manifest_pdf = await ManifetReport().generate(data)
    update_in = ShipmentUpdate(
        **{
            "json_content": {"data": data},
            "pdf_content": manifest_pdf,
        }
    )
    await shipment.update(obj_in=update_in)
