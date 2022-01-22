from typing import List, Union, TYPE_CHECKING, Tuple, Optional

from .models.analysis import Sample
from .models.results import AnalysisResult

if TYPE_CHECKING:
    from ..user.models import User


async def check_sample_verification(
    samples: List[Union[int, Sample]], 
    verifer: "User",
) -> Tuple[Optional[Sample],Optional[Sample],str,str]:
    """
    splits samples into allowed and restricted samples.
    allowed samples are those that the user is allowed to verify.
    if restricted samples are found, the user will be provided with extra messages and suggestions
    """
    message: str = ""
    suggestion: str = ""
    
    if isinstance(samples[0], int):
        samples: List[Sample] = await Sample.get_all(uid__in=samples)
    
    restricted: List[Sample] = list(filter(lambda s: s.submitted_by_uid == verifer.uid, samples))
    allowed: List[Sample] = list(filter(lambda s: s.submitted_by_uid != verifer.uid, samples))
    
    _sample_ids = [r.sample_id for r in restricted] if restricted else []
    if _sample_ids:
        message = f"Self verification is not allowed for sample(s): {', '.join(_sample_ids)}."
        suggestion = "The person verifying samples must be different from the one who submitted them."
    
    return allowed, restricted, message, suggestion


async def check_result_verification(
    results: List[Union[int, AnalysisResult]], 
    verifer: "User",
) -> Tuple[Optional[AnalysisResult],Optional[AnalysisResult],str,str]:
    """
    splits results into allowed and restricted results.
    allowed results are those that the user is allowed to verify.
    if restricted results are found, the user will be provided with extra messages and suggestions
    """
    message: str = ""
    suggestion: str = ""
    
    if isinstance(results[0], int):
        results: List[AnalysisResult] = await AnalysisResult.get_all(uid__in=results)
    
    restricted: List[AnalysisResult] = list(filter(lambda a: a.submitted_by_uid == verifer.uid, results))
    allowed: List[AnalysisResult] = list(filter(lambda a: a.submitted_by_uid != verifer.uid, results))
    
    _result_data = ['(' + r.sample.sample_id + '|' + r.analysis.name + '|' + r.result + ')' for r in restricted] if restricted else []
    if _result_data:
        message = f"Self verification is not allowed for results: {', '.join(_result_data)}."
        suggestion = "The person verifying results must be different from the one who submitted them."
    
    return allowed, restricted, message, suggestion
