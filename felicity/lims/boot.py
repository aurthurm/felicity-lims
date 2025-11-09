from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from strawberry.extensions.tracing import OpenTelemetryExtension
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL

from felicity.api.deps import get_gql_context
from felicity.api.gql.schema import schema
from felicity.api.rest.api_v1 import api
from felicity.apps.common.channel import broadcast
from felicity.apps.events import observe_events
from felicity.apps.iol.redis.client import create_redis_client
from felicity.apps.job.sched import felicity_workforce_init
from felicity.core.config import settings
from felicity.database.session import async_engine
from felicity.lims.gql_router import FelGraphQLRouter
from felicity.lims.middleware import TenantContextMiddleware
from felicity.lims.middleware.appactivity import APIActivityLogMiddleware
from felicity.lims.middleware.ratelimit import RateLimitMiddleware
from felicity.lims.seeds import initialize_felicity
from felicity.views import setup_webapp

redis_client = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[Any, None]:
    global redis_client
    if settings.REDIS_SERVER:
        redis_client = await create_redis_client()
    if settings.LOAD_SETUP_DATA:
        await initialize_felicity()
    await felicity_workforce_init()
    observe_events()
    await broadcast.connect()

    # Startup complete
    yield

    # Shutdown cleanup
    await broadcast.disconnect()
    if redis_client:
        await redis_client.close()  # closes connections
        await redis_client.connection_pool.disconnect()  # ensures the pool is cleaned up


def register_middlewares(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,  # noqa
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # Add tenant context middleware - should be early in the chain
    app.add_middleware(TenantContextMiddleware)  # noqa
    app.add_middleware(APIActivityLogMiddleware)  # noqa
    if redis_client and settings.RATE_LIMIT:
        print(f"Connected to Redis at {settings.REDIS_SERVER}")
        # Register the rate limit middleware with the app
        app.add_middleware(
            RateLimitMiddleware,  # noqa
            redis_client=redis_client,
            minute_limit=settings.RATE_LIMIT_PER_MINUTE,
            hour_limit=settings.RATE_LIMIT_PER_HOUR,
            exclude_paths=["/docs", "/redoc", "/openapi.json"]
        )


def register_rate_limit(app: FastAPI) -> None:
    # Configure rate limiter
    if settings.RATE_LIMIT:
        limiter = Limiter(
            key_func=get_remote_address,
            default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute", f"{settings.RATE_LIMIT_PER_HOUR}/hour"]
        )
        app.state.limiter = limiter  # noqa
        app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # noqa


def register_routes(app: FastAPI) -> None:
    app.include_router(api, prefix="/api/v1")
    setup_webapp(app, settings.SERVE_WEBAPP, schema)


def register_graphql(app: FastAPI) -> None:
    if settings.RUN_OPEN_TRACING:
        schema.extensions = list(schema.extensions) + [OpenTelemetryExtension]

    graphql_app: GraphQLRouter = FelGraphQLRouter(
        schema=schema,
        graphiql=True,
        context_getter=get_gql_context,
        subscription_protocols=[GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL],
    )
    app.include_router(graphql_app, prefix="/felicity-gql")
    # app.add_websocket_route("/felicity-gql", graphql_app)


def init_sentry(app: FastAPI):
    if bool(settings.SENTRY_DSN):
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            # Add data like request headers and IP for users, if applicable;
            # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
            send_default_pii=True,
            # Set traces_sample_rate to 1.0 to capture 100%
            # of transactions for tracing.
            traces_sample_rate=1.0,
            # Set profiles_sample_rate to 1.0 to profile 100%
            # of sampled transactions.
            # We recommend adjusting this value in production.
            profiles_sample_rate=1.0,
        )


def register_tracer(app: FastAPI) -> None:
    if settings.RUN_OPEN_TRACING:
        otlp_exporter = OTLPSpanExporter(
            endpoint=settings.OTLP_SPAN_EXPORT_URL, insecure=True
        )

        resource = Resource.create({"service.name": settings.PROJECT_NAME})

        trace_provider = TracerProvider(resource=resource)
        trace.set_tracer_provider(trace_provider)

        span_processor = BatchSpanProcessor(otlp_exporter)
        trace_provider.add_span_processor(span_processor)

        # Now you can get a tracer and create spans
        tracer = trace.get_tracer(__name__)
        #
        FastAPIInstrumentor.instrument_app(app)
        SQLAlchemyInstrumentor().instrument(
            engine=async_engine.sync_engine, enable_commenter=True, commenter_options={}
        )


def factory(config: dict) -> FastAPI:
    config["lifespan"] = lifespan
    app = FastAPI(**config)
    register_rate_limit(app)
    register_middlewares(app)
    register_routes(app)
    register_graphql(app)
    init_sentry(app)
    register_tracer(app)
    return app
