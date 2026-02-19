import typer

from beak.modules.platform.iam_service import PlatformIAMService
from beak.modules.platform.services import TenantRegistryService
from beak.core.config import get_settings
from beak.cli.libs import AsyncTyper
from beak.cli.commands._tenant import tenant_context_from_slug
from beak.lims.seeds import (
    initialize_beak,
    initialize_core,
    initialize_industry,
    seed_breakpoints,
)

app = AsyncTyper()
settings = get_settings()


@app.command()
async def all(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Seed Requisite setup"""
    async with tenant_context_from_slug(tenant_slug):
        if tenant_slug:
            tenant = await TenantRegistryService().get_by_slug(tenant_slug)
            if not tenant:
                raise ValueError(f"Tenant '{tenant_slug}' not found")
            industry = tenant.get("primary_industry", "clinical")
            typer.echo(f"Seeding core + enabled modules for tenant {tenant_slug}...")
            await initialize_core()
            for module_id in tenant.get("enabled_modules", ["core", "clinical"]):
                if module_id == "core":
                    continue
                await initialize_industry(module_id if module_id == industry else module_id)
        else:
            typer.echo("Seeding full default setup...")
            await initialize_beak()
        typer.echo("Done seeding requisite setup:)")


@app.command("core")
async def core(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Seed only core module setup."""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Seeding core module...")
        await initialize_core()
        typer.echo("Done seeding core module.")


@app.command("industry")
async def industry(
        module: str = typer.Option(..., "--module", help="Industry module id"),
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Seed a specific industry module."""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo(f"Seeding industry module '{module}'...")
        await initialize_industry(module)
        typer.echo(f"Done seeding industry module '{module}'.")


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
