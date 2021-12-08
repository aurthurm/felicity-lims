import inspect
import logging
from typing import Optional

import strawberry

from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.patient.models import logger
from felicity.gql import auth_from_info, verify_user_auth
from felicity.gql.analysis.types import analysis as a_types
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.mutation
async def create_analysis_category(self, info, name: str, description: Optional[str] = None,
                                   active: Optional[bool] = True) -> a_types.AnalysisCategoryType:

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create analysis categories")

    if not name or not description:
        raise Exception("Name and Description are mandatory")

    exists = await analysis_models.AnalysisCategory.get(name=name)
    if exists:
        raise Exception(f"A AnalysisCategory named {name} already exists")

    incoming = {}
    for k, v in passed_args.items():
        incoming[k] = v

    obj_in = schemas.AnalysisCategoryCreate(**incoming)
    analysis_category: analysis_models.AnalysisCategory = await analysis_models.AnalysisCategory.create(obj_in)
    return analysis_category


@strawberry.mutation
async def update_analysis_category(self, info, uid: int, name: Optional[str] = None,
                                   description: Optional[str] = None,
                                   active: Optional[bool] = False) -> a_types.AnalysisCategoryType:  # noqa

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update analysis categories")

    analysis_category = await analysis_models.AnalysisCategory.get(uid=uid)
    if not analysis_category:
        raise Exception(f"AnalysisCategory with uid {uid} does not exist")

    ac_data = analysis_category.to_dict()
    for field in ac_data:
        if field in passed_args:
            try:
                setattr(analysis_category, field, passed_args[field])
            except AttributeError as e:
                logger.warning(e)

    profile_in = schemas.AnalysisCategoryUpdate(**analysis_category.to_dict())
    analysis_category = await analysis_category.update(profile_in)
    return analysis_category
