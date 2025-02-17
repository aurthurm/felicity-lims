import logging

import pandas as pd

from felicity.apps.multiplex.microbiology.schemas import AbxGuidelineCreate, AbxAntibioticCreate, \
    AbxAntibioticGuidelineCreate, AbxKingdomCreate, AbxPhylumCreate, AbxClassCreate, AbxOrderCreate, AbxFamilyCreate, \
    AbxGenusCreate, AbxOrganismCreate, AbxBreakpointTypeCreate, AbxHostCreate, AbxBreakpointCreate, \
    AbxSiteOfInfectionCreate, AbxExpResPhenotypeCreate, AbxExpertInterpretationRuleCreate, \
    AbxMediumCreate, AbxQCRangeCreate, AbxTestMethodCreate, AbxOrganismSerotypeCreate
from felicity.apps.multiplex.microbiology.services import AbxGuidelineService, AbxAntibioticService, \
    AbxAntibioticGuidelineService, AbxKingdomService, AbxPhylumService, AbxClassService, AbxOrderService, \
    AbxFamilyService, AbxGenusService, AbxOrganismService, AbxBreakpointTypeService, \
    AbxHostService, AbxSiteOfInfectionService, AbxBreakpointService, AbxExpResPhenotypeService, \
    AbxExpertInterpretationRuleService, AbxMediumService, AbxQCRangeService, \
    AbxTestMethodService, AbxOrganismSerotypeService
from felicity.core.config import get_settings
from felicity.lims.seeds.data import get_whonet_dataframes

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _clean_df(df, rename):
    df = df.astype(object).where(pd.notna(df), '')
    df.columns = [col.lower() for col in df.columns]
    df = df.rename(columns=rename)
    return df


async def seed_antibiotics() -> None:
    logger.info("Setting up antibiotics and guidelines .....")
    data = _clean_df(get_whonet_dataframes("Antibiotics"), rename={
        "antibiotic": "name",
        "class": "class_"
    })

    abx_guideline_service = AbxGuidelineService()

    guidelines = ["CLSI", "EUCAST", "SFM", "SRGA", "BSAC", "DIN", "NEO", "AFA"]
    guides = {}
    for guideline in guidelines:
        _guideline = await abx_guideline_service.get(name=guideline)
        if not _guideline:
            guideline_in = AbxGuidelineCreate(name=guideline, code=guideline, description=guideline)
            _guideline = await abx_guideline_service.create(guideline_in)
        guides[guideline] = _guideline

    abx_antibiotic_service = AbxAntibioticService()
    for _, item in data.iterrows():

        antibiotic_in = {key: item[key] for key in AbxAntibioticCreate.model_fields if key in item}
        antibiotic_in["human"] = True if antibiotic_in["human"] == 'X' else False
        antibiotic_in["veterinary"] = True if antibiotic_in["veterinary"] == 'X' else False
        antibiotic_in['guidelines'] = item.get('guidelines', [])

        if not (
                await abx_antibiotic_service.get(name=antibiotic_in['name'],
                                                 abx_number=str(antibiotic_in['abx_number']))):
            schema_in = AbxAntibioticCreate(**antibiotic_in)
            _abx_antibiotic = await abx_antibiotic_service.create(schema_in)

            for gl_name, gl in guides.items():
                if antibiotic_in["guidelines"] and gl_name in antibiotic_in["guidelines"]:
                    gl_in = AbxAntibioticGuidelineCreate(
                        antibiotic_uid=_abx_antibiotic.uid,
                        guideline_uid=gl.uid
                    )
                    await AbxAntibioticGuidelineService().create(gl_in)


async def seed_organisms():
    logger.info("Setting up organisms and family tree .....")
    data = _clean_df(get_whonet_dataframes("Organisms"), rename={
        "organism": "name",
        "class": "class_"
    })

    for kingdom in data['kingdom'].unique():
        kd = await AbxKingdomService().get(name=kingdom) if kingdom != '' else None
        if kd is None and kingdom != '':
            kd_in = AbxKingdomCreate(name=kingdom)
            kd = await AbxKingdomService().create(kd_in)

        king_sub = data[data['kingdom'] == kingdom]
        for phylum in king_sub['phylum'].unique():
            ph = await AbxPhylumService().get(name=phylum) if phylum != '' else None
            if ph is None and phylum != '':
                ph_in = AbxPhylumCreate(name=phylum, kingdom_uid=kd.uid if kd else None)
                ph = await AbxPhylumService().create(ph_in)

            phylum_sub = king_sub[king_sub['phylum'] == phylum]
            for _class in phylum_sub['class_'].unique():
                cl = await AbxClassService().get(name=_class) if _class != '' else None
                if cl is None and _class != '':
                    cl_in = AbxClassCreate(name=_class, phylum_uid=ph.uid if ph else None)
                    cl = await AbxClassService().create(cl_in)

                class_sub = phylum_sub[phylum_sub['class_'] == _class]
                for order in class_sub['order'].unique():
                    od = await AbxOrderService().get(name=order) if order != '' else None
                    if od is None and order != '':
                        od_in = AbxOrderCreate(name=order, class_uid=cl.uid if cl else None)
                        od = await AbxOrderService().create(od_in)

                    order_sub = class_sub[class_sub['order'] == order]
                    for family in order_sub['family'].unique():
                        fa = await AbxFamilyService().get(name=family) if family != '' else None
                        if fa is None and family != '':
                            fa_in = AbxFamilyCreate(name=family, order_uid=od.uid if od else None)
                            fa = await AbxFamilyService().create(fa_in)

                        family_sub = order_sub[order_sub['family'] == family]
                        for genus in family_sub['genus'].unique():
                            ge = await AbxGenusService().get(name=genus) if genus != '' else None
                            if ge is None and genus != '':
                                ge_in = AbxGenusCreate(name=genus, family_uid=fa.uid if fa else None)
                                ge = await AbxGenusService().create(ge_in)

                            genus_sub = order_sub[order_sub['genus'] == genus]
                            for _, item in genus_sub.iterrows():
                                organism_in = {
                                    key: item[key] \
                                    for key in AbxOrganismCreate.model_fields \
                                    if key in item
                                }
                                organism_in = {
                                    **organism_in,
                                    'anaerobe': True if organism_in["anaerobe"] == 'X' else False,
                                    'kingdom_uid': kd.uid if kd else None,
                                    'phylum_uid': ph.uid if ph else None,
                                    'class_uid': cl.uid if cl else None,
                                    'order_uid': od.uid if od else None,
                                    'family_uid': fa.uid if fa else None,
                                    'genus_uid': ge.uid if ge else None,
                                }
                                if not (
                                        await AbxOrganismService().get(
                                            name=organism_in['name'], whonet_org_code=organism_in['whonet_org_code']
                                        )
                                ):
                                    schema_in = AbxOrganismCreate(**organism_in)
                                    await AbxOrganismService().create(schema_in)


async def seed_organism_serotypes():
    logger.info("Setting up organism and their serotypes .....")
    data = _clean_df(get_whonet_dataframes("Serotype"), {})
    organisms = await AbxOrganismService().all()

    for _, item in data.iterrows():
        bp_in = {
            key: item[key] \
            for key in AbxOrganismSerotypeCreate.model_fields \
            if key in item
        }
        org = [x for x in organisms if x and getattr(x, "whonet_org_code", None) == item["organism"]]
        bp_in = {
            **bp_in,
            "organism_uid": org[0].uid if org else None,
        }
        bp_schema = AbxOrganismSerotypeCreate(**bp_in)

        if not (await AbxOrganismSerotypeService().get(
                organism_uid=bp_in["organism_uid"],
                serotype=bp_in["serotype"],
                subspecies=bp_in["subspecies"],
                o_antigens=bp_in["o_antigens"],
                h_phase_1=bp_in["h_phase_1"],
                h_phase_2=bp_in["h_phase_2"]
        )):
            await AbxOrganismSerotypeService().create(bp_schema)


async def seed_breakpoints():
    logger.info("Setting up breakpoints .....")
    data = _clean_df(get_whonet_dataframes("Breakpoints"), {})
    guidelines = await AbxGuidelineService().all()

    breakpoint_types = []
    for bpt_name in data['breakpoint_type'].unique():
        bpt = await AbxBreakpointTypeService().get(name=bpt_name)
        if bpt is None and bpt_name != '':
            bpt_in = AbxBreakpointTypeCreate(name=bpt_name)
            bpt = await AbxBreakpointTypeService().create(bpt_in)
        breakpoint_types.append(bpt)

    hosts = []
    for host_name in data['host'].unique():
        hst = await AbxHostService().get(name=host_name)
        if hst is None and host_name != '':
            hst_in = AbxHostCreate(name=host_name)
            hst = await AbxHostService().create(hst_in)
        hosts.append(hst)

    site_of_infections = []
    for soi_name in data['site_of_infection'].unique():
        soi = await AbxSiteOfInfectionService().get(name=soi_name)
        if soi is None and soi_name != '':
            soi_in = AbxSiteOfInfectionCreate(name=soi_name)
            soi = await AbxSiteOfInfectionService().create(soi_in)
        site_of_infections.append(soi)

    test_methods = []
    for tm_name in data['test_method'].unique():
        tm = await AbxTestMethodService().get(name=tm_name)
        if tm is None and tm_name != '':
            tm_in = AbxTestMethodCreate(name=tm_name)
            tm = await AbxTestMethodService().create(tm_in)
        test_methods.append(tm)

    for _, item in data.iterrows():
        bp_in = {
            key: item[key] \
            for key in AbxBreakpointCreate.model_fields \
            if key in item
        }
        gl = [x for x in guidelines if x and getattr(x, "name", None) == item["guidelines"]]
        bpt = [x for x in breakpoint_types if x and getattr(x, "name", None) == item["breakpoint_type"]]
        hst = [x for x in hosts if x and getattr(x, "name", None) == item["host"]]
        soi = [x for x in site_of_infections if x and getattr(x, "name", None) == item["site_of_infection"]]
        tm = [x for x in test_methods if x and getattr(x, "name", None) == item["test_method"]]
        bp_in = {
            **bp_in,
            "guideline_uid": gl[0].uid if gl else None,
            "breakpoint_type_uid": bpt[0].uid if bpt else None,
            "host_uid": hst[0].uid if hst else None,
            "site_of_infection_uid": soi[0].uid if soi else None,
            "test_method_uid": tm[0].uid if tm else None,
        }
        bp_schema = AbxBreakpointCreate(**bp_in)

        if not (await AbxBreakpointService().get(
                guideline_uid=bp_in["guideline_uid"],
                year=bp_in["year"],
                test_method_uid=bp_in["test_method_uid"],
                organism_code=bp_in["organism_code"],
                organism_code_type=bp_in["organism_code_type"],
                breakpoint_type_uid=bp_in["breakpoint_type_uid"],
                whonet_abx_code=bp_in["whonet_abx_code"],
                r=str(bp_in["r"]),
                i=str(bp_in["i"]),
                sdd=str(bp_in["sdd"]),
                s=str(bp_in["s"]),
                ecv_ecoff=str(bp_in["ecv_ecoff"]),
                ecv_ecoff_tentative=str(bp_in["ecv_ecoff_tentative"]),
                site_of_infection_uid=bp_in["site_of_infection_uid"],
                reference_sequence=str(bp_in["reference_sequence"]),
                reference_table=bp_in["reference_table"],
                host_uid=bp_in["host_uid"],
                potency=bp_in["potency"]
        )):
            await AbxBreakpointService().create(bp_schema)


async def seed_expected_resistance_phenotypes():
    logger.info("Setting up expected resistance phenotypes .....")
    data = _clean_df(get_whonet_dataframes("ExpectedResistancePhenotypes"), {})
    guidelines = await AbxGuidelineService().all()

    for _, item in data.iterrows():
        rt_in = {
            key: item[key] \
            for key in AbxExpResPhenotypeCreate.model_fields \
            if key in item
        }
        gl = [x for x in guidelines if x and getattr(x, "name", None) == item["guideline"]]
        rt_in = {
            **rt_in,
            "guideline_uid": gl[0].uid if gl else None,
        }
        bp_schema = AbxExpResPhenotypeCreate(**rt_in)

        if not (await AbxExpResPhenotypeService().get(
                guideline_uid=rt_in["guideline_uid"],
                reference_table=rt_in["reference_table"],
                organism_code=rt_in["organism_code"],
                organism_code_type=rt_in["organism_code_type"],
                exception_organism_code=rt_in["exception_organism_code"],
                exception_organism_code_type=rt_in["exception_organism_code_type"],
                abx_code=rt_in["abx_code"],
                abx_code_type=rt_in["abx_code_type"],
                antibiotic_exceptions=rt_in["antibiotic_exceptions"]
        )):
            await AbxExpResPhenotypeService().create(bp_schema)


async def seed_expert_interpretation_rules():
    logger.info("Setting up Expert Interpretation Rules .....")
    data = _clean_df(get_whonet_dataframes("ExpertInterpretationRules"), {})

    for _, item in data.iterrows():
        rt_in = {
            key: item[key] \
            for key in AbxExpertInterpretationRuleCreate.model_fields \
            if key in item
        }
        bp_schema = AbxExpertInterpretationRuleCreate(**rt_in)

        if not (await AbxExpertInterpretationRuleService().get(
                rule_code=rt_in["rule_code"],
                rule_criteria=rt_in["rule_criteria"],
        )):
            await AbxExpertInterpretationRuleService().create(bp_schema)


async def seed_qc_ranges():
    logger.info("Setting up qc ranges .....")
    data = _clean_df(get_whonet_dataframes("QCRanges"), {})
    guidelines = await AbxGuidelineService().all()

    mediums = []
    for med_name in data['medium'].unique():
        med = await AbxMediumService().get(name=med_name)
        if med is None and med_name != '':
            med_in = AbxMediumCreate(name=med_name)
            med = await AbxMediumService().create(med_in)
        mediums.append(med)

    for _, item in data.iterrows():
        rt_in = {
            key: item[key] \
            for key in AbxQCRangeCreate.model_fields \
            if key in item
        }
        gl = [x for x in guidelines if x and getattr(x, "name", None) == item["guideline"]]
        md = [x for x in mediums if x and getattr(x, "name", None) == item["medium"]]
        rt_in = {
            **rt_in,
            "guideline_uid": gl[0].uid if gl else None,
            "medium_uid": md[0].uid if md else None,
        }
        bp_schema = AbxQCRangeCreate(**rt_in)

        if not (await AbxQCRangeService().get(
                guideline_uid=rt_in["guideline_uid"],
                year=rt_in["year"],
                medium_uid=rt_in["medium_uid"],
                strain=rt_in["strain"],
                reference_table=rt_in["reference_table"],
                whonet_org_code=rt_in["whonet_org_code"],
                whonet_abx_code=rt_in["whonet_abx_code"],
                abx_test=rt_in["abx_test"],
                antibiotic=rt_in["antibiotic"],
                method=rt_in["method"],
                minimum=str(rt_in["minimum"]),
                maximum=str(rt_in["maximum"])
        )):
            await AbxQCRangeService().create(bp_schema)
