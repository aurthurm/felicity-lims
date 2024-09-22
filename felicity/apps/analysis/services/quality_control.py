from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.qc import QCLevel, QCSet, QCTemplate
from felicity.apps.analysis.repository.quality_control import (
    QCLevelRepository,
    QCSetRepository,
    QCTemplateRepository,
)
from felicity.apps.analysis.schemas import (
    QCLevelCreate,
    QCLevelUpdate,
    QCSetCreate,
    QCSetUpdate,
    QCTemplateCreate,
    QCTemplateUpdate,
)


class QCSetService(BaseService[QCSet, QCSetCreate, QCSetUpdate]):
    def __init__(self):
        super().__init__(QCSetRepository)


class QCLevelService(BaseService[QCLevel, QCLevelCreate, QCLevelUpdate]):
    def __init__(self):
        super().__init__(QCLevelRepository)


class QCTemplateService(BaseService[QCTemplate, QCTemplateCreate, QCTemplateUpdate]):
    def __init__(self):
        super().__init__(QCTemplateRepository)
