from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql import PageInfo
from felicity.api.gql.client.types import ClientType
from felicity.api.gql.user.types import UserType
from felicity.core.uid_gen import FelicityID
from felicity.api.gql.setup.types import DistrictType, ProvinceType, CountryType


@strawberry.type
class IdentificationType:
    uid: FelicityID
    name: str
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class PatientIdentificationType:
    uid: FelicityID
    patient_uid: str
    identification_uid: str
    identification: Optional[IdentificationType]
    value: str
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class PatientType:
    uid: FelicityID
    client_patient_id: str
    patient_id: str
    client_uid: FelicityID
    client: Optional[ClientType]
    first_name: Optional[str]
    middle_name: Optional[str]
    last_name: Optional[str]
    gender: Optional[str]
    age: Optional[int]
    date_of_birth: Optional[datetime]
    age_dob_estimated: bool
    phone_mobile: Optional[str]
    phone_home: Optional[str]
    consent_sms: bool
    email: Optional[str]
    internal_use: bool
    active: bool
    district_uid: Optional[FelicityID]
    district: Optional[DistrictType]
    province_uid: Optional[FelicityID]
    province: Optional[ProvinceType]
    country_uid: Optional[FelicityID]
    country: Optional[CountryType]
    identifications: List[Optional[PatientIdentificationType]]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


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
