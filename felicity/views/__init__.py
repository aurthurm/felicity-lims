from fastapi import FastAPI, Response, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from core import settings

STATIC_DIR = f"{settings.BASE_DIR}/templates/static/"


def setup_webapp(app: FastAPI, serve_webapp: bool):
    backends = "/backends" if serve_webapp else "/"
    templates = Jinja2Templates(directory=STATIC_DIR)

    if serve_webapp:
        app.mount("/assets", StaticFiles(directory=f"{STATIC_DIR}assets"), name="assets")

        @app.get("/", response_class=HTMLResponse)
        async def handler(request: Request):
            return templates.TemplateResponse("index.html", context={"request": request})

    @app.get(backends)
    def api_gql_view(request):
        return Response(
            """
            <!Doctype html>
                <html>
                    <body>
                        <h1>SecureAPI</h1>
                        <div class="btn-group">
                            <a href="/docs"><button>SwaggerUI</button></a>
                            <a href="/redoc"><button>Redoc</button></a>
                            <a href="/felicity-gql"><button>Felicity GraphQL</button></a>
                        </div>
                    </body>
                </html>
            """
        )
