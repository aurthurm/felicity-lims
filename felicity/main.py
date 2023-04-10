import json
import logging
from typing import List

from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import HTMLResponse
#
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.concurrency import run_until_first_complete
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.cors import CORSMiddleware
from strawberry.asgi import GraphQL
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL

from felicity.api.gql.schema import gql_schema  # noqa
from felicity.api.rest.api_v1.api import api_router  # noqa
from felicity.apps.common.channel import broadcast
from felicity.apps.job.sched import felicity_halt_workforce, felicity_workforce_init
from felicity.apps.notification.utils import FelicityNotifier, FelicityStreamer
from felicity.core.config import settings  # noqa
from felicity.core.repeater import repeat_every
from felicity.init import initialize_felicity  # noqa
from felicity.middlewares.auth_backend import FelicityAuthBackend
from felicity.utils.dirs import resolve_root_dirs
from felicity.views import setup_backends

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


flims = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)


@flims.on_event("startup")
async def startup():
    # print("\n")
    # print(pf.Figlet("doom").renderText("FELICITY  LIMS"))  # "puffy"
    if settings.LOAD_SETUP_DATA:
        await initialize_felicity()

    felicity_workforce_init()


@flims.on_event("startup")
@repeat_every(seconds=3)  # 60 * 60 = 1 hour
async def always_and_forever():
    # print(datetime.now())
    pass


@flims.on_event("shutdown")
async def shutdown():
    felicity_halt_workforce()


# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    flims.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

flims.add_middleware(AuthenticationMiddleware, backend=FelicityAuthBackend())


@flims.middleware("http")
async def set_custom_attr(request: Request, call_next):
    request.state.notifier = FelicityNotifier()
    request.state.streamer = FelicityStreamer()
    response = await call_next(request)
    return response


graphql_app = GraphQL(
    gql_schema,
    subscription_protocols=[GRAPHQL_WS_PROTOCOL, GRAPHQL_TRANSPORT_WS_PROTOCOL],
)

setup_backends(flims, settings.SERVE_WEBAPP)
flims.include_router(api_router, prefix=settings.API_V1_STR)
flims.add_route("/felicity-gql", graphql_app)
flims.add_websocket_route("/felicity-gql", graphql_app, "felicity-subscriptions")
resolve_root_dirs()
flims.mount("/media", StaticFiles(directory="media"), name="media")


if settings.SERVE_WEBAPP:
    templates = Jinja2Templates(directory=settings.STATIC_DIR)

    flims.mount(
        "/assets",
        StaticFiles(directory=settings.STATIC_DIR + "/assets", html=True),
        name="assets",
    )

    @flims.get("/", response_class=HTMLResponse)
    async def index_path(request: Request):
        return templates.TemplateResponse("index.html", {"request": request})

    @flims.get("/{catchall:path}", response_class=HTMLResponse)
    async def index_catch(request: Request):
        return templates.TemplateResponse("index.html", {"request": request})


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


@flims.websocket("/ws/{after_uid}")
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


flims.add_websocket_route("/chatter", chatroom_ws, "chatroom_ws")


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


flims.add_websocket_route("/streamer", stream_socket, "notification-only")
