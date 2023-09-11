from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql.types import PageInfo
from api.gql.client.types import ClientType
from api.gql.setup.types import CountryType, DistrictType, ProvinceType
from api.gql.user.types import UserType


@strawberry.type
class IdentificationType:
    uid: str
    name: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class PatientIdentificationType:
    uid: str
    patient_uid: str
    identification_uid: str
    identification: Optional[IdentificationType]
    value: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class PatientType:
    uid: str
    client_patient_id: str
    patient_id: str
    client_uid: str
    client: Optional[ClientType]
    first_name: str | None
    middle_name: str | None
    last_name: str | None
    gender: str | None
    age: int | None
    date_of_birth: datetime | None
    age_dob_estimated: bool
    phone_mobile: str | None
    phone_home: str | None
    consent_sms: bool
    email: str | None
    internal_use: bool
    active: bool
    district_uid: str | None
    district: Optional[DistrictType]
    province_uid: str | None
    province: Optional[ProvinceType]
    country_uid: str | None
    country: Optional[CountryType]
    identifications: List[Optional[PatientIdentificationType]]
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


#  relay paginations
@strawberry.type
class PatientEdge:
    cursor: str
    node: PatientType


@strawberry.type
class PatientCursorPage:
    page_info: PageInfo
    edges: Optional[List[PatientEdge]]
    items: Optional[List[PatientType]]
    total_count: int
