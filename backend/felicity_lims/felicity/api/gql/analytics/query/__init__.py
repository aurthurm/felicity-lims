from strawberry.tools import create_type

from .dashboard import (
    analysis_process_performance,
    count_analyte_group_by_instrument,
    count_analyte_group_by_status,
    count_extras_group_by_status,
    count_sample_group_by_action,
    count_sample_group_by_status,
    count_worksheet_group_by_status,
    sample_laggards,
    sample_process_performance,
)

AnalyticsQuery = create_type(
    "Query",
    [
        count_sample_group_by_status,
        count_sample_group_by_action,
        count_analyte_group_by_status,
        count_worksheet_group_by_status,
        count_extras_group_by_status,
        count_analyte_group_by_instrument,
        sample_process_performance,
        analysis_process_performance,
        sample_laggards,
    ],
)
