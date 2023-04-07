from fastapi import FastAPI
from starlette.responses import HTMLResponse


def default_home_page(app: FastAPI):
    @app.get("/", response_class=HTMLResponse)
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
