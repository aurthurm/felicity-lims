from __future__ import annotations

from dataclasses import field
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types import AnalysisResultType
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType


@strawberry.type
class AbxGuidelineType:
    uid: str
    name: str
    code: str | None = None
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxAntibioticGuidelineType:
    uid: str
    antibiotic_uid: str
    antibiotic: AbxAntibioticType | None = None
    guideline_uid: str
    guideline: AbxGuidelineType | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxAntibioticType:
    uid: str
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
    guidelines: List[AbxGuidelineType] | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxAntibioticEdge:
    cursor: str
    node: AbxAntibioticType


@strawberry.type
class AbxAntibioticCursorPage:
    page_info: PageInfo
    edges: list[AbxAntibioticEdge] | None = None
    items: list[AbxAntibioticType] | None = None
    total_count: int


@strawberry.type
class AbxKingdomType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxPhylumType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    kingdom_uid: str | None = None
    kingdom: AbxKingdomType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxClassType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    phylum_uid: str | None = None
    phylum: AbxPhylumType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxOrderType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    class_uid: str | None = None
    class_: AbxClassType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxFamilyType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    order_uid: str | None = None
    order: AbxOrderType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxGenusType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    family_uid: str | None = None
    family: AbxFamilyType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxOrganismType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    kingdom: AbxKingdomType | None = None
    phylum_uid: str | None = None
    phylum: AbxPhylumType | None = None
    class_uid: str | None = None
    class_: AbxClassType | None = None
    order_uid: str | None = None
    order: AbxOrderType | None = None
    family_uid: str | None = None
    family: AbxFamilyType | None = None
    genus_uid: str | None = None
    genus: AbxGenusType | None = None
    comments: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxOrganismEdge:
    cursor: str
    node: AbxOrganismType


@strawberry.type
class AbxOrganismCursorPage:
    page_info: PageInfo
    edges: list[AbxOrganismEdge] | None = None
    items: list[AbxOrganismType] | None = None
    total_count: int


@strawberry.type
class AbxOrganismSerotypeType:
    uid: str
    organism_uid: str
    organism: AbxOrganismType | None = None
    serotype: str
    serogroup: str | None = None
    subspecies: str | None = None
    o_antigens: str | None = None
    h_phase_1: str | None = None
    h_phase_2: str | None = None
    x997_check: str | None = None
    fate: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxOrganismSerotypeEdge:
    cursor: str
    node: AbxOrganismSerotypeType


@strawberry.type
class AbxOrganismSerotypeCursorPage:
    page_info: PageInfo
    edges: list[AbxOrganismSerotypeEdge] | None = None
    items: list[AbxOrganismSerotypeType] | None = None
    total_count: int


@strawberry.type
class AbxTestMethodType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxBreakpointTypeTyp:
    uid: str
    name: str
    description: str | None = None
    laboratory_uid: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxHostType:
    uid: str
    name: str
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxSiteOfInfectionType:
    uid: str
    name: str
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxGuidelineYearType:
    uid: str
    guideline_uid: str
    guideline: AbxGuidelineType | None = None
    year: int
    code: str


@strawberry.type
class AbxBreakpointTyp:
    uid: str
    guideline_year_uid: str
    guideline_year: AbxGuidelineYearType | None = None
    test_method_uid: str
    test_method: AbxTestMethodType | None = None
    potency: str | None = None
    organism_code: str
    organism_code_type: str
    breakpoint_type_uid: str
    breakpoint_type: AbxBreakpointTypeTyp | None = None
    host_uid: str | None = None
    host: AbxHostType | None = None
    site_of_infection_uid: str | None = None
    site_of_infection: AbxSiteOfInfectionType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxBreakpointTypEdge:
    cursor: str
    node: AbxBreakpointTyp


@strawberry.type
class AbxBreakpointTypCursorPage:
    page_info: PageInfo
    edges: list[AbxBreakpointTypEdge] | None = None
    items: list[AbxBreakpointTyp] | None = None
    total_count: int


@strawberry.type
class AbxExpResPhenotypeType:
    uid: str
    guideline_uid: str
    guideline: AbxGuidelineType | None = None
    reference_table: str | None = None
    organism_code: str
    organism_code_type: str
    exception_organism_code: str
    exception_organism_code_type: str
    abx_code: str
    abx_code_type: str
    antibiotic_exceptions: str
    comments: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxExpResPhenotypeEdge:
    cursor: str
    node: AbxExpResPhenotypeType


@strawberry.type
class AbxExpResPhenotypeCursorPage:
    page_info: PageInfo
    edges: list[AbxExpResPhenotypeEdge] | None = None
    items: list[AbxExpResPhenotypeType] | None = None
    total_count: int


@strawberry.type
class AbxExpertInterpretationRuleType:
    uid: str
    rule_code: str
    description: str | None = None
    organism_code: str
    organism_code_type: str
    rule_criteria: str
    affected_antibiotics: str
    antibiotic_exceptions: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxExpertInterpretationRuleEdge:
    cursor: str
    node: AbxExpertInterpretationRuleType


@strawberry.type
class AbxExpertInterpretationRuleCursorPage:
    page_info: PageInfo
    edges: list[AbxExpertInterpretationRuleEdge] | None = None
    items: list[AbxExpertInterpretationRuleType] | None = None
    total_count: int


@strawberry.type
class AbxMediumType:
    uid: str
    name: str
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxQCRangeType:
    uid: str
    guideline_uid: str
    guideline: AbxGuidelineType | None = None
    year: int
    strain: str
    reference_table: str
    whonet_org_code: str
    antibiotic: str
    abx_test: str
    whonet_abx_code: str
    method: str
    medium_uid: str | None = None
    medium: AbxMediumType | None = None
    minimum: str | None = None
    maximum: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxQCRangeEdge:
    cursor: str
    node: AbxQCRangeType


@strawberry.type
class AbxQCRangeCursorPage:
    page_info: PageInfo
    edges: list[AbxQCRangeEdge] | None = None
    items: list[AbxQCRangeType] | None = None
    total_count: int


@strawberry.type
class AbxASTPanelType:
    uid: str
    name: str
    description: str | None = None
    organisms: Optional[List['AbxOrganismType']] = field(default_factory=list)
    antibiotics: Optional[List['AbxAntibioticType']] = field(default_factory=list)
    active: bool = True
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxASTPanelEdge:
    cursor: str
    node: AbxASTPanelType


@strawberry.type
class AbxASTPanelCursorPage:
    page_info: PageInfo
    edges: list[AbxASTPanelEdge] | None = None
    items: list[AbxASTPanelType] | None = None
    total_count: int


@strawberry.type
class AbxASTResultType:
    uid: str
    organism_result_uid: str
    analysis_result_uid: str
    analysis_result: Optional['AnalysisResultType'] = None
    antibiotic_uid: str
    antibiotic: Optional['AbxAntibioticType'] = None
    ast_method_uid: str | None = None
    ast_method: Optional['AbxTestMethodType'] = None
    guideline_year_uid: str | None = None
    guideline_year: Optional['AbxGuidelineYearType'] = None
    breakpoint_uid: str | None = None
    breakpoint: Optional['AbxBreakpointTyp'] = None
    ast_value: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxOrganismResultType:
    uid: str
    analysis_result_uid: str
    organism_uid: str | None = None
    organism: Optional['AbxOrganismType'] = None
    isolate_number: int | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
