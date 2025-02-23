import typer

from felicity.cli.libs import AsyncTyper
from felicity.lims.seeds import initialize_felicity, seed_breakpoints

app = AsyncTyper()


@app.command()
async def all() -> None:
    """Seed Requisite setup"""
    typer.echo(f"Seeding requisite setup...")
    await initialize_felicity()
    typer.echo("Done seeding requisite setup:)")


@app.command()
async def microbiology() -> None:
    """Seed Requisite setup"""
    typer.echo(f"Seeding requisite setup...")
    await seed_breakpoints()
    typer.echo("Done seeding requisite setup:)")
