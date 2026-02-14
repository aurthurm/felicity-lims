from pydantic import BaseModel


class BarCodeMeta(BaseModel):
    label: str
    value: str


class BarCode(BaseModel):
    barcode: str
    metadata: list[BarCodeMeta]
