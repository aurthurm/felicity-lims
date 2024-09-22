from contextlib import asynccontextmanager

from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from starlette.middleware.cors import CORSMiddleware
from strawberry.extensions.tracing import OpenTelemetryExtension
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL

from felicity.api.deps import get_gql_context
from felicity.api.gql.schema import schema
from felicity.api.rest.api_v1 import api
from felicity.apps.common.channel import broadcast
from felicity.apps.events import observe_events
from felicity.apps.job.sched import felicity_workforce_init
from felicity.core import get_settings
from felicity.database.session import async_engine
from felicity.lims.seeds import initialize_felicity
from felicity.views import setup_webapp

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.LOAD_SETUP_DATA:
        await initialize_felicity()
    felicity_workforce_init()
    observe_events()
    await broadcast.connect()
    #
    yield
    #
    await broadcast.disconnect()


def register_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def register_routes(app: FastAPI):
    @app.get("/health")
    async def get_health(request):
        return {"up": True}

    app.include_router(api, prefix="/api/v1")
    setup_webapp(app, settings.SERVE_WEBAPP, schema)


def register_graphql(app: FastAPI):
    if settings.RUN_OPEN_TRACING:
        schema.extensions = schema.extensions + (OpenTelemetryExtension,)

    graphql_app = GraphQLRouter(
        schema,
        graphiql=True,
        context_getter=get_gql_context,
        subscription_protocols=[GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL],
    )
    app.include_router(graphql_app, prefix="/felicity-gql")
    app.add_websocket_route("/felicity-gql", graphql_app)


def register_tracer(app: FastAPI):
    if settings.RUN_OPEN_TRACING:
        otlp_exporter = OTLPSpanExporter(
            endpoint=settings.OTLP_SPAN_EXPORT_URL, insecure=True
        )
        resource = Resource.create({"service.name": settings.PROJECT_NAME})
        trace.set_tracer_provider(TracerProvider(resource=resource))
        tracer = trace.get_tracer(__name__)
        span_processor = SimpleSpanProcessor(otlp_exporter)
        trace.get_tracer_provider().add_span_processor(span_processor)
        #
        FastAPIInstrumentor.instrument_app(app)
        SQLAlchemyInstrumentor().instrument(
            engine=async_engine.sync_engine, enable_commenter=True, commenter_options={}
        )


def factory(config: dict):
    config["lifespan"] = lifespan
    app = FastAPI(**config)
    register_cors(app)
    register_routes(app)
    register_graphql(app)
    register_tracer(app)
    return app
