from beak.apps.abstract.service import BaseService
from beak.apps.impress.entities import ReportImpress
from beak.apps.impress.repository import ReportImpressRepository
from beak.apps.impress.sample.schemas import (
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
