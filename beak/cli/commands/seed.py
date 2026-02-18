import typer

from beak.apps.platform.iam_service import PlatformIAMService
from beak.core.config import get_settings
from beak.cli.libs import AsyncTyper
from beak.cli.commands._tenant import tenant_context_from_slug
from beak.lims.seeds import initialize_beak, seed_breakpoints

app = AsyncTyper()
settings = get_settings()


@app.command()
async def all(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Seed Requisite setup"""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Seeding requisite setup...")
        await initialize_beak()
        typer.echo("Done seeding requisite setup:)")


@app.command()
async def microbiology(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Seed Requisite setup"""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Seeding requisite setup...")
        await seed_breakpoints()
        typer.echo("Done seeding requisite setup:)")


@app.command("platform-superuser")
async def platform_superuser(
        email: str = typer.Option(settings.PLATFORM_SUPERUSER_EMAIL, help="Platform admin email"),
        username: str = typer.Option(
            settings.PLATFORM_SUPERUSER_USERNAME,
            help="Platform admin username",
        ),
        password: str = typer.Option(
            settings.PLATFORM_SUPERUSER_PASSWORD,
            help="Platform admin password",
        ),
) -> None:
    """Seed or update the platform superuser account."""
    user = await PlatformIAMService().seed_superuser(
        email=email,
        username=username,
        password=password,
        first_name="Platform",
        last_name="Administrator",
    )
    typer.echo(
        f"Platform superuser ready: {user['email']} roles={','.join(user['roles'])}"
    )
