from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

from api.gql.schema import schema
from api.rest.api_v1 import api
from apps.job.sched import felicity_workforce_init
from core import settings
from init import initialize_felicity
from views import setup_webapp


def register_routes(app: FastAPI):
    @app.get("/health")
    async def get_health(request):
        return {"up": True}

    app.include_router(api, prefix="/api/v1")
    setup_webapp(app, settings.SERVE_WEBAPP)


def register_websockets(app: FastAPI):
    ...


def register_listeners(app: FastAPI):
    @app.on_event("startup")
    async def init_seeds():
        if settings.LOAD_SETUP_DATA:
            await initialize_felicity()


def register_graphql(app: FastAPI):
    graphql_app = GraphQLRouter(schema, graphiql=True)
    app.include_router(graphql_app, prefix="/felicity-gql")

    # class FelicityGraphQLView(GraphQLView):
    #     async def get_context(self, request: Request, response) -> Any:
    #         return await get_gql_context(request, response)
    #
    # app.add_route(
    #     FelicityGraphQLView.as_view(schema=schema, graphiql=True),
    #     "/felicity-gql",
    # )


def register_tasks(app: FastAPI):
    # bg_tasks = BackgroundTasks(tasks=None)
    # bg_tasks.add_task(felicity_workforce_init)
    felicity_workforce_init()


def register_felicity(app: FastAPI):
    register_routes(app)
    register_websockets(app)
    register_graphql(app)
    register_listeners(app)
    register_tasks(app)
