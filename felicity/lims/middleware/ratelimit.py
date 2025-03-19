from typing import List

from redis.asyncio import Redis
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
from starlette.types import ASGIApp


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(
            self,
            app: ASGIApp,
            redis_client: Redis = None,
            minute_limit: int = 100,
            hour_limit: int = 2000,
            exclude_paths: List[str] = None
    ):
        super().__init__(app)
        self.redis_client = redis_client
        self.minute_limit = minute_limit
        self.hour_limit = hour_limit
        self.exclude_paths = exclude_paths or ["/docs", "/redoc", "/openapi.json"]

    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for excluded paths
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        # Skip if redis client is not available
        if not self.redis_client:
            return await call_next(request)

        client_ip = get_remote_address(request)

        # Create rate limit keys for minute and hour
        minute_key = f"ratelimit:{client_ip}:minute"
        hour_key = f"ratelimit:{client_ip}:hour"

        # Use a pipeline (atomic transaction-like behavior)
        async with self.redis_client.pipeline(transaction=True) as pipe:
            # Fetch current counts
            await pipe.get(minute_key)
            await pipe.get(hour_key)
            results = await pipe.execute()

            # Convert to integers or default to 0
            minute_count = int(results[0]) if results[0] else 0
            hour_count = int(results[1]) if results[1] else 0

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

            # Increment counters and set expiry
            await pipe.incrby(minute_key, 1)
            await pipe.expire(minute_key, 60)  # Expire after 1 minute
            await pipe.incrby(hour_key, 1)
            await pipe.expire(hour_key, 3600)  # Expire after 1 hour

            await pipe.execute()

        # Process the request
        response = await call_next(request)

        # Get updated counts (optional, for headers)
        async with self.redis_client.pipeline(transaction=True) as pipe:
            await pipe.get(minute_key)
            await pipe.get(hour_key)
            counts = await pipe.execute()

        minute_count = int(counts[0]) if counts[0] else 0
        hour_count = int(counts[1]) if counts[1] else 0

        # Add rate limit headers to the response
        response.headers["X-RateLimit-Limit-Minute"] = str(self.minute_limit)
        response.headers["X-RateLimit-Remaining-Minute"] = str(max(0, self.minute_limit - minute_count))
        response.headers["X-RateLimit-Limit-Hour"] = str(self.hour_limit)
        response.headers["X-RateLimit-Remaining-Hour"] = str(max(0, self.hour_limit - hour_count))

        return response
