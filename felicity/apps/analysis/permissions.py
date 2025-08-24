import logging
from typing import TYPE_CHECKING, List, Union

from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.setup.services import LaboratoryService, LaboratorySettingService
from .entities.analysis import Sample
from .entities.results import AnalysisResult
from ...core.tenant_context import get_current_lab_uid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if TYPE_CHECKING:
    from ..user.entities import User


async def check_sample_verification(
        samples: List[Union[str, Sample]], verifier: "User"
) -> tuple[list[Sample] | None, list[Sample] | None, str, str]:
    """
    splits samples into allowed and restricted samples.
    allowed samples are those that the user is allowed to verify.
    if restricted samples are found, the user will be provided with extra messages and suggestions
    """
    message: str = ""
    suggestion: str = ""

    if isinstance(samples[0], str):
        samples = await SampleService().get_all(uid__in=samples)

    # verify hanging samples iff all results have been verified - just in case they exist
    hangings = []
    pending = []
    for sample in samples:
        is_verifiable = await SampleService().is_verifiable(sample.uid)
        if is_verifiable:
            hangings.append(sample)
        else:
            pending.append(sample)

    restricted = list(filter(lambda s: s.submitted_by_uid == verifier.uid, pending))
    allowed = list(filter(lambda s: s.submitted_by_uid != verifier.uid, pending))

    _sample_ids = [r.sample_id for r in restricted] if restricted else []
    if _sample_ids:
        message = (
            f"Self verification is not allowed for sample(s): {', '.join(_sample_ids)}."
        )
        suggestion = "The person verifying samples must be different from the one who submitted them."

    # push hangings
    for hang in hangings:
        allowed.append(hang)

    return allowed, restricted, message, suggestion


async def check_result_verification(
        results: List[Union[str, AnalysisResult]], verifier: "User"
) -> tuple[list[AnalysisResult] | None, list[AnalysisResult] | None, str, str]:
    """
    splits results into allowed and restricted results.
    allowed results are those that the user is allowed to verify.
    if restricted results are found, the user will be provided with extra messages and suggestions
    """
    message: str = ""
    suggestion: str = ""
    allowed = []
    restricted = []

    lab_id = get_current_lab_uid()
    laboratory = await LaboratoryService().get(uid=lab_id)
    settings = await LaboratorySettingService().get(laboratory_uid=laboratory.uid)

    if isinstance(results[0], str):
        results = await AnalysisResultService().get_all(uid__in=results)

    for result in results:
        # if allowed globally, or at analysis level: allow
        if settings.allow_self_verification or result.analysis.self_verification:
            allowed.append(result)
        else:
            # First time verifier must not be the submitter
            if len(result.verified_by) == 0 and result.submitted_by_uid == verifier.uid:
                restricted.append(result)
            else:
                # cannot co-verify own verifications
                if verifier.uid in [usr.uid for usr in result.verified_by]:
                    restricted.append(result)
                else:
                    allowed.append(result)

    _result_data = (
        [
            "(" + r.sample.sample_id + "|" + r.analysis.name + "|" + r.result + ")"
            for r in restricted
        ]
        if restricted
        else []
    )
    if _result_data:
        message = (
            f"Self verification is not allowed for results: {', '.join(_result_data)}."
        )
        suggestion = "The person verifying results must be different from the one who submitted them."

    return allowed, restricted, message, suggestion
