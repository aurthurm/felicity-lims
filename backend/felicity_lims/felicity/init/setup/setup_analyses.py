from typing import Optional

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
    categories = [
        AnalysisCategoryCreate(
            name="Quality Control",
            description='Quality Control Analysis Services Groupings',
            active=True
        ),
        AnalysisCategoryCreate(
            name="Molecular Tech",
            description='Molecular Techniques',
            active=True
        ),
    ]
    for category in categories:
        cat = await AnalysisCategory.get(name=category.name)
        if not cat:
            await AnalysisCategory.create(category)


async def create_qc_levels() -> None:
    qc_levels = [
        QCLevelCreate(level='Blank'),
        QCLevelCreate(level='Negative Control'),
        QCLevelCreate(level='Positive Control'),
        QCLevelCreate(level='Low Positive Control'),
        QCLevelCreate(level='High Positive Control'),
    ]

    for level_in in qc_levels:
        qc_level: Optional[QCLevel] = await QCLevel.get(level=level_in.level)
        if not qc_level:
            await QCLevel.create(level_in)


async def create_sample_types() -> None:
    s_types = [
        SampleTypeCreate(name="QC Sample", description="QC Sample", abbr="QCS", active=True),
        SampleTypeCreate(name="Whole Blood", description="Whole Blood", abbr="WB", active=True),
        SampleTypeCreate(name="Blood Plasma", description="Blood Plasma", abbr="BP", active=True),
        SampleTypeCreate(name="Dried Blood Spot", description="Dried Blood Spot", abbr="DBS", active=True),
        SampleTypeCreate(name="Urine", description="Urine", abbr="BV", active=True),
        SampleTypeCreate(name="Stool", description="Stool", abbr="BG", active=True),
        SampleTypeCreate(name="Synovial Fluid", description="Synovial Fluid", abbr="SF", active=False),
        SampleTypeCreate(name="Cerebral Spinal Fluid", description="Cerebral Spinal Fluid", abbr="CSF", active=False),
        SampleTypeCreate(name="Nasal-Pharyngeal Swab", description="Nasal-Pharyngeal Swab", abbr="NPS", active=True),
        SampleTypeCreate(name="Oral-Pharyngeal Swab", description="Oral-Pharyngeal Swab", abbr="OSF", active=False),
        SampleTypeCreate(name="Pus Swab", description="Pus Swabd", abbr="PS", active=True),
    ]

    for st_in in s_types:
        st: Optional[SampleType] = await SampleType.get(name=st_in.name)
        if not st:
            await SampleType.create(st_in)


async def create_analyses_services_and_profiles() -> None:
    analyses = [
        AnalysisCreate(name="HIV", description="Human Immune Virus", keyword="hiv", sort_key=1, active=True),
        AnalysisCreate(name="HIV Viral Load", description="HIV Viral Load", keyword="hivViralLoad", sort_key=1, active=True),
        AnalysisCreate(name="EID", description="Early Infant Diagnosis", keyword="hivEid", sort_key=1, active=True),
    ]

    for an_in in analyses:
        anal: Optional[Analysis] = await Analysis.get(name=an_in.name)
        if not anal:
            await Analysis.create(an_in)

    profiles = [
        {
            "name": "U&E's",
            "description": "Urea and Electrolytes",
            "services": [
                AnalysisCreate(name="Urea", description="Urea", keyword="urea", sort_key=5, active=True),
                AnalysisCreate(name="Creatinine", description="Creatinine", keyword="creatinine", sort_key=4, active=True),
                AnalysisCreate(name="K+", description="Potassium", keyword="potassium", sort_key=1, active=True),
                AnalysisCreate(name="Na-", description="Sodium", keyword="sodium", sort_key=2, active=True),
                AnalysisCreate(name="Cl-", description="Chloride", keyword="chloride", sort_key=3, active=True),
            ],
        },
        {
            "name": "FBC",
            "description": "Full Blood Count",
            "services": [
                AnalysisCreate(name="WBC", description="White Blood Cells", keyword="wbc", sort_key=1, active=True),
                AnalysisCreate(name="RBC", description="Red Blood Cells", keyword="rbc", sort_key=2, active=True),
                AnalysisCreate(name="HGB", description="Haemoglobin", keyword="hbg", sort_key=3, active=True),
                AnalysisCreate(name="MVC", description="Mean Cell Volume", keyword="mcv", sort_key=4, active=True),
                AnalysisCreate(name="MCH", description="Mean Cell Haemaglobin", keyword="mch", sort_key=5, active=True),
                AnalysisCreate(name="MCHC", description="Mean Cell Haemaglobin Concentration", keyword="mchc", sort_key=6, active=True),
                AnalysisCreate(name="PLT", description="Platelets", keyword="plt", sort_key=7, active=True),
            ],
        },
    ]

    for profile in profiles:
        a_profile: Optional[Profile] = await Profile.get(name=profile.get("name"))
        if not a_profile:
            prof_in = ProfileCreate(**profile)
            a_profile = await Profile.create(prof_in)

        analyses = profile.get("services", [])
        for an_in in analyses:
            anal: Optional[Analysis] = await Analysis.get(name=an_in.name)
            if not anal:
                an_in.profiles = [a_profile]
                anal = await Analysis.create(an_in)

