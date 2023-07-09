import json
import logging
from typing import List

from api.gql.schema import gql_schema  # noqa
from api.rest.api_v1.api import api_router  # noqa
from apps.common.channel import broadcast
from apps.job.sched import felicity_workforce_init
from apps.notification.utils import FelicityNotifier, FelicityStreamer
from apps.events import observe_events
from core.config import settings  # noqa
from core.repeater import repeat_every
from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import HTMLResponse
#
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from init import initialize_felicity  # noqa
from middlewares.auth_backend import FelicityAuthBackend
#
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from starlette.concurrency import run_until_first_complete
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.cors import CORSMiddleware
from strawberry.asgi import GraphQL
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL
from utils.dirs import resolve_root_dirs
from views import setup_backends

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def register_app_events(app: FastAPI):
    @app.on_event("startup")
    async def startup():
        # print("\n")
        # print(pf.Figlet("doom").renderText("FELICITY  LIMS"))  # "puffy"
        if settings.LOAD_SETUP_DATA:
            await initialize_felicity()

        felicity_workforce_init()

    @app.on_event("startup")
    @repeat_every(seconds=3)  # 60 * 60 = 1 hour
    async def always_and_forever():
        # print(datetime.now())
        pass

    @app.on_event("shutdown")
    async def shutdown():
        pass

    return app


def register_app_middlewares(app: FastAPI):
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin)
                           for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    app.add_middleware(AuthenticationMiddleware, backend=FelicityAuthBackend())

    @app.middleware("http")
    async def set_custom_attr(request: Request, call_next):
        request.state.notifier = FelicityNotifier()
        request.state.streamer = FelicityStreamer()
        response = await call_next(request)
        return response

    return app


def register_app_publics(app: FastAPI):
    graphql_app = GraphQL(
        gql_schema,
        subscription_protocols=[GRAPHQL_WS_PROTOCOL,
                                GRAPHQL_TRANSPORT_WS_PROTOCOL],
    )

    setup_backends(app, settings.SERVE_WEBAPP)
    app.include_router(api_router, prefix=settings.API_V1_STR)
    app.add_route("/felicity-gql", graphql_app)
    app.add_websocket_route("/felicity-gql", graphql_app,
                            "felicity-subscriptions")
    resolve_root_dirs()
    app.mount("/media", StaticFiles(directory="media"), name="media")

    if settings.SERVE_WEBAPP:
        templates = Jinja2Templates(directory=settings.STATIC_DIR)

        app.mount(
            "/assets",
            StaticFiles(directory=settings.STATIC_DIR + "/assets", html=True),
            name="assets",
        )

        @app.get("/", response_class=HTMLResponse)
        async def index_path(request: Request):
            return templates.TemplateResponse("index.html", {"request": request})

        @app.get("/{catchall:path}", response_class=HTMLResponse)
        async def index_catch(request: Request):
            return templates.TemplateResponse("index.html", {"request": request})

    return app


def register_app_sockets(app: FastAPI):

    class ConnectionManager:
        def __init__(self):
            self.connections: List[WebSocket] = []

        async def connect(self, websocket: WebSocket):
            await websocket.accept()
            self.connections.append(websocket)

        async def broadcast(self, data: str):
            for connection in self.connections:
                await connection.send_text(data)

    manager = ConnectionManager()

    @app.websocket("/ws/{after_uid}")
    async def websocket_endpoint(websocket: WebSocket, after_uid: int):
        await manager.connect(websocket)
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Client {after_uid}: {data}")

    async def chatroom_ws(websocket):
        await websocket.accept()
        await run_until_first_complete(
            (chatroom_ws_receiver, {"websocket": websocket}),
            (chatroom_ws_sender, {"websocket": websocket}),
        )

    async def chatroom_ws_receiver(websocket):
        async for message in websocket.iter_text():
            await broadcast.publish(channel="activities", message=message)

    async def chatroom_ws_sender(websocket):
        async with broadcast.subscribe(channel="activities") as subscriber:
            async for event in subscriber:
                await websocket.send_text(event.message)

    app.add_websocket_route("/chatter", chatroom_ws, "chatroom_ws")

    async def get_streams(websocket):
        async with broadcast.subscribe(channel="activities") as subscriber:
            async for event in subscriber:
                data = json.loads(
                    json.dumps(
                        event.message.marshal_simple(),
                        indent=4,
                        sort_keys=True,
                        default=str,
                    )
                )
                await websocket.send_json(data)

    async def stream_socket(websocket):
        await websocket.accept()
        await run_until_first_complete((get_streams, {"websocket": websocket}))

    app.add_websocket_route("/streamer", stream_socket, "notification-only")
    return app


def register_app_tracing(app: FastAPI):
    if settings.RUN_OPEN_TRACING:
        logging.info(
            f"Open Tracing activated :) Sending to: {settings.OTLP_SPAN_EXPORT_URL}")
        resource = Resource(attributes={"service.name": "FelicityLIMS"})
        tracer = TracerProvider(resource=resource)
        trace.set_tracer_provider(tracer)
        tracer.add_span_processor(
            BatchSpanProcessor(
                OTLPSpanExporter(
                    endpoint=settings.OTLP_SPAN_EXPORT_URL
                )
            )
        )
        #  grafana tempo/jaeger/signoz
        # https://itnext.io/observability-part-2-tracing-1537e8d79933 or check https://github.com/blueswen/fastapi-jaeger

        LoggingInstrumentor().instrument()
        FastAPIInstrumentor.instrument_app(app)
    return app


def boot_felicity():
    app = FastAPI(
        title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )
    app = register_app_events(app)
    app = register_app_middlewares(app)
    app = register_app_publics(app)
    app = register_app_sockets(app)
    app = register_app_tracing(app)
    # init observer event system
    observe_events()
    return app
