from felicity.apps.abstract.service import BaseService
from felicity.apps.impress.entities import ReportImpress
from felicity.apps.impress.repository import ReportImpressRepository
from felicity.apps.impress.sample.schemas import (
    ReportImpressCreate,
    ReportImpressUpdate,
)
from felicity.core.config import get_settings

settings = get_settings()


class ReportImpressService(
    BaseService[ReportImpress, ReportImpressCreate, ReportImpressUpdate]
):
    def __init__(self):
        super().__init__(ReportImpressRepository())
