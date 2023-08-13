from typing import Any
from sanic import Sanic
from sanic_ext import Extend
from sanic.request import Request
from sanic.response import text

from strawberry.sanic.views import GraphQLView

from api.gql.schema import schema
from api.deps import get_auth_context
from api.rest.api_v1 import api
from api.deps import models, get_auth_user

from core import settings


def register_configs(app: Sanic):
    app.config.update(settings.__dict__)
    Extend(app)

def register_events(app: Sanic):
    @app.listener("before_server_start")
    async def setup_db(app):
        # app.ctx.db = await db_setup()
        print("Setting up database for felicity ...")

def register_middlewares(app: Sanic):
    ...
    
def register_dependencies(app: Sanic):
    app.ext.add_dependency(models.User, get_auth_user)

def register_blueprints(app: Sanic):
    @app.get("/")
    async def index(request):
        return text('Hello World')
    
    app.blueprint(api)
    
def register_graphql(app: Sanic):
    class FelicityGraphQLView(GraphQLView):
        async def get_context(self, request: Request, response) -> Any:
            return await get_auth_context(request)

    app.add_route(
        FelicityGraphQLView.as_view(schema=schema, graphiql=True),
        "/felicity-gql",
    )
    
def register_health(app: Sanic):
    ...


def register_felicity(app: Sanic):
    register_configs(app)
    register_events(app)
    register_middlewares(app)
    register_dependencies(app)
    register_blueprints(app)
    register_graphql(app)
    register_health(app)