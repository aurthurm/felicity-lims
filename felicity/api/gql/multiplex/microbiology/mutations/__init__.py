from strawberry.tools import create_type

from felicity.api.gql.multiplex.microbiology.mutations.antibiotic import create_abx_guideline, update_abx_guideline, \
    create_abx_antibiotic, update_abx_antibiotic
from felicity.api.gql.multiplex.microbiology.mutations.ast_panel import create_abx_ast_panel, update_abx_ast_panel
from felicity.api.gql.multiplex.microbiology.mutations.breakpoint import create_abx_test_method, update_abx_test_method, \
    create_abx_breakpoint_type, update_abx_breakpoint_type, create_abx_host, update_abx_host, \
    create_abx_site_of_infection, update_abx_site_of_infection, create_abx_breakpoint, update_abx_breakpoint
from felicity.api.gql.multiplex.microbiology.mutations.medium_qc import create_abx_medium, update_abx_medium, \
    create_abx_qc_range, update_abx_qc_range
from felicity.api.gql.multiplex.microbiology.mutations.organism import create_abx_kingdom, update_abx_kingdom, \
    create_abx_phylum, update_abx_phylum, create_abx_organism, update_abx_organism, create_abx_organism_serotype, \
    update_abx_organism_serotype
from felicity.api.gql.multiplex.microbiology.mutations.resistance_rules import create_abx_reference_table, \
    update_abx_reference_table, create_abx_exp_res_phenotype, update_abx_exp_res_phenotype, \
    create_abx_expert_interpretation_rule, update_abx_expert_interpretation_rule

MicrobiologyMutations = create_type(
    "Mutation",
    [
        create_abx_guideline,
        update_abx_guideline,
        create_abx_antibiotic,
        update_abx_antibiotic,
        create_abx_ast_panel,
        update_abx_ast_panel,
        create_abx_test_method,
        update_abx_test_method,
        create_abx_breakpoint_type,
        update_abx_breakpoint_type,
        create_abx_host,
        update_abx_host,
        create_abx_site_of_infection,
        update_abx_site_of_infection,
        create_abx_breakpoint,
        update_abx_breakpoint,
        create_abx_medium,
        update_abx_medium,
        create_abx_qc_range,
        update_abx_qc_range,
        create_abx_kingdom,
        update_abx_kingdom,
        create_abx_phylum,
        update_abx_phylum,
        create_abx_organism,
        update_abx_organism,
        create_abx_organism_serotype,
        update_abx_organism_serotype,
        create_abx_reference_table,
        update_abx_reference_table,
        create_abx_exp_res_phenotype,
        update_abx_exp_res_phenotype,
        create_abx_expert_interpretation_rule,
        update_abx_expert_interpretation_rule
    ]
)
