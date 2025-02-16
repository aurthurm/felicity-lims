from felicity.apps.abstract.service import BaseService
from felicity.apps.multiplex.microbiology.entities import (
    AbxGuideline, AbxAntibioticGuideline, AbxAntibiotic,
    AbxKingdom, AbxPhylum, AbxClass, AbxOrder, AbxFamily, AbxGenus, AbxOrganism, AbxOrganismSerotype, AbxTestMethod,
    AbxBreakpointType, AbxHost, AbxSiteOfInfection, AbxBreakpoint, AbxExpResPhenotype,
    AbxExpertInterpretationRule, AbxMedium, AbxQCRange, AbxASTPanel
)
from felicity.apps.multiplex.microbiology.repository import (
    AbxGuidelineRepository, AbxAntibioticGuidelineRepository, AbxAntibioticRepository,
    AbxKingdomRepository, AbxPhylumRepository, AbxClassRepository, AbxOrderRepository,
    AbxFamilyRepository, AbxGenusRepository, AbxOrganismRepository, AbxOrganismSerotypeRepository,
    AbxTestMethodRepository, AbxBreakpointTypeRepository, AbxHostRepository, AbxSiteOfInfectionRepository,
    AbxBreakpointRepository, AbxExpResPhenotypeRepository,
    AbxExpertInterpretationRuleRepository, AbxMediumRepository, AbxQCRangeRepository, AbxASTPanelRepository
)

from felicity.apps.multiplex.microbiology.schemas import (
    AbxGuidelineCreate, AbxGuidelineUpdate,
    AbxAntibioticGuidelineCreate, AbxAntibioticGuidelineUpdate,
    AbxAntibioticCreate, AbxAntibioticUpdate,
    AbxKingdomCreate, AbxKingdomUpdate,
    AbxPhylumCreate, AbxPhylumUpdate,
    AbxClassCreate, AbxClassUpdate,
    AbxOrderCreate, AbxOrderUpdate,
    AbxFamilyCreate, AbxFamilyUpdate,
    AbxGenusCreate, AbxGenusUpdate,
    AbxOrganismCreate, AbxOrganismUpdate,
    AbxOrganismSerotypeCreate, AbxOrganismSerotypeUpdate,
    AbxTestMethodCreate, AbxTestMethodUpdate,
    AbxBreakpointTypeCreate, AbxBreakpointTypeUpdate,
    AbxHostCreate, AbxHostUpdate,
    AbxSiteOfInfectionCreate, AbxSiteOfInfectionUpdate,
    AbxBreakpointCreate, AbxBreakpointUpdate,
    AbxExpResPhenotypeCreate, AbxExpResPhenotypeUpdate,
    AbxExpertInterpretationRuleCreate, AbxExpertInterpretationRuleUpdate,
    AbxMediumCreate, AbxMediumUpdate,
    AbxQCRangeCreate, AbxQCRangeUpdate,
    AbxASTPanelCreate, AbxASTPanelUpdate,
)


class AbxGuidelineService(BaseService[AbxGuideline, AbxGuidelineCreate, AbxGuidelineUpdate]):
    def __init__(self):
        super().__init__(AbxGuidelineRepository())


class AbxAntibioticGuidelineService(
    BaseService[AbxAntibioticGuideline, AbxAntibioticGuidelineCreate, AbxAntibioticGuidelineUpdate]):
    def __init__(self):
        super().__init__(AbxAntibioticGuidelineRepository())


class AbxAntibioticService(BaseService[AbxAntibiotic, AbxAntibioticCreate, AbxAntibioticUpdate]):
    def __init__(self):
        super().__init__(AbxAntibioticRepository())


class AbxKingdomService(BaseService[AbxKingdom, AbxKingdomCreate, AbxKingdomUpdate]):
    def __init__(self):
        super().__init__(AbxKingdomRepository())


class AbxPhylumService(BaseService[AbxPhylum, AbxPhylumCreate, AbxPhylumUpdate]):
    def __init__(self):
        super().__init__(AbxPhylumRepository())


class AbxClassService(BaseService[AbxClass, AbxClassCreate, AbxClassUpdate]):
    def __init__(self):
        super().__init__(AbxClassRepository())


class AbxOrderService(BaseService[AbxOrder, AbxOrderCreate, AbxOrderUpdate]):
    def __init__(self):
        super().__init__(AbxOrderRepository())


class AbxFamilyService(BaseService[AbxFamily, AbxFamilyCreate, AbxFamilyUpdate]):
    def __init__(self):
        super().__init__(AbxFamilyRepository())


class AbxGenusService(BaseService[AbxGenus, AbxGenusCreate, AbxGenusUpdate]):
    def __init__(self):
        super().__init__(AbxGenusRepository())


class AbxOrganismService(BaseService[AbxOrganism, AbxOrganismCreate, AbxOrganismUpdate]):
    def __init__(self):
        super().__init__(AbxOrganismRepository())


class AbxOrganismSerotypeService(
    BaseService[AbxOrganismSerotype, AbxOrganismSerotypeCreate, AbxOrganismSerotypeUpdate]):
    def __init__(self):
        super().__init__(AbxOrganismSerotypeRepository())


class AbxTestMethodService(BaseService[AbxTestMethod, AbxTestMethodCreate, AbxTestMethodUpdate]):
    def __init__(self):
        super().__init__(AbxTestMethodRepository())


class AbxBreakpointTypeService(BaseService[AbxBreakpointType, AbxBreakpointTypeCreate, AbxBreakpointTypeUpdate]):
    def __init__(self):
        super().__init__(AbxBreakpointTypeRepository())


class AbxHostService(BaseService[AbxHost, AbxHostCreate, AbxHostUpdate]):
    def __init__(self):
        super().__init__(AbxHostRepository())


class AbxSiteOfInfectionService(BaseService[AbxSiteOfInfection, AbxSiteOfInfectionCreate, AbxSiteOfInfectionUpdate]):
    def __init__(self):
        super().__init__(AbxSiteOfInfectionRepository())


class AbxBreakpointService(BaseService[AbxBreakpoint, AbxBreakpointCreate, AbxBreakpointUpdate]):
    def __init__(self):
        super().__init__(AbxBreakpointRepository())


class AbxExpResPhenotypeService(BaseService[AbxExpResPhenotype, AbxExpResPhenotypeCreate, AbxExpResPhenotypeUpdate]):
    def __init__(self):
        super().__init__(AbxExpResPhenotypeRepository())


class AbxExpertInterpretationRuleService(
    BaseService[AbxExpertInterpretationRule, AbxExpertInterpretationRuleCreate, AbxExpertInterpretationRuleUpdate]):
    def __init__(self):
        super().__init__(AbxExpertInterpretationRuleRepository())


class AbxMediumService(BaseService[AbxMedium, AbxMediumCreate, AbxMediumUpdate]):
    def __init__(self):
        super().__init__(AbxMediumRepository())


class AbxQCRangeService(BaseService[AbxQCRange, AbxQCRangeCreate, AbxQCRangeUpdate]):
    def __init__(self):
        super().__init__(AbxQCRangeRepository())


class AbxASTPanelService(BaseService[AbxASTPanel, AbxASTPanelCreate, AbxASTPanelUpdate]):
    def __init__(self):
        super().__init__(AbxASTPanelRepository())
