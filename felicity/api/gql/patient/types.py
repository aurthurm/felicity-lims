from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.client.types import ClientType
from felicity.api.gql.setup.types import CountryType, DistrictType, ProvinceType, LaboratoryType
from felicity.api.gql.types import PageInfo, JSONScalar
from felicity.api.gql.types.generic import StrawberryMapper
from felicity.api.gql.user.types import UserType


@strawberry.type
class IdentificationType:
    uid: str
    name: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class PatientIdentificationType:
    uid: str
    patient_uid: str
    identification_uid: str
    identification: Optional[IdentificationType] = None
    value: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class PatientType:
    uid: str
    client_patient_id: str
    patient_id: str
    client_uid: str
    first_name: str | None = None
    middle_name: str | None = None
    last_name: str | None = None
    gender: str | None = None
    age: int | None = None
    date_of_birth: datetime | None = None
    age_dob_estimated: bool
    phone_mobile: str | None = None
    phone_home: str | None = None
    consent_sms: bool
    email: str | None = None
    internal_use: bool
    active: bool
    district_uid: str | None = None
    province_uid: str | None = None
    country_uid: str | None = None
    identifications: Optional[List[PatientIdentificationType]] = None
    metadata_snapshot: JSONScalar | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None

    @strawberry.field
    async def client(self, info) -> ClientType | None:
        _client = self.metadata_snapshot.get("client")
        if not _client: return None
        _district = _client.get("district", None)
        _province = _client.get("province", None)
        _client["district"] = StrawberryMapper[DistrictType]().map(**_district) if _district else None
        _client["province"] = StrawberryMapper[ProvinceType]().map(**_province) if _province else None
        return StrawberryMapper[ClientType]().map(exclude=["contacts"], **_client)

    @strawberry.field
    async def district(self, info) -> DistrictType | None:
        _district = self.metadata_snapshot.get("district", None)
        if not _district: return None
        return StrawberryMapper[DistrictType]().map(**_district)

    @strawberry.field
    async def province(self, info) -> ProvinceType | None:
        _province = self.metadata_snapshot.get("province", None)
        if not _province: return None
        return StrawberryMapper[ProvinceType]().map(**_province)

    @strawberry.field
    async def country(self, info) -> CountryType | None:
        _country = self.metadata_snapshot.get("district", None)
        if not _country: return None
        return StrawberryMapper[CountryType]().map(**_country)


#  relay paginations
@strawberry.type
class PatientEdge:
    cursor: str
    node: PatientType


@strawberry.type
class PatientCursorPage:
    page_info: PageInfo
    edges: Optional[List[PatientEdge]] = None
    items: Optional[List[PatientType]] = None
    total_count: int
