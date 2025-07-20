"""
Tenant-aware middleware for FastAPI

This middleware extracts tenant context from JWT tokens and request headers,
then sets the context for the current request.
"""

import logging
import uuid

from fastapi import Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from starlette.middleware.base import BaseHTTPMiddleware

from felicity.core.config import get_settings
from felicity.core.tenant_context import TenantContext, set_tenant_context

logger = logging.getLogger(__name__)
settings = get_settings()


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
            request_id=request_id,
            ip_address=ip_address,
            user_agent=user_agent
        )

        try:
            # Extract tenant info from JWT token
            await self._extract_from_jwt(request, context)

            # Extract laboratory context from headers (for lab switching)
            self._extract_from_headers(request, context)

            # Set the context for this request
            set_tenant_context(context)

            # Add request ID to response headers for tracing
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id

            return response

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

        try:
            # Decode JWT token
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )

            # Extract user info
            context.user_uid = payload.get("sub")
            context.organization_uid = payload.get("organization_uid")

            # If lab context is in token (for single-lab users)
            if "laboratory_uid" in payload:
                context.laboratory_uid = payload.get("laboratory_uid")

        except JWTError as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            # Don't fail, just continue without context

    def _extract_from_headers(self, request: Request, context: TenantContext):
        """Extract laboratory context from custom headers"""

        # Allow frontend to specify current lab via header
        lab_header = request.headers.get("X-Laboratory-ID")
        if lab_header:
            context.laboratory_uid = lab_header

        # Allow organization override (for super admins)
        org_header = request.headers.get("X-Organization-ID")
        if org_header:
            context.organization_uid = org_header


class RequireTenantMiddleware(BaseHTTPMiddleware):
    """Middleware to ensure tenant context is required for protected routes"""

    def __init__(self, app, protected_paths: list[str] = None):
        super().__init__(app)
        self.protected_paths = protected_paths or ["/gql", "/api/v1"]

    async def dispatch(self, request: Request, call_next):
        """Check if tenant context is required for this path"""

        # Check if this is a protected path
        is_protected = any(
            request.url.path.startswith(path)
            for path in self.protected_paths
        )

        if is_protected:
            from felicity.core.tenant_context import get_tenant_context
            context = get_tenant_context()

            # Allow unauthenticated access to auth endpoints
            auth_endpoints = ["/auth", "/login", "/register"]
            is_auth_endpoint = any(
                endpoint in request.url.path
                for endpoint in auth_endpoints
            )

            if not is_auth_endpoint and (not context or not context.is_authenticated):
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Authentication required"}
                )

        return await call_next(request)
