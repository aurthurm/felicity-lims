from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TenantCreate(BaseModel):
    name: str
    slug: str
    schema_name: str
    admin_email: str | None = None


class TenantOut(BaseModel):
    uid: str
    name: str
    slug: str
    schema_name: str
    status: str
    admin_email: str | None = None
    provisioned_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
