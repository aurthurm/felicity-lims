import typer

from beak.main import beak  # noqa required to load modules
from .commands import server, db, snapshot, seed, tenant

app = typer.Typer()

# Register command groups
app.add_typer(server.app, name="server")
app.add_typer(db.app, name="db")
app.add_typer(snapshot.app, name="snapshot")
app.add_typer(seed.app, name="seed")
app.add_typer(tenant.app, name="tenant")


def main() -> None:
    app()
