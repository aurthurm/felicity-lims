import graphdoc
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from strawberry import Schema

from felicity.core import get_settings

settings = get_settings()
STATIC_DIR = f"{settings.BASE_DIR}/templates/static/"


def setup_webapp(app: FastAPI, serve_webapp: bool, schema: Schema) -> None:
    backends: str = "/backends" if serve_webapp else "/"

    if serve_webapp:
        app.mount(
            "/assets", StaticFiles(directory=f"{STATIC_DIR}assets"), name="assets"
        )

        @app.get("/", response_class=HTMLResponse)
        async def handler(request: Request) -> HTMLResponse:
            return Jinja2Templates(directory=STATIC_DIR).TemplateResponse(
                "index.html", context={"request": request}
            )

    @app.get("/graphql-docs", response_class=HTMLResponse)
    async def graphql_docs() -> str:
        return graphdoc.to_doc(schema._schema)

    @app.get(backends, response_class=HTMLResponse)
    def api_gql_view() -> str:
        return """
        <!Doctype html>
        <html>
            <body>
                <h1>SecureAPI</h1>
                <div class="btn-group">
                    <a href="/docs"><button>SwaggerUI</button></a>
                    <a href="/redoc"><button>Redoc</button></a>
                    <a href="/felicity-gql"><button>GraphQL Playground</button></a>
                    <a href="/graphql-docs"><button>GraphQL Documentation</button></a>
                </div>
            </body>
        </html>
        """
