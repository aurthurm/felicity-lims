"""Platform schema bootstrap helpers."""

from __future__ import annotations

import importlib.util
import inspect
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection

from beak.core.config import settings


@dataclass
class PlatformRevision:
    revision: str
    down_revision: str | None
    upgrade: Any


def _load_platform_revisions() -> list[PlatformRevision]:
    versions_dir = Path(__file__).parent / "platform_versions"
    revisions: list[PlatformRevision] = []

    for path in sorted(versions_dir.glob("*.py")):
        if path.name == "__init__.py":
            continue
        module_name = f"beak.migrations.platform_versions.{path.stem}"
        spec = importlib.util.spec_from_file_location(module_name, path)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"Unable to load platform migration module: {path}")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        revision = getattr(module, "revision", None)
        down_revision = getattr(module, "down_revision", None)
        upgrade = getattr(module, "upgrade", None)

        if not revision or not callable(upgrade):
            raise RuntimeError(f"Invalid platform migration file: {path}")

        revisions.append(
            PlatformRevision(
                revision=str(revision),
                down_revision=str(down_revision) if down_revision else None,
                upgrade=upgrade,
            )
        )

    return revisions


def _ordered_revisions(revisions: list[PlatformRevision]) -> list[PlatformRevision]:
    if not revisions:
        return []

    by_revision = {r.revision: r for r in revisions}
    by_parent: dict[str | None, list[PlatformRevision]] = {}
    for revision in revisions:
        by_parent.setdefault(revision.down_revision, []).append(revision)

    roots = by_parent.get(None, [])
    if len(roots) != 1:
        raise RuntimeError(
            "Platform revisions must have exactly one root revision (down_revision=None)"
        )

    ordered: list[PlatformRevision] = []
    current = roots[0]
    ordered.append(current)

    visited = {current.revision}
    while True:
        children = by_parent.get(current.revision, [])
        if not children:
            break
        if len(children) != 1:
            raise RuntimeError(
                f"Platform revision branch detected at {current.revision}. "
                "Platform revision stream must remain linear."
            )
        current = children[0]
        if current.revision in visited:
            raise RuntimeError("Cycle detected in platform revision graph")
        visited.add(current.revision)
        ordered.append(current)

    missing = set(by_revision.keys()) - visited
    if missing:
        raise RuntimeError(
            "Unreachable platform revisions detected: " + ", ".join(sorted(missing))
        )

    return ordered


async def bootstrap_platform_schema(connection: AsyncConnection) -> None:
    """Ensure platform schema exists and apply platform revision stream."""
    schema = settings.PLATFORM_SCHEMA

    await connection.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{schema}"'))
    await connection.execute(
        text(
            f"""
            CREATE TABLE IF NOT EXISTS "{schema}".alembic_version_platform (
                version_num VARCHAR(64) NOT NULL PRIMARY KEY
            )
            """
        )
    )

    rows = await connection.execute(
        text(f'SELECT version_num FROM "{schema}".alembic_version_platform')
    )
    applied = {row[0] for row in rows.fetchall()}

    revisions = _ordered_revisions(_load_platform_revisions())
    for revision in revisions:
        if revision.revision in applied:
            continue

        result = revision.upgrade(connection=connection, platform_schema=schema)
        if inspect.isawaitable(result):
            await result

        await connection.execute(
            text(
                f"""
                INSERT INTO "{schema}".alembic_version_platform(version_num)
                VALUES (:revision)
                """
            ),
            {"revision": revision.revision},
        )

    await connection.commit()
