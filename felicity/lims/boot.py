from typing import Any

from sanic import Sanic, json
from sanic.request import Request
from sanic_ext import Extend
from strawberry.sanic.views import GraphQLView

from api.deps import models, get_auth_user, get_gql_context
from api.gql.schema import schema
from api.rest.api_v1 import api
from apps.job.sched import felicity_workforce_init
from core import settings


def register_configs(app: Sanic):
    app.config.update(settings.__dict__)
    Extend(app)


def register_dependencies(app: Sanic):
    app.ext.add_dependency(models.User, get_auth_user)


def register_blueprints(app: Sanic):
    @app.get("/health")
    async def get_health(request):
        return json({"up": True})

    app.blueprint(api)


def register_graphql(app: Sanic):
    class FelicityGraphQLView(GraphQLView):
        async def get_context(self, request: Request, response) -> Any:
            return await get_gql_context(request, response)

    app.add_route(
        FelicityGraphQLView.as_view(schema=schema, graphiql=True),
        "/felicity-gql",
    )


def register_felicity(app: Sanic):
    register_configs(app)
    register_dependencies(app)
    register_blueprints(app)
    register_graphql(app)

    app.add_task(felicity_workforce_init)
