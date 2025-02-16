from sqlalchemy import Boolean, Column, ForeignKey, String, Integer, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract import BaseEntity


class AbxGuideline(BaseEntity):
    __tablename__ = "abx_guideline"

    name = Column(String)
    code = Column(String, nullable=True)
    description = Column(String, nullable=True)


class AbxAntibioticGuideline(BaseEntity):
    __tablename__ = "abx_antibiotic_guideline"

    antibiotic_uid = Column(String, ForeignKey("abx_antibiotic.uid"), nullable=False)
    guideline_uid = Column(String, ForeignKey("abx_guideline.uid"), nullable=False)
    antibiotic = relationship("AbxAntibiotic", backref="antibiotic_guidelines")
    guideline = relationship("AbxGuideline", backref="antibiotic_guidelines")


class AbxAntibiotic(BaseEntity):
    __tablename__ = "abx_antibiotic"

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


class AbxKingdom(BaseEntity):
    __tablename__ = 'abx_kingdom'

    name = Column(String(100), nullable=False, unique=True)


class AbxPhylum(BaseEntity):
    __tablename__ = 'abx_phylum'

    name = Column(String(100), nullable=False, unique=True)
    kingdom_uid = Column(String, ForeignKey('abx_kingdom.uid'), nullable=True)  # ForeignKey to Kingdom
    kingdom = relationship('AbxKingdom', backref='abx_phyla')


class AbxClass(BaseEntity):
    __tablename__ = 'abx_class'

    name = Column(String(100), nullable=False, unique=True)
    phylum_uid = Column(String, ForeignKey('abx_phylum.uid'), nullable=True)
    phylum = relationship('AbxPhylum', backref='classes')


class AbxOrder(BaseEntity):
    __tablename__ = 'abx_order'

    name = Column(String(100), nullable=False, unique=True)
    class_uid = Column(String, ForeignKey('abx_class.uid'), nullable=True)
    class_ = relationship('AbxClass', backref='orders')


class AbxFamily(BaseEntity):
    __tablename__ = 'abx_family'

    name = Column(String(100), nullable=False, unique=True)
    order_uid = Column(String, ForeignKey('abx_order.uid'), nullable=True)
    order = relationship('AbxOrder', backref='families')


class AbxGenus(BaseEntity):
    __tablename__ = 'abx_genus'

    name = Column(String(100), nullable=False, unique=True)
    family_uid = Column(String, ForeignKey('abx_family.uid'), nullable=True)
    family = relationship('AbxFamily', backref='genera')


class AbxOrganism(BaseEntity):
    __tablename__ = 'abx_organism'

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
    serotypes = relationship("AbxOrganismSerotype", back_populates="organism")
    comments = Column(String(500), nullable=True)


class AbxOrganismSerotype(BaseEntity):
    __tablename__ = 'abx_organism_serotypes'

    organism_uid = Column(String, ForeignKey('abx_organism.uid'), nullable=False)
    organism = relationship("AbxOrganism", back_populates="serotypes")
    serotype = Column(String(100), nullable=False)
    serogroup = Column(String(100), nullable=True)
    subspecies = Column(String(100), nullable=True)
    o_antigens = Column(String(100), nullable=True)
    h_phase_1 = Column(String(100), nullable=True)
    h_phase_2 = Column(String(100), nullable=True)
    x997_check = Column(String(10), default=False)
    fate = Column(String(50), nullable=True)


class AbxTestMethod(BaseEntity):
    __tablename__ = "abx_test_method"

    name = Column(String)
    description = Column(String, nullable=True)


class AbxBreakpointType(BaseEntity):
    __tablename__ = "abx_breakpoint_type"

    name = Column(String)
    description = Column(String, nullable=True)


class AbxHost(BaseEntity):
    __tablename__ = "abx_host"

    name = Column(String)
    description = Column(String, nullable=True)


class AbxSiteOfInfection(BaseEntity):
    __tablename__ = "abx_infection_site"

    name = Column(String)
    description = Column(String, nullable=True)


class AbxBreakpoint(BaseEntity):
    __tablename__ = 'abx_breakpoint'

    # Using a composite primary key of relevant fields
    guideline_uid = Column(String, ForeignKey("abx_guideline.uid"))
    guideline = relationship(AbxGuideline, backref="breakpoints", lazy="selectin")
    year = Column(Integer, nullable=False)
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


class AbxExpResPhenotype(BaseEntity):
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


class AbxExpertInterpretationRule(BaseEntity):
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


class AbxMedium(BaseEntity):
    __tablename__ = "abx_medium"

    name = Column(String)
    description = Column(String, nullable=True)


class AbxQCRange(BaseEntity):
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


# Association table for panels and antibiotics
panel_breakpoints = Table(
    'abx_panel_antibiotics',
    BaseEntity.metadata,
    Column('panel_uid', String, ForeignKey('abx_ast_panel.uid'), primary_key=True),
    Column('breakpoint_uid', String, ForeignKey('abx_breakpoint.uid'), primary_key=True)
)


class AbxASTPanel(BaseEntity):
    __tablename__ = 'abx_ast_panel'

    name = Column(String(100), nullable=False, unique=True)
    description = Column(String)
    breakpoints = relationship("AbxBreakpoint", secondary=panel_breakpoints)
    active = Column(Boolean, default=True)
