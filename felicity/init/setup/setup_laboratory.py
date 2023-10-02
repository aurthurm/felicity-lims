import json
import logging
from typing import Optional

from apps.client import models as client_models
from apps.client import schemas as client_schemas
from apps.setup import models, schemas
from core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_geographies() -> None:
    logger.info("Setting up geographies (country, province, districts) .....")

    with open(settings.BASE_DIR + "/init/setup/data/country.json", "r") as json_file:
        data = json.load(json_file)

    country_data = data.get("country")
    c_name = country_data.get("name")
    c_code = country_data.get("code")

    if c_name and c_code:
        country: Optional[models.Country] = await models.Country.get(name=c_name)
        if not country:
            country_in = schemas.CountryCreate(name=c_name, code=c_code)
            country = await models.Country.create(country_in)

        provinces = country_data.get("provinces", [])
        if provinces:
            for _prv in provinces:
                p_name = _prv.get("name")
                p_code = _prv.get("code")
                if p_name and p_code:
                    province: Optional[models.Province] = await models.Province.get(
                        name=p_name, code=p_code
                    )
                    if not province:
                        pr_in = schemas.ProvinceCreate(
                            name=p_name, code=p_code, country_uid=country.uid
                        )
                        province = await models.Province.create(pr_in)

                    districts = _prv.get("districts", [])
                    if districts:
                        for _dist in districts:
                            d_name = _dist.get("name")
                            d_code = _dist.get("code")
                            if d_name and d_code:
                                district: Optional[
                                    models.District
                                ] = await models.District.get(name=d_name, code=d_code)
                                if not district:
                                    di_in = schemas.DistrictCreate(
                                        name=d_name,
                                        code=d_code,
                                        province_uid=province.uid,
                                    )
                                    await models.District.create(di_in)


async def create_clients() -> None:
    logger.info("Setting up clients and contacts .....")

    with open(settings.BASE_DIR + "/init/setup/data/clients.json", "r") as json_file:
        clients = json.load(json_file)

    for _cl in clients:
        district = await models.District.get(name=_cl.get("district"))
        if district:
            client = await client_models.Client.get(
                name=_cl.get("name"), district_uid=district.uid
            )
            if not client:
                cl_in = client_schemas.ClientCreate(
                    name=_cl.get("name"),
                    code=_cl.get("code"),
                    district_uid=district.uid,
                    province_uid=district.province_uid,
                )
                client = await client_models.Client.create(cl_in)

        contacts = await client_models.ClientContact.get(client_uid=client.uid)
        if not contacts:
            cc_in = client_schemas.ClientContactCreate(
                first_name="Sr", last_name="in Charge", client_uid=client.uid
            )
            await client_models.ClientContact.create(cc_in)


async def create_laboratory(name: str) -> None:
    logger.info("Setting up the laboratory .....")

    with open(settings.BASE_DIR + "/init/setup/data/laboratory.json", "r") as json_file:
        data = json.load(json_file)

    if not name:
        name = data.get("laboratory_name", "Felicity Labs")
    laboratory: Optional[models.Laboratory] = await models.Laboratory.get_by_setup_name(
        "felicity"
    )
    if not laboratory:
        lab_in = schemas.LaboratoryCreate(
            setup_name="felicity",
            lab_name=name,
            email=None,
            email_cc=None,
            mobile_phone=None,
            business_phone=None,
        )
        laboratory = await models.Laboratory.create(lab_in)

    departments = data.get("departments", [])
    if departments:
        for _dept in departments:
            department: Optional[models.Department] = await models.Department.get(
                name=_dept
            )
            if not department:
                d_in = schemas.DepartmentCreate(name=_dept, description=_dept)
                await models.Department.create(d_in)

    # Add Settings Page
    lab_settings = await models.LaboratorySetting.get(laboratory_uid=laboratory.uid)
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
        )
        await models.LaboratorySetting.create(setting_in)
