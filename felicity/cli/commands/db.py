import asyncio

import typer

from felicity.almigrator import FelicityMigrator

app = typer.Typer()
alembic_service = FelicityMigrator()


@app.command()
def upgrade(
        revision: str = typer.Option("head", help="Target revision to upgrade to"),
) -> None:
    """Upgrade to a specified revision."""
    alembic_service.upgrade(revision)
    typer.echo(f"Upgraded to revision: {revision}")


@app.command()
def downgrade(
        revision: str = typer.Argument(..., help="Target revision to downgrade to"),
) -> None:
    """Downgrade to a specified revision."""
    alembic_service.downgrade(revision)
    typer.echo(f"Downgraded to revision: {revision}")


@app.command()
def revision(
        message: str = typer.Argument(..., help="Message for the new revision"),
) -> None:
    """Not working --- no idea why yet
    Create a new Alembic revision with a message."""
    alembic_service.create_revision(message)
    typer.echo(f"Created new revision with message: {message}")


@app.command()
def current() -> None:
    """Show the current database revision."""
    alembic_service.current()


@app.command()
def history() -> None:
    """Show the revision history."""
    alembic_service.history()


@app.command()
def updates() -> None:
    """Check for updates"""
    asyncio.run(alembic_service.check_for_updates())
