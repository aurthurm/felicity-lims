import typer

from beak.cli.libs import AsyncTyper
from beak.lims.seeds import initialize_beak, seed_breakpoints

app = AsyncTyper()


@app.command()
async def all() -> None:
    """Seed Requisite setup"""
    typer.echo("Seeding requisite setup...")
    await initialize_beak()
    typer.echo("Done seeding requisite setup:)")


@app.command()
async def microbiology() -> None:
    """Seed Requisite setup"""
    typer.echo("Seeding requisite setup...")
    await seed_breakpoints()
    typer.echo("Done seeding requisite setup:)")
