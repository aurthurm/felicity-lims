import logging

from felicity.apps.client import schemas as client_schemas
from felicity.apps.client.services import ClientContactService, ClientService
from felicity.apps.setup import schemas
from felicity.apps.setup.services import (CountryService, DepartmentService,
                                          DistrictService, LaboratoryService,
                                          LaboratorySettingService,
                                          ProvinceService)
from felicity.core.config import get_settings

from .data import get_seeds

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_geographies() -> None:
    logger.info("Setting up geographies (country, province, districts) .....")
    country_service = CountryService()
    province_service = ProvinceService()
    district_service = DistrictService()

    data = get_seeds("country")

    country_data = data.get("country")
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

    clients = get_seeds("clients")

    for _cl in clients:
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
                first_name="Sr", last_name="in Charge", client_uid=client.uid
            )
            await client_contact_Service.create(cc_in)


async def seed_laboratory(name: str) -> None:
    logger.info("Setting up the laboratory .....")
    laboratory_service = LaboratoryService()
    laboratory_setting_service = LaboratorySettingService()
    department_service = DepartmentService()

    data = get_seeds("laboratory")

    if not name:
        name = data.get("laboratory_name", "Felicity Labs")
    laboratory = await laboratory_service.get_by_setup_name("felicity")
    if not laboratory:
        lab_in = schemas.LaboratoryCreate(
            setup_name=data.get("setup_name", "felicity"),
            lab_name=name,
            email=None,
            email_cc=None,
            mobile_phone=None,
            business_phone=None,
        )
        laboratory = await laboratory_service.create(lab_in)

    departments = data.get("departments", [])
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
