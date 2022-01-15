import logging
from typing import Dict, Optional

import strawberry  # noqa
from felicity.apps.setup import models, schemas
from felicity.api.gql import OperationError
from felicity.api.gql.setup.types import (
    CountryType,
    DepartmentType,
    DistrictType,
    InstrumentType,
    LaboratoryType,
    MethodType,
    ProvinceType,
    SupplierType,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

LaboratoryResponse = strawberry.union(
    "LaboratoryResponse", (LaboratoryType, OperationError), description=""  # noqa
)

InstrumentResponse = strawberry.union(
    "InstrumentResponse", (InstrumentType, OperationError), description=""  # noqa
)
MethodResponse = strawberry.union(
    "MethodResponse", (MethodType, OperationError), description=""  # noqa
)
CountryResponse = strawberry.union(
    "CountryResponse", (CountryType, OperationError), description=""  # noqa
)
ProvinceResponse = strawberry.union(
    "ProvinceResponse", (ProvinceType, OperationError), description=""  # noqa
)
DistrictResponse = strawberry.union(
    "DistrictResponse", (DistrictType, OperationError), description=""  # noqa
)
SupplierResponse = strawberry.union(
    "SupplierResponse", (SupplierType, OperationError), description=""  # noqa
)
DepartmentResponse = strawberry.union(
    "DepartmentResponse", (DepartmentType, OperationError), description=""  # noqa
)


@strawberry.input
class LaboratoryInputType:
    lab_name: str
    setup_name: str = "felicity"
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    lab_manager_uid: Optional[int] = None


@strawberry.input
class DepartmentInputType:
    name: str
    description: Optional[str] = None
    code: Optional[str] = None


@strawberry.input
class SupplierInputType:
    name: str
    description: Optional[str] = None
    code: Optional[str] = None


@strawberry.input
class InstrumentInputType:
    name: str
    keyword: str
    description: Optional[str] = None
    supplier_uid: Optional[int] = None


@strawberry.input
class MethodInputType:
    name: str
    keyword: Optional[str] = None
    description: Optional[str] = None


@strawberry.input
class CountryInputType:
    name: str
    code: str
    active: Optional[bool] = True


@strawberry.input
class ProvinceInputType:
    name: Optional[str] = None
    code: Optional[str] = None
    country_uid: Optional[int] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    active: Optional[bool] = True


@strawberry.input
class DistrictInputType:
    name: str
    code: Optional[str] = None
    province_uid: Optional[int] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    active: Optional[bool] = True


@strawberry.type
class SetupMutations:
    @strawberry.mutation
    async def create_laboratory(
        self, info, payload: LaboratoryInputType
    ) -> LaboratoryResponse:  # noqa

        if not payload.lab_name:
            return OperationError(error="Please Provide a name for your laboratory")

        # Enforce single site instance
        exists = await models.Laboratory.get(setup_name=payload.setup_name)
        if exists:
            return OperationError(
                error=f"The laboratory named {exists.lab_name} is already using the setup name {payload.setup_name}"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.LaboratoryCreate(**incoming)
        laboratory: models.Laboratory = await models.Laboratory.create(obj_in)
        return LaboratoryType(**laboratory.marshal_simple())

    @strawberry.mutation
    async def update_laboratory(
        self, info, uid: int, payload: LaboratoryInputType
    ) -> LaboratoryResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        laboratory = await models.Laboratory.get(uid=uid)
        if not laboratory:
            return OperationError(
                error=f"Laboratory with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = laboratory.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(laboratory, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.LaboratoryUpdate(**laboratory.to_dict())
        laboratory = await laboratory.update(obj_in)
        return LaboratoryType(**laboratory.marshal_simple())

    @strawberry.mutation
    async def create_department(
        root, info, payload: DepartmentInputType
    ) -> DepartmentResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for your department")

        exists = await models.Department.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Department named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.DepartmentCreate(**incoming)
        department: models.Department = await models.Department.create(obj_in)
        return DepartmentType(**department.marshal_simple())

    @strawberry.mutation
    async def update_department(
        self, info, uid: int, payload: DepartmentInputType
    ) -> DepartmentResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        department = await models.Department.get(uid=uid)
        if not department:
            return OperationError(
                error=f"department with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = department.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(department, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DepartmentUpdate(**department.to_dict())
        department = await department.update(obj_in)
        return DepartmentType(**department.marshal_simple())

    @strawberry.mutation
    async def create_supplier(
        self, info, payload: SupplierInputType
    ) -> SupplierResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for your supplier")

        exists = await models.Supplier.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Supplier named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.SupplierCreate(**incoming)
        supplier: models.Supplier = await models.Supplier.create(obj_in)
        return SupplierType(**supplier.marshal_simple())

    @strawberry.mutation
    async def update_supplier(
        self, info, uid: int, payload: SupplierInputType
    ) -> SupplierResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        supplier = await models.Supplier.get(uid=uid)
        if not supplier:
            return OperationError(
                error=f"supplier with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = supplier.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(supplier, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.SupplierUpdate(**supplier.to_dict())
        supplier = await supplier.update(obj_in)
        return SupplierType(**supplier.marshal_simple())

    @strawberry.mutation
    async def create_instrument(
        self, info, payload: InstrumentInputType
    ) -> InstrumentResponse:  # noqa

        if not payload.name or not payload.keyword:
            return OperationError(
                error="Provide a name and a unique keyword for your instrument"
            )

        taken = await models.Instrument.get(keyword=payload.keyword)
        if taken:
            return OperationError(
                error=f"Provided keyword already assigned to instrument {taken.name}"
            )

        exists = await models.Instrument.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"An Instrument named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCreate(**incoming)
        instrument: models.Instrument = await models.Instrument.create(obj_in)
        return InstrumentType(**instrument.marshal_simple())

    @strawberry.mutation
    async def update_instrument(
        self, info, uid: int, payload: InstrumentInputType
    ) -> InstrumentResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        if "keyword" in payload.__dict__:
            taken = await models.Instrument.get(keyword=payload.keyword)
            if taken and not (str(uid) == str(taken.uid)):
                return OperationError(
                    error=f"Provided keyword already assigned to instrument {taken.name}"
                )

        instrument = await models.Instrument.get(uid=uid)
        if not instrument:
            return OperationError(
                error=f"instrument with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = instrument.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(instrument, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentUpdate(**instrument.to_dict())
        instrument = await instrument.update(obj_in)
        return InstrumentType(**instrument.marshal_simple())

    @strawberry.mutation
    async def create_method(
        self, info, payload: MethodInputType
    ) -> MethodResponse:  # noqa

        if not payload.name:
            return OperationError(error="Provide a name for your method")

        if "keyword" in payload.__dict__:
            taken = await models.Method.get(keyword=payload.keyword)
            if taken:
                return OperationError(
                    error=f"Provided keyword already assigned to Method {taken.name}"
                )

        exists = await models.Method.get(name=payload.name)
        if exists:
            return OperationError(error=f"A Method named {payload.name} already exists")

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.MethodCreate(**incoming)
        method: models.Method = await models.Method.create(obj_in)
        return MethodType(**method.marshal_simple())

    @strawberry.mutation
    async def update_method(
        self, info, uid: int, payload: MethodInputType
    ) -> MethodResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        if "keyword" in payload.__dict__:
            taken = await models.Method.get(keyword=payload.keyword)
            if taken and not (str(uid) == str(taken.uid)):
                return OperationError(
                    error=f"Provided keyword already assigned to method {taken.name}"
                )

        method = await models.Method.get(uid=uid)
        if not method:
            return OperationError(
                error=f"method with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = method.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(method, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.MethodUpdate(**method.to_dict())
        method = await method.update(obj_in)
        return MethodType(**method.marshal_simple())

    @strawberry.mutation
    async def create_country(
        self, info, payload: CountryInputType
    ) -> CountryResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for the country")

        exists = await models.Country.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Country code {payload.code} already exists: This code belongs to {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.CountryCreate(**incoming)
        country: models.Country = await models.Country.create(obj_in)
        return CountryType(**country.marshal_simple())

    @strawberry.mutation
    async def update_country(
        self, info, uid: int, payload: CountryInputType
    ) -> CountryResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        country = await models.Country.get(uid=uid)
        if not country:
            return OperationError(
                error=f"country with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = country.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(country, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.CountryUpdate(**country.to_dict())
        country = await country.update(obj_in)
        return CountryType(**country.marshal_simple())

    @strawberry.mutation
    async def create_province(
        self, info, payload: ProvinceInputType
    ) -> ProvinceResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please Provide a name for the Province")

        exists = await models.Province.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Province code {payload.code} already belong to Province {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        province_in = schemas.ProvinceCreate(**incoming)
        province: models.Province = await models.Province.create(province_in)
        return ProvinceType(**province.marshal_simple())

    @strawberry.mutation
    async def update_province(
        self, info, uid: int, payload: ProvinceInputType
    ) -> ProvinceResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        province = await models.Province.get(uid=uid)
        if not province:
            return OperationError(
                error=f"province with id {uid} not found. Cannot update obj ..."
            )

        obj_data = province.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(province, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.ProvinceUpdate(**province.to_dict())
        province = await province.update(obj_in)
        return ProvinceType(**province.marshal_simple())

    @strawberry.mutation
    async def create_district(
        self, info, payload: DistrictInputType
    ) -> DistrictResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for the district")

        exists = await models.District.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"District code {payload.code} already belong to district {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        district_in = schemas.DistrictCreate(**incoming)
        district: models.District = await models.District.create(district_in)
        return DistrictType(**district.marshal_simple())

    @strawberry.mutation
    async def update_district(
        self, info, uid: int, payload: DistrictInputType
    ) -> DistrictResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        district = await models.District.get(uid=uid)
        if not district:
            return OperationError(
                error=f"district with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = district.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(district, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DistrictUpdate(**district.to_dict())
        district = await district.update(obj_in)
        return DistrictType(**district.marshal_simple())
