import strawberry

from beak.api.gql.auth import auth_from_info
from beak.api.gql.types import OperationError
from beak.modules.platform.services import TenantProvisioningService


@strawberry.type
class TenantProvisionType:
    uid: str
    name: str
    slug: str
    schema_name: str
    status: str


TenantProvisionResponse = strawberry.union(
    "TenantProvisionResponse", (TenantProvisionType, OperationError), description=""
)


@strawberry.type
class PlatformMutations:
    @strawberry.mutation
    async def provision_tenant(
            self,
            info,
            name: str,
            slug: str,
            admin_email: str | None = None,
            initial_lab_name: str | None = None,
            primary_industry: str = "clinical",
            enabled_modules: list[str] | None = None,
    ) -> TenantProvisionResponse:
        user = await auth_from_info(info)
        if not user:
            return OperationError(error="Authentication required")
        if not user.is_superuser:
            return OperationError(error="Superuser required")

        try:
            tenant = await TenantProvisioningService().provision(
                name=name,
                slug=slug,
                admin_email=admin_email,
                initial_lab_name=initial_lab_name,
                primary_industry=primary_industry,
                enabled_modules=enabled_modules,
            )
            return TenantProvisionType(
                uid=tenant["uid"],
                name=tenant["name"],
                slug=tenant["slug"],
                schema_name=tenant["schema_name"],
                status=tenant["status"],
            )
        except ValueError as exc:
            return OperationError(error=str(exc))
        except Exception as exc:  # pragma: no cover - surfaced to API clients
            return OperationError(error=f"Provisioning failed: {exc}")
