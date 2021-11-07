from typing import Optional
from felicity.core.config import settings
import json
from felicity.apps.analysis.models.analysis import (
    SampleType,
    AnalysisCategory,
    Analysis,
    Profile,
)
from felicity.apps.analysis.models.qc import (
    QCLevel
)
from felicity.apps.analysis.schemas import (
    SampleTypeCreate,
    QCLevelCreate,
    AnalysisCategoryCreate,
    AnalysisCreate,
    AnalysisUpdate,
    ProfileCreate,
)


async def create_categories():
    with open(settings.BASE_DIR + '/init/setup/data/analyses.json', 'r') as json_file:
        data = json.load(json_file)
    categories = data.get("categories", [])

    for _cat in categories:
        category = await AnalysisCategory.get(name=_cat)
        if not category:
            cat_in = AnalysisCategoryCreate(
                name=_cat,
                description=_cat
            )
            await AnalysisCategory.create(cat_in)


async def create_qc_levels() -> None:
    with open(settings.BASE_DIR + '/init/setup/data/analyses.json', 'r') as json_file:
        data = json.load(json_file)
    qc_levels = data.get("qc_levels", [])

    for _lvl in qc_levels:
        qc_level = await QCLevel.get(level=_lvl)
        if not qc_level:
            lvl_in = QCLevelCreate(level=_lvl)
            await QCLevel.create(lvl_in)


async def create_sample_types() -> None:
    with open(settings.BASE_DIR + '/init/setup/data/analyses.json', 'r') as json_file:
        data = json.load(json_file)
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
                active=bool(st_active)
            )
            await SampleType.create(st_in)


async def create_analyses_services_and_profiles() -> None:
    with open(settings.BASE_DIR + '/init/setup/data/analyses.json', 'r') as json_file:
        data = json.load(json_file)

    analyses = data.get("analyses", [])

    for _anal in analyses:
        analyte: Optional[Analysis] = await Analysis.get(name=_anal.get('name'))
        if not analyte:
            an_in = AnalysisCreate(
                name=_anal.get('name'),
                description=_anal.get('description'),
                keyword=_anal.get('keyword'),
                sort_key=_anal.get('sort_key'),
                active=bool(_anal.get('active'))
            )
            await Analysis.create(an_in)

    profiles = data.get("analyses_profiles", [])

    for _prf in profiles:
        a_profile: Optional[Profile] = await Profile.get(name=_prf.get("name"))
        if not a_profile:
            prof_in = ProfileCreate(
                name=_prf.get("name"),
                description=_prf.get("description"),
            )
            a_profile = await Profile.create(prof_in)

        analyses_names = _prf.get("analyses_names", [])
        for _a_name in analyses_names:
            anal: Optional[Analysis] = await Analysis.get(name=_a_name)
            if anal:
                if a_profile not in anal.profiles:
                    anal.profiles.append(a_profile)

