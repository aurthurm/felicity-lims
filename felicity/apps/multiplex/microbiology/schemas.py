from dataclasses import field
from typing import List, Optional

from pydantic import ConfigDict, field_validator

from felicity.apps.common.schemas import BaseAuditModel


#
# AbxGuideline Schemas
#
class AbxGuidelineBase(BaseAuditModel):
    name: str
    code: str | None = None
    description: str | None = None


class AbxGuideline(AbxGuidelineBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxGuidelineCreate(AbxGuideline):
    pass


class AbxGuidelineUpdate(AbxGuidelineBase):
    pass


#
# AbxAntibioticGuideline Schemas
#
class AbxAntibioticGuidelineBase(BaseAuditModel):
    antibiotic_uid: str
    guideline_uid: str


class AbxAntibioticGuideline(AbxAntibioticGuidelineBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxAntibioticGuidelineCreate(AbxAntibioticGuideline):
    pass


class AbxAntibioticGuidelineUpdate(AbxAntibioticGuidelineBase):
    pass


#
# AbxAntibiotic Schemas
#
class AbxAntibioticBase(BaseAuditModel):
    name: str
    whonet_abx_code: str | None = None
    who_code: str | None = None
    din_code: str | None = None
    jac_code: str | None = None
    eucast_code: str | None = None
    user_code: str | None = None
    abx_number: str | None = None
    potency: str | None = None
    atc_code: str | None = None
    class_: str | None = None
    subclass: str | None = None
    prof_class: str | None = None
    cia_category: str | None = None
    clsi_order: str | None = None
    eucast_order: str | None = None
    human: bool | None = None
    veterinary: bool | None = None
    animal_gp: str | None = None
    loinccomp: str | None = None
    loincgen: str | None = None
    loincdisk: str | None = None
    loincmic: str | None = None
    loincetest: str | None = None
    loincslow: str | None = None
    loincafb: str | None = None
    loincsbt: str | None = None
    loincmlc: str | None = None
    comments: str | None = None

    @field_validator("abx_number", mode="before")
    @classmethod
    def convert_to_str(cls, value):
        return str(value) if isinstance(value, (int, float)) else value


class AbxAntibiotic(AbxAntibioticBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxAntibioticCreate(AbxAntibiotic):
    pass


class AbxAntibioticUpdate(AbxAntibioticBase):
    pass


#
# AbxKingdom Schemas
#
class AbxKingdomBase(BaseAuditModel):
    name: str


class AbxKingdom(AbxKingdomBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxKingdomCreate(AbxKingdom):
    pass


class AbxKingdomUpdate(AbxKingdomBase):
    pass


#
# AbxPhylum Schemas
#
class AbxPhylumBase(BaseAuditModel):
    name: str
    kingdom_uid: str | None = None
    kingdom: AbxKingdom | None = None


class AbxPhylum(AbxPhylumBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxPhylumCreate(AbxPhylum):
    pass


class AbxPhylumUpdate(AbxPhylumBase):
    pass


#
# AbxClass Schemas
#
class AbxClassBase(BaseAuditModel):
    name: str
    phylum_uid: str | None = None
    phylum: AbxPhylum | None = None


class AbxClass(AbxClassBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxClassCreate(AbxClass):
    pass


class AbxClassUpdate(AbxClassBase):
    pass


#
# AbxOrder Schemas
#
class AbxOrderBase(BaseAuditModel):
    name: str
    class_uid: str | None = None
    class_: AbxClass | None = None


class AbxOrder(AbxOrderBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxOrderCreate(AbxOrder):
    pass


class AbxOrderUpdate(AbxOrderBase):
    pass


#
# AbxFamily Schemas
#
class AbxFamilyBase(BaseAuditModel):
    name: str
    order_uid: str | None = None
    order: AbxOrder | None = None


class AbxFamily(AbxFamilyBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxFamilyCreate(AbxFamily):
    pass


class AbxFamilyUpdate(AbxFamilyBase):
    pass


#
# AbxGenus Schemas
#
class AbxGenusBase(BaseAuditModel):
    name: str
    family_uid: str | None = None
    family: AbxFamily | None = None


class AbxGenus(AbxGenusBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxGenusCreate(AbxGenus):
    pass


class AbxGenusUpdate(AbxGenusBase):
    pass


#
# AbxOrganism Schemas
#
class AbxOrganismBase(BaseAuditModel):
    name: str
    whonet_org_code: str | None = None
    replaced_by: str | None = None
    taxonomic_status: str | None = None
    common: str | None = None
    organism_type: str | None = None
    anaerobe: bool | None = None
    morphology: str | None = None
    subkingdom_code: str | None = None
    family_code: str | None = None
    genus_group: str | None = None
    genus_code: str | None = None
    species_group: str | None = None
    serovar_group: str | None = None
    msf_grp_clin: str | None = None
    sct_code: str | None = None
    sct_text: str | None = None
    gbif_taxon_id: str | None = None
    gbif_dataset_id: str | None = None
    gbif_taxonomic_status: str | None = None
    # Foreign keys to taxonomic tables
    kingdom_uid: str | None = None
    phylum_uid: str | None = None
    class_uid: str | None = None
    order_uid: str | None = None
    family_uid: str | None = None
    genus_uid: str | None = None
    comments: str | None = None

    @field_validator("sct_code", mode="before")
    @classmethod
    def convert_to_str(cls, value):
        return str(value) if isinstance(value, (int, float)) else value


class AbxOrganism(AbxOrganismBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxOrganismCreate(AbxOrganism):
    pass


class AbxOrganismUpdate(AbxOrganismBase):
    pass


#
# AbxOrganismSerotype Schemas
#
class AbxOrganismSerotypeBase(BaseAuditModel):
    organism_uid: str
    serotype: str
    serogroup: str | None = None
    subspecies: str | None = None
    o_antigens: str | None = None
    h_phase_1: str | None = None
    h_phase_2: str | None = None
    x997_check: str | None = None
    fate: str | None = None


class AbxOrganismSerotype(AbxOrganismSerotypeBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxOrganismSerotypeCreate(AbxOrganismSerotype):
    pass


class AbxOrganismSerotypeUpdate(AbxOrganismSerotypeBase):
    pass


#
# AbxTestMethod Schemas
#
class AbxTestMethodBase(BaseAuditModel):
    name: str
    description: str | None = None


class AbxTestMethod(AbxTestMethodBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxTestMethodCreate(AbxTestMethod):
    pass


class AbxTestMethodUpdate(AbxTestMethodBase):
    pass


#
# AbxBreakpointType Schemas
#
class AbxBreakpointTypeBase(BaseAuditModel):
    name: str
    description: str | None = None


class AbxBreakpointType(AbxBreakpointTypeBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxBreakpointTypeCreate(AbxBreakpointType):
    pass


class AbxBreakpointTypeUpdate(AbxBreakpointTypeBase):
    pass


#
# AbxHost Schemas
#
class AbxHostBase(BaseAuditModel):
    name: str
    description: str | None = None


class AbxHost(AbxHostBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxHostCreate(AbxHost):
    pass


class AbxHostUpdate(AbxHostBase):
    pass


#
# AbxSiteOfInfection Schemas
#
class AbxSiteOfInfectionBase(BaseAuditModel):
    name: str
    description: str | None = None


class AbxSiteOfInfection(AbxSiteOfInfectionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxSiteOfInfectionCreate(AbxSiteOfInfection):
    pass


class AbxSiteOfInfectionUpdate(AbxSiteOfInfectionBase):
    pass


#
# AbxBreakpoint Schemas
#
class AbxBreakpointBase(BaseAuditModel):
    guideline_uid: str
    year: int | None = None
    test_method_uid: str
    potency: str | None = None
    organism_code: str
    organism_code_type: str
    breakpoint_type_uid: str
    host_uid: str | None = None
    site_of_infection_uid: str | None = None
    reference_table: str | None = None
    reference_sequence: str | None = None
    whonet_abx_code: str | None = None
    comments: str | None = None
    r: str | None = None
    i: str | None = None
    sdd: str | None = None
    s: str | None = None
    ecv_ecoff: str | None = None
    ecv_ecoff_tentative: str | None = None

    @field_validator(
        "reference_sequence", "r", "i", "s", "sdd", "ecv_ecoff", "ecv_ecoff_tentative",
        mode="before"
    )
    @classmethod
    def convert_to_str(cls, value):
        return str(value) if isinstance(value, (int, float)) else value


class AbxBreakpoint(AbxBreakpointBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxBreakpointCreate(AbxBreakpoint):
    pass


class AbxBreakpointUpdate(AbxBreakpointBase):
    pass


#
# AbxExpResPhenotype Schemas
#
class AbxExpResPhenotypeBase(BaseAuditModel):
    guideline_uid: str
    reference_table: str
    organism_code: str
    organism_code_type: str
    exception_organism_code: str
    exception_organism_code_type: str
    abx_code: str
    abx_code_type: str
    antibiotic_exceptions: str
    comments: str | None = None


class AbxExpResPhenotype(AbxExpResPhenotypeBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxExpResPhenotypeCreate(AbxExpResPhenotype):
    pass


class AbxExpResPhenotypeUpdate(AbxExpResPhenotypeBase):
    pass


#
# AbxExpertInterpretationRule Schemas
#
class AbxExpertInterpretationRuleBase(BaseAuditModel):
    rule_code: str
    description: str | None = None
    organism_code: str
    organism_code_type: str
    rule_criteria: str
    affected_antibiotics: str
    antibiotic_exceptions: str


class AbxExpertInterpretationRule(AbxExpertInterpretationRuleBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxExpertInterpretationRuleCreate(AbxExpertInterpretationRule):
    pass


class AbxExpertInterpretationRuleUpdate(AbxExpertInterpretationRuleBase):
    pass


#
# AbxMedium Schemas
#
class AbxMediumBase(BaseAuditModel):
    name: str
    description: str | None = None


class AbxMedium(AbxMediumBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxMediumCreate(AbxMedium):
    pass


class AbxMediumUpdate(AbxMediumBase):
    pass


#
# AbxQCRange Schemas
#
class AbxQCRangeBase(BaseAuditModel):
    guideline_uid: str
    year: int
    strain: str
    reference_table: str
    whonet_org_code: str
    antibiotic: str
    abx_test: str
    whonet_abx_code: str
    method: str
    medium_uid: str | None = None
    minimum: str | None = None
    maximum: str | None = None

    @field_validator("minimum", "maximum", mode="before")
    @classmethod
    def convert_to_str(cls, value):
        return str(value) if isinstance(value, (int, float)) else value


class AbxQCRange(AbxQCRangeBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxQCRangeCreate(AbxQCRange):
    pass


class AbxQCRangeUpdate(AbxQCRangeBase):
    pass


#
# AbxASTPanel Schemas
#
class AbxASTPanelBase(BaseAuditModel):
    name: str
    description: str | None = None
    breakpoints: Optional[List['AbxBreakpoint']] = field(default_factory=list)
    active: bool = True


class AbxASTPanel(AbxASTPanelBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AbxASTPanelCreate(AbxASTPanel):
    pass


class AbxASTPanelUpdate(AbxASTPanelBase):
    pass
