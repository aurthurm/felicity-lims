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

from api.deps import get_gql_context
from api.gql.schema import schema
from api.rest.api_v1 import api
from apps.events import observe_events
from apps.job.sched import felicity_workforce_init
from core import settings
from init import initialize_felicity
from views import setup_webapp


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
    setup_webapp(app, settings.SERVE_WEBAPP)


def register_listeners(app: FastAPI):
    @app.on_event("startup")
    async def init_seeds():
        if settings.LOAD_SETUP_DATA:
            await initialize_felicity()


def register_graphql(app: FastAPI):
    if settings.RUN_OPEN_TRACING:
        schema.extensions = schema.extensions + (OpenTelemetryExtension,)
        
    graphql_app = GraphQLRouter(
        schema,
        graphiql=True,
        context_getter=get_gql_context,
        subscription_protocols=[GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL]
        # GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL
    )
    app.include_router(graphql_app, prefix="/felicity-gql")
    app.add_websocket_route("/felicity-gql", graphql_app)


def register_tasks(app: FastAPI):
    # bg_tasks = BackgroundTasks(tasks=None)
    # bg_tasks.add_task(felicity_workforce_init)
    felicity_workforce_init()
    observe_events()


def trace_app(app: FastAPI):
    if settings.RUN_OPEN_TRACING:
        otlp_exporter = OTLPSpanExporter(endpoint=settings.OTLP_SPAN_EXPORT_URL, insecure=True)
        resource = Resource.create({"service.name": settings.PROJECT_NAME})
        trace.set_tracer_provider(TracerProvider(resource=resource))
        tracer = trace.get_tracer(__name__)
        span_processor = SimpleSpanProcessor(otlp_exporter)
        trace.get_tracer_provider().add_span_processor(span_processor)
        #
        FastAPIInstrumentor.instrument_app(app, tracer_provider=tracer)
        SQLAlchemyInstrumentor().instrument(enable_commenter=True, commenter_options={})


def register_felicity(app: FastAPI):
    register_cors(app)
    register_routes(app)
    register_graphql(app)
    register_listeners(app)
    register_tasks(app)
    trace_app(app)
