import asyncio
from enum import Enum

import typer

from beak.almigrator import BeakMigrator

app = typer.Typer()
alembic_service = BeakMigrator()


class MigrationScope(str, Enum):
    platform = "platform"
    tenant = "tenant"


@app.command()
def upgrade(
        revision: str = typer.Option("head", help="Target revision to upgrade to"),
) -> None:
    """Upgrade platform schema to a specified revision."""
    alembic_service.upgrade(revision)
    typer.echo(f"Upgraded to revision: {revision}")


@app.command()
def downgrade(
        revision: str = typer.Argument(..., help="Target revision to downgrade to"),
) -> None:
    """Downgrade platform schema to a specified revision."""
    alembic_service.downgrade(revision)
    typer.echo(f"Downgraded to revision: {revision}")


@app.command()
def revision(
        message: str = typer.Argument(..., help="Message for the new revision"),
        scope: MigrationScope = typer.Option(
            MigrationScope.tenant,
            help="Migration scope: 'platform' for platform schema, 'tenant' for tenant schema",
        ),
        autogenerate: bool = typer.Option(
            True,
            help="Auto-generate migration from model changes",
        ),
) -> None:
    """Create a new Alembic revision with a message."""
    alembic_service.create_revision(message, scope=scope.value, autogenerate=autogenerate)
    typer.echo(f"Created new {scope.value} revision: {message}")


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
