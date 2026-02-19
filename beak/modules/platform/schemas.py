from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TenantCreate(BaseModel):
    name: str
    slug: str
    schema_name: str
    admin_email: str | None = None
    primary_industry: str = "clinical"
    enabled_modules: list[str] = Field(default_factory=lambda: ["core", "clinical"])


class TenantOut(BaseModel):
    uid: str
    name: str
    slug: str
    schema_name: str
    status: str
    admin_email: str | None = None
    primary_industry: str = "clinical"
    enabled_modules: list[str] = Field(default_factory=lambda: ["core", "clinical"])
    module_state: dict = Field(default_factory=dict)
    provisioned_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
