from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from felicity.gql import PageInfo
from felicity.gql.client.types import ClientType


@strawberry.type
class PatientType:
    uid: int
    client_patient_id: str
    patient_id: str
    client_uid: int
    client: Optional[ClientType]
    first_name: Optional[str]
    middle_name: Optional[str]
    last_name: Optional[str]
    gender: Optional[int]
    age: Optional[int]
    date_of_birth: Optional[datetime]
    age_dob_estimated: bool
    phone_mobile: Optional[str]
    phone_home: Optional[str]
    consent_sms: bool
    email: Optional[str]
    internal_use: bool
    active: bool


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
