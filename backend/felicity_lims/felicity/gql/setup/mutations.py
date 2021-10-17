import inspect
import logging
from typing import Optional, Dict

import strawberry

from felicity.apps.setup import models, schemas
from felicity.gql.setup.types import (
    LaboratoryType,
    SupplierType,
    DepartmentType,
    InstrumentType,
    MethodType,
    CountryType,
    ProvinceType,
    DistrictType,
)
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class SetupMutations:
    @strawberry.mutation
    async def create_laboratory(self, info, lab_name: str, email: Optional[str] = None, email_cc: Optional[str] = None,  # noqa
                                mobile_phone: Optional[str] = None, business_phone: Optional[str] = None,  # noqa
                                lab_manager_uid: Optional[int] = None,  # noqa
                                setup_name: str = "felicity") -> LaboratoryType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not lab_name:
            raise Exception("Please Provide a name for your laboratory")

        # Enforce single site instance
        exists = await models.Laboratory.get(setup_name=setup_name)
        if exists:
            raise Exception(f"The laboratory named {exists.lab_name} is already using the setup name {setup_name}")

        incoming: Dict = dict()
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.LaboratoryCreate(**incoming)
        laboratory: models.Laboratory = await models.Laboratory.create(obj_in)
        return laboratory

    @strawberry.mutation
    async def update_laboratory(self, info, uid: int, lab_name: str, email: Optional[str] = None, email_cc: Optional[str] = None,  # noqa
                                mobile_phone: Optional[str] = None, business_phone: Optional[str] = None,  # noqa
                                lab_manager_uid: Optional[int] = None, setup_name: Optional[str] = None) -> LaboratoryType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identity update obj")

        laboratory = await models.Laboratory.get(uid=uid)
        if not laboratory:
            raise Exception(f"Laboratory with uid {uid} not found. Cannot update obj ...")

        obj_data = laboratory.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(laboratory, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.LaboratoryUpdate(**laboratory.to_dict())
        laboratory = await laboratory.update(obj_in)
        return laboratory

    @strawberry.mutation
    async def create_department(root, info, name: str, description: Optional[str] = None,  # noqa
                                code: Optional[str] = None) -> DepartmentType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Please Provide a name for your department")

        exists = await models.Department.get(name=name)
        if exists:
            raise Exception(f"A Department named {name} already exists")

        incoming: Dict = dict()
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.DepartmentCreate(**incoming)
        department: models.Department = await models.Department.create(obj_in)
        return department

    @strawberry.mutation
    async def update_department(self, info, uid: int, name: Optional[str] = None, description: Optional[str] = None,  # noqa
                                code: Optional[str] = None) -> DepartmentType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identity update obj")

        department = await models.Department.get(uid=uid)
        if not department:
            raise Exception(f"department with uid {uid} not found. Cannot update obj ...")

        obj_data = department.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(department, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DepartmentUpdate(**department.to_dict())
        department = await department.update(obj_in)
        return department

    @strawberry.mutation
    async def create_supplier(self, info, name: str, description: Optional[str] = None, code: Optional[str] = None) -> SupplierType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Please Provide a name for your supplier")

        exists = await models.Supplier.get(name=name)
        if exists:
            raise Exception(f"A Supplier named {name} already exists")

        incoming: Dict = dict()
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.SupplierCreate(**incoming)
        supplier: models.Supplier = await models.Supplier.create(obj_in)
        return supplier

    @strawberry.mutation
    async def update_supplier(self, info, uid: int, name: Optional[str] = None, description: Optional[str] = None,  # noqa
                              code: Optional[str] = None) -> SupplierType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identity update obj")

        supplier = await models.Supplier.get(uid=uid)
        if not supplier:
            raise Exception(f"supplier with uid {uid} not found. Cannot update obj ...")

        obj_data = supplier.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(supplier, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.SupplierUpdate(**supplier.to_dict())
        supplier = await supplier.update(obj_in)
        return supplier

    @strawberry.mutation
    async def create_instrument(self, info, name: str, keyword: str, description: Optional[str] = None,  # noqa
                                supplier_uid: Optional[int] = None) -> InstrumentType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name or not keyword:
            raise Exception("Provide a name and a unique keyword for your instrument")

        taken = await models.Instrument.get(keyword=keyword)
        if taken:
            raise Exception(f"Provided keyword already assigned to instrument {taken.name}")

        exists = await models.Instrument.get(name=name)
        if exists:
            raise Exception(f"An Instrument named {name} already exists")

        incoming: Dict = dict()
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCreate(**incoming)
        instrument: models.Instrument = await models.Instrument.create(obj_in)
        return instrument

    @strawberry.mutation
    async def update_instrument(self, info, uid: int, name: Optional[str] = None, keyword: Optional[str] = None,  # noqa
                                description: Optional[str] = None,  # noqa
                                supplier_uid: Optional[int] = None) -> InstrumentType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identity update obj")

        if 'keyword' in passed_args:
            keyword = passed_args.get('keyword')
            taken = await models.Instrument.get(keyword=keyword)
            if taken and not (str(uid) == str(taken.uid)):
                raise Exception(f"Provided keyword already assigned to instrument {taken.name}")

        instrument = await models.Instrument.get(uid=uid)
        if not instrument:
            raise Exception(f"instrument with uid {uid} not found. Cannot update obj ...")

        obj_data = instrument.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(instrument, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentUpdate(**instrument.to_dict())
        instrument = await instrument.update(obj_in)
        return instrument

    @strawberry.mutation
    async def create_method(self, info, name: str, keyword: Optional[str] = None, description: Optional[str] = None) -> MethodType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Provide a name for your method")

        if 'keyword' in passed_args:
            keyword = passed_args.get('keyword')
            taken = await models.Method.get(keyword=keyword)
            if taken:
                raise Exception(f"Provided keyword already assigned to Method {taken.name}")

        exists = await models.Method.get(name=name)
        if exists:
            raise Exception(f"A Method named {name} already exists")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.MethodCreate(**incoming)
        method: models.Method = await models.Method.create(obj_in)
        return method

    @strawberry.mutation
    async def update_method(self, info, uid: int, name: Optional[str] = None, keyword: Optional[str] = None,  # noqa
                            description: Optional[str] = None) -> MethodType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identity update obj")

        if 'keyword' in passed_args:
            keyword = passed_args.get('keyword')
            taken = await models.Method.get(keyword=keyword)
            if taken and not (str(uid) == str(taken.uid)):
                raise Exception(f"Provided keyword already assigned to method {taken.name}")

        method = await models.Method.get(uid=uid)
        if not method:
            raise Exception(f"method with uid {uid} not found. Cannot update obj ...")

        obj_data = method.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(method, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.MethodUpdate(**method.to_dict())
        method = await method.update(obj_in)
        return method

    @strawberry.mutation
    async def create_country(self, info, name: str, code: str, active: Optional[bool] = True) -> CountryType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Please Provide a name for the country")

        exists = await models.Country.get(code=code)
        if exists:
            raise Exception(f"Country code {code} already exists: This code belongs to {exists.name}")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.CountryCreate(**incoming)
        country: models.Country = await models.Country.create(obj_in)
        return country

    @strawberry.mutation
    async def update_country(self, info, uid: int, name: Optional[str] = None, code: Optional[str] = None,  # noqa
                             active: Optional[bool] = True) -> CountryType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identity update obj")

        country = await models.Country.get(uid=uid)
        if not country:
            raise Exception(f"country with uid {uid} not found. Cannot update obj ...")

        obj_data = country.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(country, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.CountryUpdate(**country.to_dict())
        country = await country.update(obj_in)
        return country

    @strawberry.mutation
    async def create_province(self, info, name: str, code: str, country_uid: Optional[int], email: Optional[str] = None,  # noqa
                              email_cc: Optional[str] = None, mobile_phone: Optional[str] = None,  # noqa
                              business_phone: Optional[str] = None, active: Optional[bool] = True) -> ProvinceType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Please Provide a name for the Province")

        exists = await models.Province.get(code=code)
        if exists:
            raise Exception(f"Province code {code} already belong to Province {exists.name}")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        province_in = schemas.ProvinceCreate(**incoming)
        province: models.Province = await models.Province.create(province_in)
        return province

    @strawberry.mutation
    async def update_province(self, info, uid: int, name: Optional[str] = None, code: Optional[str] = None, country_uid: Optional[int] = None,  # noqa
                     email: Optional[str] = None, email_cc: Optional[str] = None, # noqa
                     mobile_phone: Optional[str] = None, business_phone: Optional[str] = None,  # noqa
                     active: Optional[bool] = True) -> ProvinceType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identity update obj")

        province = await models.Province.get(uid=uid)
        if not province:
            raise Exception(f"province with id {uid} not found. Cannot update obj ...")

        obj_data = province.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(province, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.ProvinceUpdate(**province.to_dict())
        province = await province.update(obj_in)
        return province

    @strawberry.mutation
    async def create_district(self, info, name: str, code: Optional[str] = None, province_uid: Optional[int] = None,  # noqa
                              email: Optional[str] = None, email_cc: Optional[str] = None, mobile_phone: Optional[str] = None,  # noqa
                              business_phone: Optional[str] = None, active: Optional[bool] = True) -> DistrictType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Please Provide a name for the district")

        exists = await models.District.get(code=code)
        if exists:
            raise Exception(f"District code {code} already belong to district {exists.name}")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        district_in = schemas.DistrictCreate(**incoming)
        district: models.District = await models.District.create(district_in)
        return district

    @strawberry.mutation
    async def update_district(self, info, uid: int, name: str, code: Optional[str] = None, province_uid: Optional[int] = None,  # noqa
                              email: Optional[str] = None, email_cc: Optional[str] = None, mobile_phone: Optional[str] = None,  # noqa
                              business_phone: Optional[str] = None, active: Optional[bool] = True) -> DistrictType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identity update obj")

        district = await models.District.get(uid=uid)
        if not district:
            raise Exception(f"district with uid {uid} not found. Cannot update obj ...")

        obj_data = district.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(district, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DistrictUpdate(**district.to_dict())
        district = await district.update(obj_in)
        return district
