import logging
from datetime import datetime
from typing import Optional

from apps.setup.models.setup import Department
from felicity.apps.analysis import utils
from felicity.apps.analysis.models.analysis import (Analysis, AnalysisCategory,
                                                    CodingStandard, Profile,
                                                    RejectionReason,
                                                    SampleType)
from felicity.apps.analysis.models.qc import QCLevel
from felicity.apps.analysis.schemas import (AnalysisCategoryCreate,
                                            AnalysisCreate, ProfileCreate,
                                            QCLevelCreate,
                                            RejectionReasonCreate,
                                            SampleTypeCreate)
from felicity.apps.common.models import IdSequence
from felicity.core.config import get_settings
from felicity.database.session import async_session_factory
from .data import get_seeds

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_categories():
    logger.info("Setting up analyses categories .....")
    data = get_seeds("analyses")

    categories = data.get("categories", [])

    for _cat in categories:
        category = await AnalysisCategory.get(name=_cat)
        if not category:
            cat_in = AnalysisCategoryCreate(name=_cat, description=_cat)
            await AnalysisCategory.create(cat_in)


async def seed_qc_levels() -> None:
    logger.info("Setting QC Levels .....")
    data = get_seeds("analyses")

    qc_levels = data.get("qc_levels", [])

    for _lvl in qc_levels:
        qc_level = await QCLevel.get(level=_lvl)
        if not qc_level:
            lvl_in = QCLevelCreate(level=_lvl)
            await QCLevel.create(lvl_in)


async def seed_id_sequence() -> None:
    logger.info("Setting up id sequence .....")
    data = get_seeds("analyses")

    sample_types = data.get("sample_types", [])

    prefix_keys = ["WS", "P", "AR"]

    for _st in sample_types:
        st_abbr = _st.get("abbr")
        if st_abbr not in prefix_keys:
            prefix_keys.append(st_abbr)

    prefix_year = str(datetime.now().year)[2:]
    id_prefixes = [f"{prefix_key}{prefix_year}" for prefix_key in prefix_keys]

    for prefix in id_prefixes:
        id_seq = await IdSequence.get(prefix=prefix)
        if id_seq is None:
            await IdSequence.create(**{"prefix": prefix, "number": 0})


async def seed_coding_standards() -> None:
    # Coding for clinical laboratory information
    logger.info("Setting up coding standard .....")

    standards = [
        {
            "name": "LOINC",
            "description": "Logical Observation Identifiers Names and Codes",
        },
        # {"name": "SNOMED CT", "description": "Systemized Nomenclature of Medicine – Clinical Terms"}
    ]
    for stand in standards:
        standard = await CodingStandard.get(name=stand.get("name"))
        if standard is None:
            await CodingStandard.create(stand)


async def seed_sample_types() -> None:
    logger.info("Setting up sample types .....")
    data = get_seeds("analyses")

    sample_types = data.get("sample_types", [])

    for _st in sample_types:
        st_name = _st.get("name")
        st_description = _st.get("description")
        st_abbr = _st.get("abbr")
        st_active = _st.get("active", 0)
        st = await SampleType.get(name=st_name, abbr=st_abbr)
        if not st:
            st_in = SampleTypeCreate(
                name=st_name,
                description=st_description,
                abbr=st_abbr.upper(),
                active=bool(st_active),
            )
            await SampleType.create(st_in)


async def seed_analyses_services_and_profiles() -> None:
    logger.info("Setting up analysis services and profiles .....")
    data = get_seeds("analyses")

    analyses = data.get("analyses", [])

    for _anal in analyses:
        analyte: Optional[Analysis] = await Analysis.get(name=_anal.get("name"))
        category = await AnalysisCategory.get(name=_anal.get("category"))
        if not analyte:
            an_in = AnalysisCreate(
                name=_anal.get("name"),
                description=_anal.get("description"),
                category_uid=category.uid if category else None,
                keyword=_anal.get("keyword"),
                sort_key=_anal.get("sort_key"),
                active=bool(_anal.get("active")),
            )
            analyte = await Analysis.create(an_in)
        await utils.billing_setup_analysis([analyte.uid])

    profiles = data.get("analyses_profiles", [])

    for _prf in profiles:
        a_profile: Optional[Profile] = await Profile.get(name=_prf.get("name"))
        department = await Department.get(name=_prf.get("department"))
        if not a_profile:
            prof_in = ProfileCreate(
                name=_prf.get("name"),
                description=_prf.get("description"),
                department_uid=_prf.get("department")
            )
            a_profile = await Profile.create(prof_in)

        analyses_names = _prf.get("analyses_names", [])
        for _a_name in analyses_names:
            anal: Optional[Analysis] = await Analysis.get(name=_a_name)
            if anal:
                profiles = await Profile.get_all(analyses___uid=anal.uid)
                if a_profile.uid not in [profile.uid for profile in profiles]:
                    logger.info(f"adding anal: {anal} to profile: {a_profile}")
                    a_profile.analyses.append(anal)
                    await a_profile.save_async()

                    async with async_session_factory() as session:
                        try:
                            await session.flush()
                            await session.commit()
                        except Exception:  # noqa
                            await session.rollback()

        await utils.billing_setup_profiles([a_profile.uid])


async def seed_rejection_reasons() -> None:
    logger.info("Setting up rejection reasons .....")
    data = get_seeds("analyses")

    rejection_reasons = data.get("rejection_reasons", [])

    for _rr in rejection_reasons:
        reason = await RejectionReason.get(reason=_rr)
        if not reason:
            rr_in = RejectionReasonCreate(reason=_rr)
            await RejectionReason.create(rr_in)
