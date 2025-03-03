from typing import List

from fastapi import Request, Response
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
from starlette.types import ASGIApp


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(
            self,
            app: ASGIApp,
            redis_pool=None,
            minute_limit: int = 100,
            hour_limit: int = 2000,
            exclude_paths: List[str] = None
    ):
        super().__init__(app)
        self.redis_pool = redis_pool
        self.minute_limit = minute_limit
        self.hour_limit = hour_limit
        self.exclude_paths = exclude_paths or ["/docs", "/redoc", "/openapi.json"]

    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for excluded paths
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        # Skip if redis pool is not available
        if not self.redis_pool:
            return await call_next(request)

        # Get client IP
        client_ip = get_remote_address(request)

        # Create rate limit keys for minute and hour
        minute_key = f"ratelimit:{client_ip}:minute"
        hour_key = f"ratelimit:{client_ip}:hour"

        # Use transaction to check and update rate limits
        async with self.redis_pool.transaction() as transaction:
            # Get current counts
            minute_count = await transaction.get(minute_key)
            hour_count = await transaction.get(hour_key)

            # Convert to integers or default to 0
            minute_count = int(minute_count.decode()) if minute_count else 0
            hour_count = int(hour_count.decode()) if hour_count else 0

            # Check if limits are exceeded
            if minute_count >= self.minute_limit:
                return Response(
                    content="Rate limit exceeded: too many requests per minute",
                    status_code=HTTP_429_TOO_MANY_REQUESTS,
                    headers={"Retry-After": "60"}
                )

            if hour_count >= self.hour_limit:
                return Response(
                    content="Rate limit exceeded: too many requests per hour",
                    status_code=HTTP_429_TOO_MANY_REQUESTS,
                    headers={"Retry-After": "3600"}
                )

            # Increment counters
            await transaction.incrby(minute_key, 1)
            await transaction.expire(minute_key, 60)  # Expire after 1 minute
            await transaction.incrby(hour_key, 1)
            await transaction.expire(hour_key, 3600)  # Expire after 1 hour

        # Process the request
        response = await call_next(request)

        # Add rate limit headers to response
        # We need the latest counts after processing
        async with self.redis_pool.transaction() as transaction:
            minute_count = await transaction.get(minute_key)
            hour_count = await transaction.get(hour_key)

            minute_count = int(minute_count.decode()) if minute_count else 0
            hour_count = int(hour_count.decode()) if hour_count else 0

        response.headers["X-RateLimit-Limit-Minute"] = str(self.minute_limit)
        response.headers["X-RateLimit-Remaining-Minute"] = str(max(0, self.minute_limit - minute_count))
        response.headers["X-RateLimit-Limit-Hour"] = str(self.hour_limit)
        response.headers["X-RateLimit-Remaining-Hour"] = str(max(0, self.hour_limit - hour_count))

        return response
