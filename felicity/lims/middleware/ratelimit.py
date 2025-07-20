"""
Tenant-aware Rate Limit Middleware

Enhanced version of RateLimitMiddleware that leverages tenant context
for per-lab, per-user, and per-organization rate limiting.
"""

from typing import List, Dict

from redis.asyncio import Redis
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
from starlette.types import ASGIApp

from felicity.core.tenant_context import get_tenant_context


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Enhanced Rate Limit Middleware with tenant awareness.

    Improvements over original:
    - ✅ Per-lab rate limiting (isolation between labs)
    - ✅ Per-user rate limiting (user-specific limits)
    - ✅ Per-organization rate limiting (org-wide limits)
    - ✅ Combined IP + tenant rate limiting
    - ✅ Different limits for different user types
    - ✅ Lab-specific rate limit policies
    """

    def __init__(
            self,
            app: ASGIApp,
            redis_client: Redis = None,
            # Traditional IP-based limits
            ip_minute_limit: int = 100,
            ip_hour_limit: int = 2000,
            # 🆕 User-based limits
            user_minute_limit: int = 200,
            user_hour_limit: int = 5000,
            # 🆕 Lab-based limits (per lab)
            lab_minute_limit: int = 1000,
            lab_hour_limit: int = 20000,
            # 🆕 Organization-based limits (across all labs)
            org_hour_limit: int = 50000,
            org_day_limit: int = 500000,
            # 🆕 Admin user overrides
            admin_multiplier: float = 3.0,
            exclude_paths: List[str] = None
    ):
        super().__init__(app)
        self.redis_client = redis_client

        # IP-based limits (original functionality)
        self.ip_minute_limit = ip_minute_limit
        self.ip_hour_limit = ip_hour_limit

        # 🆕 Tenant-aware limits
        self.user_minute_limit = user_minute_limit
        self.user_hour_limit = user_hour_limit
        self.lab_minute_limit = lab_minute_limit
        self.lab_hour_limit = lab_hour_limit
        self.org_hour_limit = org_hour_limit
        self.org_day_limit = org_day_limit

        # 🆕 Special user handling
        self.admin_multiplier = admin_multiplier

        self.exclude_paths = exclude_paths or ["/docs", "/redoc", "/openapi.json", "/health"]

    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for excluded paths
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        # Skip if redis client is not available
        if not self.redis_client:
            return await call_next(request)

        # Get traditional IP
        client_ip = get_remote_address(request)

        # 🆕 Get tenant context
        tenant_context = get_tenant_context()

        # 🆕 ENHANCED RATE LIMITING STRATEGY
        rate_limit_checks = await self._perform_comprehensive_rate_limiting(
            client_ip, tenant_context, request
        )

        # Check if any rate limit was exceeded
        for check_result in rate_limit_checks:
            if check_result["exceeded"]:
                return Response(
                    content=check_result["message"],
                    status_code=HTTP_429_TOO_MANY_REQUESTS,
                    headers=check_result["headers"]
                )

        # Process the request
        response = await call_next(request)

        # 🆕 Add comprehensive rate limit headers
        await self._add_rate_limit_headers(response, client_ip, tenant_context)

        return response

    async def _perform_comprehensive_rate_limiting(
            self, client_ip: str, tenant_context, request: Request
    ) -> List[Dict]:
        """
        Perform multi-layered rate limiting:
        1. IP-based (traditional)
        2. User-based (if authenticated)
        3. Lab-based (if lab context available)
        4. Organization-based (if org context available)
        """

        rate_checks = []

        # 1. 🔴 IP-BASED RATE LIMITING (Original)
        ip_check = await self._check_ip_rate_limit(client_ip)
        rate_checks.append(ip_check)

        if tenant_context:
            # 2. 🔵 USER-BASED RATE LIMITING
            if tenant_context.user_uid:
                user_check = await self._check_user_rate_limit(
                    tenant_context.user_uid, request
                )
                rate_checks.append(user_check)

            # 3. 🟢 LAB-BASED RATE LIMITING
            if tenant_context.laboratory_uid:
                lab_check = await self._check_lab_rate_limit(
                    tenant_context.laboratory_uid
                )
                rate_checks.append(lab_check)

            # 4. 🟡 ORGANIZATION-BASED RATE LIMITING
            if tenant_context.organization_uid:
                org_check = await self._check_org_rate_limit(
                    tenant_context.organization_uid
                )
                rate_checks.append(org_check)

        return rate_checks

    async def _check_ip_rate_limit(self, client_ip: str) -> Dict:
        """Traditional IP-based rate limiting"""

        minute_key = f"ratelimit:ip:{client_ip}:minute"
        hour_key = f"ratelimit:ip:{client_ip}:hour"

        async with self.redis_client.pipeline(transaction=True) as pipe:
            await pipe.get(minute_key)
            await pipe.get(hour_key)
            results = await pipe.execute()

            minute_count = int(results[0]) if results[0] else 0
            hour_count = int(results[1]) if results[1] else 0

            # Check limits
            if minute_count >= self.ip_minute_limit:
                return {
                    "exceeded": True,
                    "message": f"IP rate limit exceeded: {minute_count}/{self.ip_minute_limit} requests per minute",
                    "headers": {"Retry-After": "60", "X-RateLimit-Type": "IP-Minute"}
                }

            if hour_count >= self.ip_hour_limit:
                return {
                    "exceeded": True,
                    "message": f"IP rate limit exceeded: {hour_count}/{self.ip_hour_limit} requests per hour",
                    "headers": {"Retry-After": "3600", "X-RateLimit-Type": "IP-Hour"}
                }

            # Increment counters
            await pipe.incrby(minute_key, 1)
            await pipe.expire(minute_key, 60)
            await pipe.incrby(hour_key, 1)
            await pipe.expire(hour_key, 3600)
            await pipe.execute()

        return {"exceeded": False, "ip_minute": minute_count, "ip_hour": hour_count}

    async def _check_user_rate_limit(self, user_uid: str, request: Request) -> Dict:
        """🆕 User-based rate limiting with admin detection"""

        # 🆕 Check if user is admin (you can implement admin detection logic)
        is_admin = await self._is_admin_user(user_uid)

        # 🆕 Apply admin multiplier
        user_minute_limit = int(self.user_minute_limit * self.admin_multiplier) if is_admin else self.user_minute_limit
        user_hour_limit = int(self.user_hour_limit * self.admin_multiplier) if is_admin else self.user_hour_limit

        minute_key = f"ratelimit:user:{user_uid}:minute"
        hour_key = f"ratelimit:user:{user_uid}:hour"

        async with self.redis_client.pipeline(transaction=True) as pipe:
            await pipe.get(minute_key)
            await pipe.get(hour_key)
            results = await pipe.execute()

            minute_count = int(results[0]) if results[0] else 0
            hour_count = int(results[1]) if results[1] else 0

            # Check limits
            if minute_count >= user_minute_limit:
                return {
                    "exceeded": True,
                    "message": f"User rate limit exceeded: {minute_count}/{user_minute_limit} requests per minute",
                    "headers": {"Retry-After": "60", "X-RateLimit-Type": "User-Minute"}
                }

            if hour_count >= user_hour_limit:
                return {
                    "exceeded": True,
                    "message": f"User rate limit exceeded: {hour_count}/{user_hour_limit} requests per hour",
                    "headers": {"Retry-After": "3600", "X-RateLimit-Type": "User-Hour"}
                }

            # Increment counters
            await pipe.incrby(minute_key, 1)
            await pipe.expire(minute_key, 60)
            await pipe.incrby(hour_key, 1)
            await pipe.expire(hour_key, 3600)
            await pipe.execute()

        return {
            "exceeded": False,
            "user_minute": minute_count,
            "user_hour": hour_count,
            "is_admin": is_admin
        }

    async def _check_lab_rate_limit(self, lab_uid: str) -> Dict:
        """🆕 Laboratory-based rate limiting"""

        minute_key = f"ratelimit:lab:{lab_uid}:minute"
        hour_key = f"ratelimit:lab:{lab_uid}:hour"

        async with self.redis_client.pipeline(transaction=True) as pipe:
            await pipe.get(minute_key)
            await pipe.get(hour_key)
            results = await pipe.execute()

            minute_count = int(results[0]) if results[0] else 0
            hour_count = int(results[1]) if results[1] else 0

            # Check limits
            if minute_count >= self.lab_minute_limit:
                return {
                    "exceeded": True,
                    "message": f"Laboratory rate limit exceeded: {minute_count}/{self.lab_minute_limit} requests per minute",
                    "headers": {"Retry-After": "60", "X-RateLimit-Type": "Lab-Minute"}
                }

            if hour_count >= self.lab_hour_limit:
                return {
                    "exceeded": True,
                    "message": f"Laboratory rate limit exceeded: {hour_count}/{self.lab_hour_limit} requests per hour",
                    "headers": {"Retry-After": "3600", "X-RateLimit-Type": "Lab-Hour"}
                }

            # Increment counters
            await pipe.incrby(minute_key, 1)
            await pipe.expire(minute_key, 60)
            await pipe.incrby(hour_key, 1)
            await pipe.expire(hour_key, 3600)
            await pipe.execute()

        return {"exceeded": False, "lab_minute": minute_count, "lab_hour": hour_count}

    async def _check_org_rate_limit(self, org_uid: str) -> Dict:
        """🆕 Organization-based rate limiting"""

        hour_key = f"ratelimit:org:{org_uid}:hour"
        day_key = f"ratelimit:org:{org_uid}:day"

        async with self.redis_client.pipeline(transaction=True) as pipe:
            await pipe.get(hour_key)
            await pipe.get(day_key)
            results = await pipe.execute()

            hour_count = int(results[0]) if results[0] else 0
            day_count = int(results[1]) if results[1] else 0

            # Check limits
            if hour_count >= self.org_hour_limit:
                return {
                    "exceeded": True,
                    "message": f"Organization rate limit exceeded: {hour_count}/{self.org_hour_limit} requests per hour",
                    "headers": {"Retry-After": "3600", "X-RateLimit-Type": "Org-Hour"}
                }

            if day_count >= self.org_day_limit:
                return {
                    "exceeded": True,
                    "message": f"Organization rate limit exceeded: {day_count}/{self.org_day_limit} requests per day",
                    "headers": {"Retry-After": "86400", "X-RateLimit-Type": "Org-Day"}
                }

            # Increment counters
            await pipe.incrby(hour_key, 1)
            await pipe.expire(hour_key, 3600)
            await pipe.incrby(day_key, 1)
            await pipe.expire(day_key, 86400)  # 24 hours
            await pipe.execute()

        return {"exceeded": False, "org_hour": hour_count, "org_day": day_count}

    async def _is_admin_user(self, user_uid: str) -> bool:
        """
        🆕 Detect if user is admin for higher rate limits

        You can implement this based on your user system:
        - Check user roles in database
        - Check Redis cache for user permissions
        - Check JWT token claims
        """

        # TODO: Implement admin detection logic
        # For now, return False but you can enhance this

        # Example implementation ideas:
        # 1. Check user groups/roles in database
        # 2. Check cached permissions in Redis
        # 3. Check JWT token for admin claims

        # admin_key = f"user:admin:{user_uid}"
        # is_admin = await self.redis_client.get(admin_key)
        # return is_admin == "true"

        return False

    async def _add_rate_limit_headers(self, response: Response, client_ip: str, tenant_context):
        """🆕 Add comprehensive rate limit headers"""

        # Get current counts for headers
        headers_data = {}

        # IP-based headers
        ip_minute_key = f"ratelimit:ip:{client_ip}:minute"
        ip_hour_key = f"ratelimit:ip:{client_ip}:hour"

        async with self.redis_client.pipeline(transaction=True) as pipe:
            await pipe.get(ip_minute_key)
            await pipe.get(ip_hour_key)
            results = await pipe.execute()

            ip_minute_count = int(results[0]) if results[0] else 0
            ip_hour_count = int(results[1]) if results[1] else 0

            # Traditional IP headers
            response.headers["X-RateLimit-IP-Limit-Minute"] = str(self.ip_minute_limit)
            response.headers["X-RateLimit-IP-Remaining-Minute"] = str(max(0, self.ip_minute_limit - ip_minute_count))
            response.headers["X-RateLimit-IP-Limit-Hour"] = str(self.ip_hour_limit)
            response.headers["X-RateLimit-IP-Remaining-Hour"] = str(max(0, self.ip_hour_limit - ip_hour_count))

        # 🆕 Tenant-aware headers
        if tenant_context:
            if tenant_context.user_uid:
                user_minute_key = f"ratelimit:user:{tenant_context.user_uid}:minute"
                user_hour_key = f"ratelimit:user:{tenant_context.user_uid}:hour"

                async with self.redis_client.pipeline(transaction=True) as pipe:
                    await pipe.get(user_minute_key)
                    await pipe.get(user_hour_key)
                    user_results = await pipe.execute()

                    user_minute_count = int(user_results[0]) if user_results[0] else 0
                    user_hour_count = int(user_results[1]) if user_results[1] else 0

                    response.headers["X-RateLimit-User-Limit-Minute"] = str(self.user_minute_limit)
                    response.headers["X-RateLimit-User-Remaining-Minute"] = str(
                        max(0, self.user_minute_limit - user_minute_count))
                    response.headers["X-RateLimit-User-Limit-Hour"] = str(self.user_hour_limit)
                    response.headers["X-RateLimit-User-Remaining-Hour"] = str(
                        max(0, self.user_hour_limit - user_hour_count))

            if tenant_context.laboratory_uid:
                response.headers["X-RateLimit-Lab-ID"] = tenant_context.laboratory_uid

            if tenant_context.organization_uid:
                response.headers["X-RateLimit-Org-ID"] = tenant_context.organization_uid
