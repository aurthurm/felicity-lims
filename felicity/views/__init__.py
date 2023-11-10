from sanic import Sanic
from sanic import response
from core import settings
import os

STATIC_DIR = f"{settings.BASE_DIR}/templates/static/"


def setup_webapp(app: Sanic, serve_webapp: bool):
    backends = "/backends" if serve_webapp else "/"
    
    if serve_webapp:  
        @app.get("/")
        @app.ext.template("static/index.html")
        async def handler(request):
            return {"title": "Felicity Lims"}
             
        app.static("/", STATIC_DIR, name="base")
        app.static('/assets', f"{STATIC_DIR}/index.html", name='index')
        app.static('/favicon.ico', os.path.join(STATIC_DIR, 'favicon.ico'), name="favicon")
        # app.static("/assets", f"{STATIC_DIR}/assets/", name="assets")


    @app.get(backends)
    def api_gql_view(request):
        return response.html(
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
    

 