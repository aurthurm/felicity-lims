from fastapi import FastAPI
from starlette.responses import HTMLResponse


def setup_backends(app: FastAPI, serve_webapp: bool):
    backends = "/backends" if serve_webapp else "/"

    @app.get(backends, response_class=HTMLResponse)
    def index():
        return """
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
