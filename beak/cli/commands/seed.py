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


def _parse_seed_scopes(seed: list[str] | None) -> list[str]:
    if not seed:
        return []

    parsed: list[str] = []
    for raw in seed:
        for token in raw.split(","):
            value = token.strip().lower()
            if value and value not in parsed:
                parsed.append(value)
    return parsed


def _resolve_seed_scopes_for_tenant(tenant: dict, seed: list[str] | None) -> list[str]:
    scopes = _parse_seed_scopes(seed)
    enabled = tenant.get("enabled_modules", ["core", "clinical"])
    if not scopes:
        return ["core", *[m for m in enabled if m != "core"]]

    if "all" in scopes:
        scopes = ["core", *enabled]

    if "core" not in scopes:
        scopes.insert(0, "core")

    allowed = set(enabled) | {"core"}
    invalid = [scope for scope in scopes if scope not in allowed]
    if invalid:
        raise ValueError(
            "Invalid seed scope(s) for tenant "
            f"{tenant['slug']}: {','.join(invalid)}. "
            f"Allowed: {','.join(sorted(allowed))},all"
        )

    # Preserve explicit order, with primary industry naturally handled in loop below.
    deduped: list[str] = []
    for scope in scopes:
        if scope not in deduped:
            deduped.append(scope)
    return deduped


@app.command()
async def all(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
        seed: list[str] = typer.Option(
            None,
            "--seed",
            help=(
                "Seed scopes (repeatable or comma-separated), e.g. "
                "--seed core --seed clinical or --seed core,clinical or --seed all"
            ),
        ),
) -> None:
    """Seed Requisite setup"""
    async with tenant_context_from_slug(tenant_slug):
        if tenant_slug:
            tenant = await TenantRegistryService().get_by_slug(tenant_slug)
            if not tenant:
                raise ValueError(f"Tenant '{tenant_slug}' not found")
            scopes = _resolve_seed_scopes_for_tenant(tenant, seed)
            typer.echo(f"Seeding scopes [{','.join(scopes)}] for tenant {tenant_slug}...")
            if "core" in scopes:
                await initialize_core()
            for module_id in scopes:
                if module_id == "core":
                    continue
                await initialize_industry(module_id)
        else:
            scopes = _parse_seed_scopes(seed)
            if not scopes or "all" in scopes:
                typer.echo("Seeding full default setup...")
                await initialize_beak()
            else:
                typer.echo(f"Seeding scopes [{','.join(scopes)}]...")
                if "core" in scopes:
                    await initialize_core()
                for scope in scopes:
                    if scope == "core":
                        continue
                    await initialize_industry(scope)
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
