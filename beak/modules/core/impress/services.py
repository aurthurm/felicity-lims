from beak.modules.core.abstract.service import BaseService
from beak.modules.core.impress.entities import ReportImpress
from beak.modules.core.impress.repository import ReportImpressRepository
from beak.modules.core.impress.sample.schemas import (
    ReportImpressCreate,
    ReportImpressUpdate,
)
from beak.core.config import get_settings

settings = get_settings()


class ReportImpressService(
    BaseService[ReportImpress, ReportImpressCreate, ReportImpressUpdate]
):
    def __init__(self):
        super().__init__(ReportImpressRepository())
