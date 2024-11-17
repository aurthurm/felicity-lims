import subprocess

import typer
from uvicorn import Config, Server

from felicity.logcong import LOGGING_CONFIG

app = typer.Typer()


@app.command()
def runserver(
        host: str = "0.0.0.0",
        port: int = 8000,
        workers: int = 1,
        reload: bool = False,
        colors: bool = True,
) -> None:
    """Felicity LIMS Server"""
    config = Config(
        app="felicity.main:felicity",
        host=host,
        port=port,
        workers=workers,
        reload=reload,
        use_colors=colors,
        log_config=LOGGING_CONFIG,
    )
    Server(config).run()


@app.command()
def gunicorn(
        host: str = "0.0.0.0",
        port: int = 8000,
        workers: int = 1,
        reload: bool = False,
        colors: bool = True,
) -> None:
    """Felicity LIMS Server"""
    command = [
        "gunicorn",
        f"--bind={host}:{port}",
        f"--workers={workers}",
        "--reload" if reload else "",
        "--log-level=info",
        "--access-logfile=-" if colors else "",
        "felicity.main:felicity",
        "--worker-class=uvicorn.workers.UvicornWorker",
    ]

    cmd_str = " ".join(command)
    print(f"Running command: {cmd_str}")
    subprocess.run(cmd_str, shell=True, check=True)
