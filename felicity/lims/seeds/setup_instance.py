import logging
from uuid import uuid4

from felicity.apps.client import schemas as client_schemas
from felicity.apps.client.services import ClientContactService, ClientService
from felicity.apps.setup import schemas
from felicity.apps.setup.services import (
    CountryService,
    DepartmentService,
    DistrictService,
    LaboratoryService,
    LaboratorySettingService,
    ProvinceService, OrganizationService, OrganizationSettingService,
)
from felicity.core.config import get_settings
from .data import get_seeds
from ...apps.setup.entities import Organization, Laboratory

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_geographies() -> None:
    logger.info("Setting up geographies (country, province, districts) .....")
    country_service = CountryService()
    province_service = ProvinceService()
    district_service = DistrictService()

    data = get_seeds("country")
    if not data:
        logger.error("Failed to load person seed data")
        return

    country_data = data.get("country")
    if not country_data:
        logger.error("Failed to load country_data seed data")
        return

    c_name = country_data.get("name")
    c_code = country_data.get("code")

    if c_name and c_code:
        country = await country_service.get(name=c_name)
        if not country:
            country_in = schemas.CountryCreate(name=c_name, code=c_code)
            country = await country_service.create(country_in)

        provinces = country_data.get("provinces", [])
        if provinces:
            for _prv in provinces:
                p_name = _prv.get("name")
                p_code = _prv.get("code")
                if p_name and p_code:
                    province = await province_service.get(name=p_name, code=p_code)
                    if not province:
                        pr_in = schemas.ProvinceCreate(
                            name=p_name, code=p_code, country_uid=country.uid
                        )
                        province = await province_service.create(pr_in)

                    districts = _prv.get("districts", [])
                    if districts:
                        for _dist in districts:
                            d_name = _dist.get("name")
                            d_code = _dist.get("code")
                            if d_name and d_code:
                                district = await district_service.get(
                                    name=d_name, code=d_code
                                )
                                if not district:
                                    di_in = schemas.DistrictCreate(
                                        name=d_name,
                                        code=d_code,
                                        province_uid=province.uid,
                                    )
                                    await district_service.create(di_in)


async def seed_clients() -> None:
    logger.info("Setting up clients and contacts .....")
    district_service = DistrictService()
    client_Service = ClientService()
    client_contact_Service = ClientContactService()

    data = get_seeds("clients")
    if not data:
        logger.error("Failed to load person seed data")
        return

    for _cl in data.get("clients", []):
        client = None
        district = await district_service.get(name=_cl.get("district"))
        if district:
            client = await client_Service.get(
                name=_cl.get("name"), district_uid=district.uid
            )
            if not client:
                cl_in = client_schemas.ClientCreate(
                    name=_cl.get("name"),
                    code=_cl.get("code"),
                    district_uid=district.uid,
                    province_uid=district.province_uid,
                )
                client = await client_Service.create(cl_in)

        contacts = await client_contact_Service.get(client_uid=client.uid)
        if not contacts:
            cc_in = client_schemas.ClientContactCreate(
                first_name="Sr",
                last_name="in Charge",
                client_uid=client.uid,
                email=f"{uuid4().hex}@dummy.inc",
                user_name=uuid4().hex,
            )
            try:
                await client_contact_Service.create(cc_in)
            except Exception:
                pass


async def seed_organisation(name: str | None = None) -> Organization | None:
    logger.info("Setting up the organisation .....")
    organization_service = OrganizationService()
    organization_setting_service = OrganizationSettingService()

    data = get_seeds("organization")
    if not data:
        logger.error("Failed to load organisation seed data")
        return None

    if not name:
        name = data.get("name", "Felicity Labs")

    setup_name = data.get("name", "felicity")
    organisation = await organization_service.get_by_setup_name(setup_name)
    if not organisation:
        lab_in = schemas.OrganizationCreate(
            setup_name=setup_name,
            name=name,
            email=None,
            email_cc=None,
            mobile_phone=None,
            business_phone=None,
        )
        organisation = await organization_service.create(lab_in)

    # Add Settings Page
    org_settings = await organization_setting_service.get(organization_uid=organisation.uid)
    if not org_settings:
        setting_in = schemas.OrganizationSettingCreate(
            organization_uid=organisation.uid,
            password_lifetime=90,
            inactivity_log_out=30,
            allow_billing=False,
            allow_auto_billing=True,
            currency="USD",
            payment_terms_days=30,
        )
        await organization_setting_service.create(setting_in)

    return organisation


async def seed_laboratory(name: str) -> Laboratory | None:
    logger.info("Setting up the laboratory .....")

    organization_service = OrganizationService()
    laboratory_service = LaboratoryService()
    laboratory_setting_service = LaboratorySettingService()
    department_service = DepartmentService()

    data = get_seeds("organization")
    if not data:
        logger.error("Failed to load organisation seed data")
        return None

    setup_name = data.get("name", "felicity")
    organisation = await organization_service.get_by_setup_name(setup_name)
    if not organisation:
        organisation = await seed_organisation()

    lab_data = data.get("laboratory")
    if not name:
        name = lab_data.get("name", "My First Laboratory")

    laboratories = await laboratory_service.get_all(organization_uid=organisation.uid)
    if organisation and not laboratories:
        lab_in = schemas.LaboratoryCreate(
            organization_uid=organisation.uid,
            name=name,
            email=None,
            email_cc=None,
            mobile_phone=None,
            business_phone=None,
        )
        laboratory = await laboratory_service.create(lab_in)

        departments = lab_data.get("departments", [])
        if departments:
            for _dept in departments:
                department = await department_service.get(name=_dept)
                if not department:
                    d_in = schemas.DepartmentCreate(name=_dept, description=_dept)
                    await department_service.create(d_in)

        # Add Settings Page
        lab_settings = await laboratory_setting_service.get(laboratory_uid=laboratory.uid)
        if not lab_settings:
            setting_in = schemas.LaboratorySettingCreate(
                laboratory_uid=laboratory.uid,
                allow_self_verification=False,
                allow_patient_registration=True,
                allow_sample_registration=True,
                allow_worksheet_creation=True,
                default_route="DASHBOARD",
                password_lifetime=90,
                inactivity_log_out=30,
                default_theme="LIGHT",
                auto_receive_samples=True,
                sticker_copies=2,
                allow_billing=False,
                allow_auto_billing=True,
                currency="USD",
            )
            await laboratory_setting_service.create(setting_in)
