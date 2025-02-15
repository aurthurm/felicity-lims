from dataclasses import field
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType


@strawberry.type
class AbxGuidelineType:
    uid: str | None = None
    name: str
    code: str | None = None
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxAntibioticGuidelineType:
    antibiotic_uid: str
    guideline_uid: str
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxAntibioticType:
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
    name: str
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxPhylumType:
    name: str
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
    name: str
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
    name: str
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
    name: str
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
    name: str
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
    organism_uid: str
    organism: AbxOrganismType | None = None
    serotype: str
    serogroup: str | None = None
    subspecies: str | None = None
    o_antigens: str | None = None
    h_phase_1: str | None = None
    h_phase_2: str | None = None
    x997_check: bool | None = None
    fate: str | None = None
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
    name: str
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxBreakpointTypeType:
    name: str
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxHostType:
    name: str
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxSiteOfInfectionType:
    name: str
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxBreakpointType:
    guideline_uid: str
    year: int | None = None
    test_method: str
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
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxBreakpointEdge:
    cursor: str
    node: AbxBreakpointType


@strawberry.type
class AbxBreakpointCursorPage:
    page_info: PageInfo
    edges: list[AbxBreakpointEdge] | None = None
    items: list[AbxBreakpointType] | None = None
    total_count: int


@strawberry.type
class AbxReferenceTableType:
    name: str
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxExpResPhenotypeType:
    guideline_uid: str
    reference_table_uid: str
    organism_code: str
    organism_code_type: str
    exception_organism_code: str
    exception_organism_code_type: str
    abx_code: str
    abx_code_type: str
    antibiotic_exceptions: str
    comments: str | None = None
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
    rule_code: str
    description: str | None = None
    organism_code: str
    organism_code_type: str
    rule_criteria: str
    affected_antibiotics: str
    antibiotic_exceptions: str
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
    name: str
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class AbxQCRangeType:
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
    name: str
    description: str | None = None
    breakpoints: Optional[List['AbxBreakpointType']] = field(default_factory=list)
    active: bool = True
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
