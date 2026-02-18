"""
Tenant-aware middleware for FastAPI

This middleware extracts tenant context from JWT tokens and request headers,
then sets the context for the current request.
"""

import logging
import time
import uuid

from fastapi import Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from starlette.middleware.base import BaseHTTPMiddleware

from beak.apps.setup.services import LaboratoryService
from beak.apps.user.services import UserService
from beak.apps.platform.services import TenantRegistryService
from beak.core.config import get_settings
from beak.core.tenant_context import TenantContext, set_tenant_context
from beak.database.tenant_engine_registry import get_tenant_session_factory

logger = logging.getLogger(__name__)
settings = get_settings()
_TENANT_CACHE: dict[str, tuple[str, float]] = {}
_TENANT_CACHE_TTL_SECONDS = 300


class TenantContextMiddleware(BaseHTTPMiddleware):
    """Middleware to extract and set tenant context from requests"""

    async def dispatch(self, request: Request, call_next):
        """Process request and set tenant context"""

        # Generate unique request ID for tracking
        request_id = str(uuid.uuid4())

        # Extract IP and User-Agent
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

        # Initialize context
        context = TenantContext(
            request_id=request_id, ip_address=ip_address, user_agent=user_agent
        )

        try:
            # Extract tenant info from JWT token
            await self._extract_from_jwt(request, context)
            await self._resolve_tenant_schema(request, context)
            if context.laboratory_uid:
                await self._validate_lab_membership(
                    context, context.laboratory_uid
                )

            # Extract laboratory context from headers (for lab switching)
            await self._extract_from_headers(request, context)

            # Set the context for this request
            set_tenant_context(context)

            # Add request ID to response headers for tracing
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id

            return response

        except JWTError as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            return JSONResponse(
                status_code=401, content={"detail": "Invalid authentication token"}
            )
        except PermissionError as e:
            logger.warning(f"Tenant context rejected: {str(e)}")
            return JSONResponse(status_code=403, content={"detail": str(e)})
        except Exception as e:
            logger.error(f"Error in tenant middleware: {str(e)}")
            # Don't fail the request, just log the error
            set_tenant_context(context)
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            return response

    async def _extract_from_jwt(self, request: Request, context: TenantContext):
        """Extract user and organization from JWT token"""

        # Look for JWT token in Authorization header
        authorization = request.headers.get("Authorization")
        if not authorization or not authorization.startswith("Bearer "):
            return

        token = authorization.split(" ")[1]

        # Decode JWT token
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )

        # Extract user info
        context.user_uid = payload.get("sub")
        context.organization_uid = payload.get("organization_uid")
        if "tenant_slug" in payload and not context.tenant_slug:
            context.tenant_slug = payload.get("tenant_slug")

        # If lab context is in token (for single-lab users)
        if "laboratory_uid" in payload:
            context.laboratory_uid = payload.get("laboratory_uid")

    async def _extract_from_headers(self, request: Request, context: TenantContext):
        """Extract laboratory context from custom headers"""

        # Allow frontend to specify current lab via header
        lab_header = request.headers.get("X-Laboratory-ID")
        if lab_header:
            await self._validate_lab_membership(context, lab_header)
            context.laboratory_uid = lab_header

        # Allow organization override (for super admins)
        org_header = request.headers.get("X-Organization-ID")
        if org_header:
            await self._validate_org_override(context, org_header)
            context.organization_uid = org_header

    async def _resolve_tenant_schema(
            self, request: Request, context: TenantContext
    ) -> None:
        path = request.url.path
        if not any(path.startswith(prefix) for prefix in settings.TENANT_REQUIRED_PATH_PREFIXES):
            return
        if any(path.startswith(public_path) for public_path in settings.TENANT_PUBLIC_PATHS):
            return

        tenant_slug = request.headers.get(settings.TENANT_HEADER_NAME) or context.tenant_slug
        if not tenant_slug:
            return

        context.tenant_slug = tenant_slug
        schema_name = await self._cached_schema_lookup(tenant_slug)
        if not schema_name:
            tenant = await TenantRegistryService().get_by_slug(tenant_slug)
            if not tenant or tenant.get("status") != "active":
                raise PermissionError(f"Tenant '{tenant_slug}' not active")
            schema_name = tenant["schema_name"]
            self._cache_schema(tenant_slug, schema_name)

        context.schema_name = schema_name
        # Warm session factory lazily for this tenant.
        get_tenant_session_factory(schema_name)

    async def _cached_schema_lookup(self, tenant_slug: str) -> str | None:
        record = _TENANT_CACHE.get(tenant_slug)
        if not record:
            return None
        schema_name, expires_at = record
        if expires_at <= time.time():
            _TENANT_CACHE.pop(tenant_slug, None)
            return None
        return schema_name

    def _cache_schema(self, tenant_slug: str, schema_name: str) -> None:
        _TENANT_CACHE[tenant_slug] = (
            schema_name,
            time.time() + _TENANT_CACHE_TTL_SECONDS,
        )

    async def _validate_lab_membership(
            self, context: TenantContext, laboratory_uid: str
    ) -> None:
        if not context.user_uid:
            raise PermissionError("Laboratory context requires authentication")

        user = await UserService().get(uid=context.user_uid)
        if not user:
            raise PermissionError("User not found for laboratory context")

        if not user.is_superuser:
            lab_uids = await UserService().get_laboratories_by_user(context.user_uid)
            if laboratory_uid not in (lab_uids or []):
                raise PermissionError("User not assigned to the requested laboratory")

        laboratory = await LaboratoryService().get(uid=laboratory_uid)
        if not laboratory:
            raise PermissionError("Requested laboratory does not exist")

        if (
                context.organization_uid
                and laboratory.organization_uid != context.organization_uid
        ):
            raise PermissionError("Laboratory does not belong to your organization")

    async def _validate_org_override(
            self, context: TenantContext, organization_uid: str
    ) -> None:
        if not context.user_uid:
            raise PermissionError("Organization override requires authentication")

        if context.organization_uid and context.organization_uid != organization_uid:
            user = await UserService().get(uid=context.user_uid)
            if not user or not user.is_superuser:
                raise PermissionError("Organization override not permitted")


# example middleware  - not required
class RequireTenantMiddleware(BaseHTTPMiddleware):
    """Middleware to ensure tenant context is required for protected routes"""

    def __init__(
            self,
            app,
            protected_paths: list[str] = None,
            public_paths: list[str] = None,
    ):
        super().__init__(app)
        self.protected_paths = protected_paths or ["/gql", "/api/v1"]
        self.public_paths = public_paths or [
            "/api/v1/setup/installation",
            "/api/v1/version",
            "/api/v1/version/updates",
        ]

    async def dispatch(self, request: Request, call_next):
        """Check if tenant context is required for this path"""

        if request.method == "OPTIONS":
            return await call_next(request)

        if any(request.url.path.startswith(path) for path in self.public_paths):
            return await call_next(request)

        # Check if this is a protected path
        is_protected = any(
            request.url.path.startswith(path) for path in self.protected_paths
        )

        if is_protected:
            from beak.core.tenant_context import get_tenant_context

            context = get_tenant_context()

            # Allow unauthenticated access to auth endpoints
            auth_endpoints = ["/auth", "/login", "/register"]
            is_auth_endpoint = any(
                endpoint in request.url.path for endpoint in auth_endpoints
            )

            if not is_auth_endpoint and (not context or not context.is_authenticated):
                logger.info(f"Unauthorized access to: {request.url.path}")
                logger.info(f"Unauthorized no context: {context}")

                return JSONResponse(
                    status_code=401, content={"detail": "Authentication required"}
                )

        return await call_next(request)
