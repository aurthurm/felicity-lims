import logging
from datetime import datetime

from felicity.apps.analysis import utils
from felicity.apps.analysis.entities.analysis import analysis_profile
from felicity.apps.analysis.schemas import (AnalysisCategoryCreate,
                                            AnalysisCreate, ProfileCreate,
                                            QCLevelCreate,
                                            RejectionReasonCreate,
                                            SampleTypeCreate)
from felicity.apps.analysis.services.analysis import (AnalysisCategoryService,
                                                      AnalysisService,
                                                      CodingStandardService,
                                                      ProfileService,
                                                      RejectionReasonService,
                                                      SampleTypeService)
from felicity.apps.analysis.services.quality_control import QCLevelService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.setup.schemas import UnitCreate
from felicity.apps.setup.services import DepartmentService, UnitService
from felicity.core.config import get_settings

from .data import get_seeds

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

units = {}


async def unit_resolver(name: str, description=""):
    unit_service = UnitService()

    if not name or name is None:
        return None

    if name in units:
        return units[name]

    unit = await unit_service.get(name=name)
    if not unit:
        unit_in = UnitCreate(name=name, descritpion=description)
        unit = await unit_service.create(unit_in)
    units[name] = unit
    return unit


async def seed_categories():
    logger.info("Setting up analyses categories .....")
    analysis_category_service = AnalysisCategoryService()

    data = get_seeds("analyses")

    categories = data.get("categories", [])

    for _cat in categories:
        category = await analysis_category_service.get(name=_cat)
        if not category:
            cat_in = AnalysisCategoryCreate(name=_cat, description=_cat)
            await analysis_category_service.create(cat_in)


async def seed_qc_levels() -> None:
    logger.info("Setting QC Levels .....")
    qc_level_service = QCLevelService()

    data = get_seeds("analyses")

    qc_levels = data.get("qc_levels", [])

    for _lvl in qc_levels:
        qc_level = await qc_level_service.get(level=_lvl)
        if not qc_level:
            lvl_in = QCLevelCreate(level=_lvl)
            await qc_level_service.create(lvl_in)


async def seed_id_sequence() -> None:
    logger.info("Setting up id sequence .....")
    iq_sequence_service = IdSequenceService()

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
        id_seq = await iq_sequence_service.get(prefix=prefix)
        if id_seq is None:
            await iq_sequence_service.create({"prefix": prefix, "number": 0})


async def seed_coding_standards() -> None:
    # Coding for clinical laboratory information
    logger.info("Setting up coding standard .....")
    coding_standard_service = CodingStandardService()

    standards = [
        {
            "name": "LOINC",
            "description": "Logical Observation Identifiers Names and Codes",
        },
        # {"name": "SNOMED CT", "description": "Systemized Nomenclature of Medicine – Clinical Terms"}
    ]
    for stand in standards:
        standard = await coding_standard_service.get(name=stand.get("name"))
        if standard is None:
            await coding_standard_service.create(stand)


async def seed_sample_types() -> None:
    logger.info("Setting up sample types .....")
    sample_type_service = SampleTypeService()

    data = get_seeds("analyses")

    sample_types = data.get("sample_types", [])

    for _st in sample_types:
        st_name = _st.get("name")
        st_description = _st.get("description")
        st_abbr = _st.get("abbr")
        st_active = _st.get("active", 0)
        st = await sample_type_service.get(name=st_name, abbr=st_abbr)
        if not st:
            st_in = SampleTypeCreate(
                name=st_name,
                description=st_description,
                abbr=st_abbr.upper(),
                active=bool(st_active),
            )
            await sample_type_service.create(st_in)


async def seed_analyses_services_and_profiles() -> None:
    logger.info("Setting up analysis services and profiles .....")
    analysis_service = AnalysisService()
    analysis_category_service = AnalysisCategoryService()
    department_service = DepartmentService()
    profile_servide = ProfileService()

    data = get_seeds("analyses")

    analyses = data.get("analyses", [])

    for _anal in analyses:
        analyte = await analysis_service.get(name=_anal.get("name"))
        if not analyte:
            category = await analysis_category_service.get(name=_anal.get("category"))
            unit = await unit_resolver(name=_anal.get("ucuum"))
            an_in = AnalysisCreate(
                name=_anal.get("name"),
                description=_anal.get("description"),
                category_uid=category.uid if category else None,
                unit_uid=unit.uid if unit else None,
                keyword=_anal.get("keyword"),
                sort_key=_anal.get("sort_key"),
                active=bool(_anal.get("active")),
            )
            analyte = await analysis_service.create(an_in)
        await utils.billing_setup_analysis([analyte.uid])

    profiles = data.get("analyses_profiles", [])

    for _prf in profiles:
        a_profile = await profile_servide.get(name=_prf.get("name"))
        if not a_profile:
            department = await department_service.get(name=_prf.get("department"))
            prof_in = ProfileCreate(
                name=_prf.get("name"),
                description=_prf.get("description"),
                department_uid=department.uid if department else None,
            )
            a_profile = await profile_servide.create(prof_in)

        analyses_names = _prf.get("analyses_names", [])
        for _a_name in analyses_names:
            anal = await analysis_service.get(name=_a_name)
            p_analyses = await profile_servide.get_analyses(a_profile.uid)
            if anal and anal.uid not in [a.uid for a in p_analyses]:
                await profile_servide.repository.table_insert(
                    analysis_profile,
                    mappings={"analysis_uid": anal.uid, "profile_uid": a_profile.uid},
                )

        await utils.billing_setup_profiles([a_profile.uid])


async def seed_rejection_reasons() -> None:
    logger.info("Setting up rejection reasons .....")
    rejection_reason_service = RejectionReasonService()

    data = get_seeds("analyses")

    rejection_reasons = data.get("rejection_reasons", [])

    for _rr in rejection_reasons:
        reason = await rejection_reason_service.get(reason=_rr)
        if not reason:
            rr_in = RejectionReasonCreate(reason=_rr)
            await rejection_reason_service.create(rr_in)
