from beak.modules.core.impress.barcode.engine import BeakBarCoder
from beak.modules.core.impress.barcode.schema import BarCode


async def impress_barcodes(bar_codes: list[BarCode]):
    return await BeakBarCoder().generate(bar_codes)
