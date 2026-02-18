from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr

from beak.apps.platform.enum import PlatformRole
from beak.apps.platform.iam_service import PlatformIAMService
from beak.apps.platform.services import TenantRegistryService, TenantProvisioningService

platform = APIRouter(tags=["platform"], prefix="/platform")
platform_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/platform/auth/login", scheme_name="PlatformJWT"
)


class PlatformLoginPayload(BaseModel):
    identifier: str
    password: str


class PlatformTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict[str, Any]


class ProvisionTenantPayload(BaseModel):
    name: str
    slug: str
    admin_email: EmailStr | None = None
    initial_lab_name: str | None = None


class AddLaboratoryPayload(BaseModel):
    name: str
    setup_name: str = "beak"


class TenantSummary(BaseModel):
    uid: str
    name: str
    slug: str
    schema_name: str
    status: str


async def get_current_platform_user(
    token: Annotated[str, Depends(platform_oauth2)],
) -> dict:
    user = await PlatformIAMService().decode_access_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid platform authentication token",
        )
    return user


def _require_platform_roles(
    user: dict,
    *,
    allowed: set[PlatformRole],
) -> None:
    roles = {r for r in user.get("roles", [])}
    if PlatformRole.ADMINISTRATOR.value in roles:
        return
    allowed_values = {r.value for r in allowed}
    if not (roles & allowed_values):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient platform role",
        )


@platform.post("/auth/login", response_model=PlatformTokenResponse)
async def platform_login(payload: PlatformLoginPayload) -> PlatformTokenResponse:
    service = PlatformIAMService()
    user = await service.authenticate(payload.identifier, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid platform credentials",
        )
    token = service.create_access_token(user)
    return PlatformTokenResponse(access_token=token, user=user)


@platform.get("/auth/me")
async def platform_me(
    current_user: Annotated[dict, Depends(get_current_platform_user)],
) -> dict[str, Any]:
    return current_user


@platform.post("/tenants")
async def provision_tenant(
    payload: ProvisionTenantPayload,
    current_user: Annotated[dict, Depends(get_current_platform_user)],
) -> Any:
    _require_platform_roles(
        current_user,
        allowed={PlatformRole.ADMINISTRATOR, PlatformRole.PROVISIONER},
    )
    try:
        return await TenantProvisioningService().provision(
            name=payload.name,
            slug=payload.slug,
            admin_email=payload.admin_email,
            initial_lab_name=payload.initial_lab_name,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@platform.get("/tenants", response_model=list[TenantSummary])
async def list_tenants(
    current_user: Annotated[dict, Depends(get_current_platform_user)],
    status_filter: str = Query(
        "all",
        alias="status",
        description="all|active|provisioning|failed",
    ),
) -> list[dict[str, Any]]:
    _require_platform_roles(
        current_user,
        allowed={
            PlatformRole.ADMINISTRATOR,
            PlatformRole.PROVISIONER,
            PlatformRole.SUPPORT,
            PlatformRole.BILLING,
        },
    )
    return await TenantRegistryService().list(status=status_filter)


@platform.post("/tenants/{slug}/migrate")
async def migrate_tenant(
    slug: str,
    current_user: Annotated[dict, Depends(get_current_platform_user)],
) -> dict[str, Any]:
    _require_platform_roles(
        current_user,
        allowed={PlatformRole.ADMINISTRATOR, PlatformRole.PROVISIONER},
    )
    return await TenantProvisioningService().migrate(slug=slug)


@platform.post("/tenants/{slug}/activate")
async def activate_tenant(
    slug: str,
    current_user: Annotated[dict, Depends(get_current_platform_user)],
    force: bool = Query(False),
) -> dict[str, Any]:
    _require_platform_roles(
        current_user,
        allowed={PlatformRole.ADMINISTRATOR, PlatformRole.PROVISIONER, PlatformRole.SUPPORT},
    )
    return await TenantProvisioningService().activate(slug=slug, force=force)


@platform.post("/tenants/{slug}/laboratories")
async def add_tenant_lab(
    slug: str,
    payload: AddLaboratoryPayload,
    current_user: Annotated[dict, Depends(get_current_platform_user)],
) -> dict[str, Any]:
    _require_platform_roles(
        current_user,
        allowed={PlatformRole.ADMINISTRATOR, PlatformRole.PROVISIONER, PlatformRole.SUPPORT},
    )
    return await TenantProvisioningService().add_laboratory(
        slug=slug,
        laboratory_name=payload.name,
        setup_name=payload.setup_name,
    )


@platform.delete("/tenants/failed")
async def cleanup_failed_tenants(
    current_user: Annotated[dict, Depends(get_current_platform_user)],
    slug: str | None = Query(None, description="optional failed tenant slug"),
    drop_schema: bool = Query(True),
) -> list[dict[str, Any]]:
    _require_platform_roles(
        current_user,
        allowed={PlatformRole.ADMINISTRATOR, PlatformRole.PROVISIONER},
    )
    return await TenantProvisioningService().cleanup_failed(slug=slug, drop_schema=drop_schema)
