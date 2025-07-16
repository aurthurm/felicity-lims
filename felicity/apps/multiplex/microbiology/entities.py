from sqlalchemy import Boolean, Column, ForeignKey, String, Integer, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity


class AbxGuideline(LabScopedEntity):
    __tablename__ = "abx_guideline"
    __repr_attrs__ = ['name']

    name = Column(String)
    code = Column(String, nullable=True)
    description = Column(String, nullable=True)
    antibiotics = relationship("AbxAntibiotic", secondary="abx_antibiotic_guideline", back_populates="guidelines")


class AbxAntibioticGuideline(LabScopedEntity):
    """
    Many to Many Link between Sample and Rejection Reason
    """
    __tablename__ = "abx_antibiotic_guideline"

    antibiotic_uid = Column(String, ForeignKey("abx_antibiotic.uid"), nullable=False)
    guideline_uid = Column(String, ForeignKey("abx_guideline.uid"), nullable=False)


class AbxAntibiotic(LabScopedEntity):
    __tablename__ = "abx_antibiotic"
    __repr_attrs__ = ['name']

    name = Column(String)
    whonet_abx_code = Column(String, nullable=True)
    who_code = Column(String, nullable=True)
    din_code = Column(String, nullable=True)
    jac_code = Column(String, nullable=True)
    eucast_code = Column(String, nullable=True)
    user_code = Column(String, nullable=True)
    abx_number = Column(String, nullable=True)
    potency = Column(String, nullable=True)
    atc_code = Column(String, nullable=True)
    class_ = Column(String, name="class", nullable=True)  # "class" is a reserved keyword, hence "class_"
    subclass = Column(String, nullable=True)
    prof_class = Column(String, nullable=True)
    cia_category = Column(String, nullable=True)
    clsi_order = Column(String, nullable=True)
    eucast_order = Column(String, nullable=True)
    human = Column(Boolean, nullable=True)
    veterinary = Column(Boolean, nullable=True)
    animal_gp = Column(String, nullable=True)
    loinccomp = Column(String, nullable=True)
    loincgen = Column(String, nullable=True)
    loincdisk = Column(String, nullable=True)
    loincmic = Column(String, nullable=True)
    loincetest = Column(String, nullable=True)
    loincslow = Column(String, nullable=True)
    loincafb = Column(String, nullable=True)
    loincsbt = Column(String, nullable=True)
    loincmlc = Column(String, nullable=True)
    comments = Column(String(500), nullable=True)
    guidelines = relationship(
        "AbxGuideline",
        secondary="abx_antibiotic_guideline",
        back_populates="antibiotics",
        lazy="selectin"
    )


# Association table for laboratory and antibiotics
laboratory_antibiotics = Table(
    'abx_laboratory_antibiotic',
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column('laboratory_uid', String, ForeignKey('laboratory.uid'), primary_key=True),
    Column('antibiotic_uid', String, ForeignKey('abx_antibiotic.uid'), primary_key=True)
)


class AbxKingdom(LabScopedEntity):
    __tablename__ = 'abx_kingdom'
    __repr_attrs__ = ['name']

    name = Column(String(100), nullable=False, unique=True)


class AbxPhylum(LabScopedEntity):
    __tablename__ = 'abx_phylum'
    __repr_attrs__ = ['name']

    name = Column(String(100), nullable=False, unique=True)
    kingdom_uid = Column(String, ForeignKey('abx_kingdom.uid'), nullable=True)  # ForeignKey to Kingdom
    kingdom = relationship('AbxKingdom', backref='abx_phyla', lazy="selectin")


class AbxClass(LabScopedEntity):
    __tablename__ = 'abx_class'
    __repr_attrs__ = ['name']

    name = Column(String(100), nullable=False, unique=True)
    phylum_uid = Column(String, ForeignKey('abx_phylum.uid'), nullable=True)
    phylum = relationship('AbxPhylum', backref='classes', lazy="selectin")


class AbxOrder(LabScopedEntity):
    __tablename__ = 'abx_order'
    __repr_attrs__ = ['name']

    name = Column(String(100), nullable=False, unique=True)
    class_uid = Column(String, ForeignKey('abx_class.uid'), nullable=True)
    class_ = relationship('AbxClass', backref='orders', lazy="selectin")


class AbxFamily(LabScopedEntity):
    __tablename__ = 'abx_family'
    __repr_attrs__ = ['name']

    name = Column(String(100), nullable=False, unique=True)
    order_uid = Column(String, ForeignKey('abx_order.uid'), nullable=True)
    order = relationship('AbxOrder', backref='families', lazy="selectin")


class AbxGenus(LabScopedEntity):
    __tablename__ = 'abx_genus'
    __repr_attrs__ = ['name']

    name = Column(String(100), nullable=False, unique=True)
    family_uid = Column(String, ForeignKey('abx_family.uid'), nullable=True)
    family = relationship('AbxFamily', backref='genera', lazy="selectin")


class AbxOrganism(LabScopedEntity):
    __tablename__ = 'abx_organism'
    __repr_attrs__ = ['name']

    name = Column(String(255))
    whonet_org_code = Column(String(50), nullable=True)
    replaced_by = Column(String(50), nullable=True)
    taxonomic_status = Column(String(50), nullable=True)
    common = Column(String(100), nullable=True)
    organism_type = Column(String(50), nullable=True)
    anaerobe = Column(Boolean, nullable=True)
    morphology = Column(String(100), nullable=True)
    subkingdom_code = Column(String(50), nullable=True)
    family_code = Column(String(50), nullable=True)
    genus_group = Column(String(100), nullable=True)
    genus_code = Column(String(50), nullable=True)
    species_group = Column(String(100), nullable=True)
    serovar_group = Column(String(100), nullable=True)
    msf_grp_clin = Column(String(50), nullable=True)
    sct_code = Column(String(50), nullable=True)
    sct_text = Column(String(100), nullable=True)
    gbif_taxon_id = Column(String(100), nullable=True)
    gbif_dataset_id = Column(String(255), nullable=True)
    gbif_taxonomic_status = Column(String(50), nullable=True)
    # Foreign keys to taxonomic tables
    kingdom_uid = Column(String, ForeignKey('abx_kingdom.uid'), nullable=True)
    phylum_uid = Column(String, ForeignKey('abx_phylum.uid'), nullable=True)
    class_uid = Column(String, ForeignKey('abx_class.uid'), nullable=True)
    order_uid = Column(String, ForeignKey('abx_order.uid'), nullable=True)
    family_uid = Column(String, ForeignKey('abx_family.uid'), nullable=True)
    genus_uid = Column(String, ForeignKey('abx_genus.uid'), nullable=True)
    # Relationships
    kingdom = relationship('AbxKingdom', backref="kingdoms", lazy="selectin")
    phylum = relationship('AbxPhylum', backref="phyla", lazy="selectin")
    class_ = relationship('AbxClass', backref="classes", lazy="selectin")
    order = relationship('AbxOrder', backref="orders", lazy="selectin")
    family = relationship('AbxFamily', backref="families", lazy="selectin")
    genus = relationship('AbxGenus', backref="genera", lazy="selectin")
    serotypes = relationship("AbxOrganismSerotype", back_populates="organism", lazy="selectin")
    comments = Column(String(500), nullable=True)


class AbxOrganismSerotype(LabScopedEntity):
    __tablename__ = 'abx_organism_serotypes'

    organism_uid = Column(String, ForeignKey('abx_organism.uid'), nullable=False)
    organism = relationship("AbxOrganism", back_populates="serotypes", lazy="selectin")
    serotype = Column(String(100), nullable=False)
    serogroup = Column(String(100), nullable=True)
    subspecies = Column(String(100), nullable=True)
    o_antigens = Column(String(100), nullable=True)
    h_phase_1 = Column(String(100), nullable=True)
    h_phase_2 = Column(String(100), nullable=True)
    x997_check = Column(String(10), default=False)
    fate = Column(String(50), nullable=True)


class AbxTestMethod(LabScopedEntity):
    __tablename__ = "abx_test_method"
    __repr_attrs__ = ['name']

    name = Column(String)
    description = Column(String, nullable=True)


class AbxBreakpointType(LabScopedEntity):
    __tablename__ = "abx_breakpoint_type"
    __repr_attrs__ = ['name']

    name = Column(String)
    description = Column(String, nullable=True)


class AbxHost(LabScopedEntity):
    __tablename__ = "abx_host"
    __repr_attrs__ = ['name']

    name = Column(String)
    description = Column(String, nullable=True)


class AbxSiteOfInfection(LabScopedEntity):
    __tablename__ = "abx_infection_site"
    __repr_attrs__ = ['name']

    name = Column(String)
    description = Column(String, nullable=True)


class AbxGuidelineYear(LabScopedEntity):
    __tablename__ = "abx_guideline_year"
    __repr_attrs__ = ['code']

    guideline_uid = Column(String, ForeignKey("abx_guideline.uid"))
    guideline = relationship(AbxGuideline, backref="guideline_years", lazy="selectin")
    year = Column(Integer, nullable=False)
    code = Column(String(20), nullable=False)
    breakpoints = relationship("AbxBreakpoint", back_populates="guideline_year", lazy="selectin")


class AbxBreakpoint(LabScopedEntity):
    __tablename__ = 'abx_breakpoint'

    # Using a composite primary key of relevant fields
    guideline_year_uid = Column(String, ForeignKey("abx_guideline_year.uid"))
    guideline_year = relationship(AbxGuidelineYear, back_populates="breakpoints", lazy="selectin")
    test_method_uid = Column(String, ForeignKey("abx_test_method.uid"), nullable=True)
    test_method = relationship(AbxTestMethod, backref="breakpoints", lazy="selectin")
    potency = Column(String(50), nullable=True)
    organism_code = Column(String(50), nullable=False)
    organism_code_type = Column(String(50), nullable=False)
    breakpoint_type_uid = Column(String, ForeignKey("abx_breakpoint_type.uid"))
    breakpoint_type = relationship(AbxBreakpointType, backref="breakpoints", lazy="selectin")
    host_uid = Column(String, ForeignKey("abx_host.uid"), nullable=True)
    host = relationship(AbxHost, backref="hosts", lazy="selectin")
    site_of_infection_uid = Column(String, ForeignKey("abx_infection_site.uid"), nullable=True)
    site_of_infection = relationship(AbxSiteOfInfection, backref="breakpoints", lazy="selectin")
    reference_table = Column(String(100), nullable=True)
    reference_sequence = Column(String(100), nullable=True)
    whonet_abx_code = Column(String(50), nullable=True)
    comments = Column(String(500), nullable=True)

    # Breakpoint values
    r = Column(String(20))  # Resistant
    i = Column(String(20))  # Intermediate
    sdd = Column(String(20))  # Susceptible-Dose Dependent
    s = Column(String(20))  # Susceptible

    # ECV/ECOFF values
    ecv_ecoff = Column(String(20))
    ecv_ecoff_tentative = Column(String(20))


class AbxExpResPhenotype(LabScopedEntity):
    """Expected Resistance Phenotype"""
    __tablename__ = 'abx_expected_res_phenotype'

    guideline_uid = Column(String, ForeignKey("abx_guideline.uid"))
    guideline = relationship(AbxGuideline, backref="exp_res_phenotypes", lazy="selectin")
    reference_table = Column(String(100), nullable=True)

    # Organism related fields
    organism_code = Column(String(50), nullable=False)
    organism_code_type = Column(String(50), nullable=False)
    exception_organism_code = Column(String(50))
    exception_organism_code_type = Column(String(50))

    # Antibiotic related fields
    abx_code = Column(String(50), nullable=False)
    abx_code_type = Column(String(50), nullable=False)
    antibiotic_exceptions = Column(String(500))

    # Audit fields
    comments = Column(String(500), nullable=True)


class AbxExpertInterpretationRule(LabScopedEntity):
    __tablename__ = 'abx_expert_interpret_rule'

    rule_code = Column(String(50))
    description = Column(String, nullable=False)
    # Organism specification
    organism_code = Column(String(50), nullable=False)
    organism_code_type = Column(String(50), nullable=False)
    # Rule specifics
    rule_criteria = Column(String, nullable=False)
    affected_antibiotics = Column(String, nullable=False)
    antibiotic_exceptions = Column(String)


class AbxMedium(LabScopedEntity):
    __tablename__ = "abx_medium"
    __repr_attrs__ = ['name']

    name = Column(String)
    description = Column(String, nullable=True)


class AbxQCRange(LabScopedEntity):
    __tablename__ = 'abx_qc_ranges'

    guideline_uid = Column(String, ForeignKey("abx_guideline.uid"))
    guideline = relationship(AbxGuideline, backref="qc_ranges", lazy="selectin")
    year = Column(Integer, nullable=False)
    strain = Column(String(100), nullable=False)
    reference_table = Column(String(100), nullable=False)
    whonet_org_code = Column(String(50), nullable=False)
    antibiotic = Column(String(100), nullable=False)
    abx_test = Column(String(50))
    whonet_abx_code = Column(String(50), nullable=False)
    method = Column(String(100), nullable=False)
    medium_uid = Column(String, ForeignKey("abx_medium.uid"), nullable=True)
    medium = relationship(AbxMedium, backref="qc_ranges", lazy="selectin")
    minimum = Column(String(10), nullable=False)
    maximum = Column(String(10), nullable=False)

    @property
    def range_display(self):
        """Returns a formatted string of the QC range"""
        return f"{self.minimum} - {self.maximum}"


# Association table for panels and antibiotic
panel_antibiotic = Table(
    'abx_panel_antibiotic',
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column('panel_uid', String, ForeignKey('abx_ast_panel.uid'), primary_key=True),
    Column('antibiotic_uid', String, ForeignKey('abx_antibiotic.uid'), primary_key=True)
)

# Association table for panels and organisms
panel_organism = Table(
    'abx_panel_organism',
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column('panel_uid', String, ForeignKey('abx_ast_panel.uid'), primary_key=True),
    Column('organism_uid', String, ForeignKey('abx_organism.uid'), primary_key=True)
)


class AbxASTPanel(LabScopedEntity):
    __tablename__ = 'abx_ast_panel'
    __repr_attrs__ = ['name']

    name = Column(String(100), nullable=False, unique=True)
    description = Column(String)
    organisms = relationship("AbxOrganism", secondary=panel_organism, lazy="selectin")
    antibiotics = relationship("AbxAntibiotic", secondary=panel_antibiotic, lazy="selectin")
    active = Column(Boolean, default=True)


class AbxASTResult(LabScopedEntity):
    __tablename__ = 'abx_ast_result'

    # for which isolated org is this abx result
    organism_result_uid = Column(String, ForeignKey("abx_organism_result.uid"))
    organism_result = relationship("AbxOrganismResult", lazy="selectin")
    analysis_result_uid = Column(String, ForeignKey("analysis_result.uid"))
    analysis_result = relationship("AnalysisResult", lazy="selectin")
    antibiotic_uid = Column(String, ForeignKey("abx_antibiotic.uid"))
    antibiotic = relationship(AbxAntibiotic, lazy="selectin")
    guideline_year_uid = Column(String, ForeignKey("abx_guideline_year.uid"))
    guideline_year = relationship(AbxGuidelineYear, lazy="selectin")
    breakpoint_uid = Column(String, ForeignKey("abx_breakpoint.uid"))
    breakpoint = relationship(AbxBreakpoint, lazy="selectin")
    ast_method_uid = Column(String, ForeignKey("abx_test_method.uid"), nullable=True)
    ast_method = relationship(AbxTestMethod, lazy="selectin")
    ast_value = Column(String(10), nullable=True)


class AbxOrganismResult(LabScopedEntity):
    __tablename__ = 'abx_organism_result'

    analysis_result_uid = Column(String, ForeignKey("analysis_result.uid"))
    organism_uid = Column(String, ForeignKey("abx_organism.uid"), nullable=True)
    organism = relationship(AbxOrganism, lazy="selectin")
    isolate_number = Column(Integer, default=1, nullable=True)
