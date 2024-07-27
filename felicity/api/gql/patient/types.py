from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.client.types import ClientType
from felicity.api.gql.setup.types import (CountryType, DistrictType,
                                          ProvinceType)
from felicity.api.gql.types import PageInfo
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
    client: Optional[ClientType] = None
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
    district: Optional[DistrictType] = None
    province_uid: str | None = None
    province: Optional[ProvinceType] = None
    country_uid: str | None = None
    country: Optional[CountryType] = None
    identifications: List[Optional[PatientIdentificationType]] = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


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
