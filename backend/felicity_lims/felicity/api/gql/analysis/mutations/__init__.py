from strawberry.tools import create_type

from .sample_type import create_sample_type, update_sample_type
from .result_option import create_result_option, update_result_option
from .rejection_reason import create_rejection_reason, update_rejection_reason
from .analysis_category import create_analysis_category, update_analysis_category
from .analysis_profile import create_profile, update_profile
from .analysis_service import create_analysis, update_analysis
from .analysis_request import (
    create_analysis_request,
    # update_analysis_request,
    # update_sample,
    clone_samples,
    cancel_samples,
    re_instate_samples,
    receive_samples,
    verify_samples,
    reject_samples,
    publish_samples,
    invalidate_samples,
)
from .analysis_result import (
    submit_analysis_results,
    verify_analysis_results,
    retract_analysis_results,
    retest_analysis_results,
    cancel_analysis_results,
    re_instate_analysis_results,
)
from .analysis_other import (
    create_analysis_interim,
    update_analysis_interim,
    create_analysis_uncertainty,
    update_analysis_uncertainty,
    create_analysis_correction_factor,
    update_analysis_correction_factor,
    create_analysis_detection_limit,
    update_analysis_detection_limit,
    create_analysis_specification,
    update_analysis_specification,
)
from .quality_control import (
    create_QC_set,
    create_QC_level,
    update_QC_level,
    create_QC_template,
    update_QC_template,
)

AnalysisMutations = create_type(
    "Mutation",
    [
        create_sample_type,
        update_sample_type,
        create_result_option,
        update_result_option,
        create_rejection_reason,
        update_rejection_reason,
        create_analysis_category,
        update_analysis_category,
        create_profile,
        update_profile,
        create_analysis,
        update_analysis,
        create_analysis_request,
        create_analysis_interim,
        update_analysis_interim,
        create_analysis_uncertainty,
        update_analysis_uncertainty,
        create_analysis_correction_factor,
        update_analysis_correction_factor,
        create_analysis_detection_limit,
        update_analysis_detection_limit,
        create_analysis_specification,
        update_analysis_specification,
        # update_analysis_request,
        # update_sample,
        clone_samples,
        cancel_samples,
        re_instate_samples,
        receive_samples,
        verify_samples,
        reject_samples,
        publish_samples,
        invalidate_samples,
        submit_analysis_results,
        verify_analysis_results,
        retract_analysis_results,
        retest_analysis_results,
        cancel_analysis_results,
        re_instate_analysis_results,
        create_QC_set,
        create_QC_level,
        update_QC_level,
        create_QC_template,
        update_QC_template,
    ],
)
