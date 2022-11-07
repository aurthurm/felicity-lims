import json
import logging
from typing import List

from fastapi import FastAPI, Request, WebSocket
from fastapi.staticfiles import StaticFiles
from felicity.api.gql.schema import gql_schema  # noqa
from felicity.api.rest.api_v1.api import api_router  # noqa
from felicity.apps.common.channel import broadcast
from felicity.apps.job.sched import (felicity_halt_workforce,
                                     felicity_workforce_init)
from felicity.apps.notification.utils import FelicityNotifier, FelicityStreamer
from felicity.core.config import settings  # noqa
from felicity.core.repeater import repeat_every
from felicity.init import initialize_felicity  # noqa
from felicity.middlewares.auth_backend import FelicityAuthBackend
from felicity.utils.dirs import resolve_root_dirs
from felicity.views import default_home_page
from felicity.utils.email.email import send_new_account_email
from starlette.concurrency import run_until_first_complete
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.cors import CORSMiddleware
from strawberry.asgi import GraphQL
from strawberry.subscriptions import (GRAPHQL_TRANSPORT_WS_PROTOCOL,
                                      GRAPHQL_WS_PROTOCOL)

# uvicorn_error = logging.getLogger("uvicorn.error")
# uvicorn_error.propagate = False
# logging.getLogger("uvicorn").handlers.clear()
# logging.getLogger("uvicorn").removeHandler(logging.getLogger("uvicorn").handlers[0])
# or more so https://pawamoy.github.io/posts/unify-logging-for-a-gunicorn-uvicorn-app/

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

    send_new_account_email("aurthur@felicity.inc",  "aurthurm", "@ceam2014;")
    
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

default_home_page(flims)
flims.include_router(api_router, prefix=settings.API_V1_STR)
flims.add_route("/felicity-gql", graphql_app)
flims.add_websocket_route("/felicity-gql", graphql_app, "felicity-subscriptions")

resolve_root_dirs()
flims.mount("/media", StaticFiles(directory="media"), name="media")


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
