from __future__ import annotations

from dataclasses import dataclass

PRIMARY_INDUSTRIES = {
    "clinical",
    "pharma",
    "environment",
    "industrial",
    "veterinary",
    "food_safety",
    "forensic",
    "research",
    "public_health",
}
ALL_MODULE_IDS = {
    "core",
    "clinical",
    "pharma",
    "environment",
    "industrial",
    "veterinary",
    "food_safety",
    "forensic",
    "research",
    "public_health",
}


@dataclass(frozen=True)
class ModuleSelection:
    primary_industry: str
    enabled_modules: list[str]


def normalize_modules(
    *,
    primary_industry: str,
    enabled_modules: list[str] | None = None,
) -> ModuleSelection:
    if primary_industry not in PRIMARY_INDUSTRIES:
        raise ValueError(
            "primary_industry must be one of: "
            "clinical|pharma|environment|industrial|veterinary|food_safety|forensic|research|public_health"
        )

    requested = set(enabled_modules or [])
    unknown = requested - ALL_MODULE_IDS
    if unknown:
        joined = ", ".join(sorted(unknown))
        raise ValueError(f"Unknown module(s): {joined}")

    requested.add("core")
    requested.add(primary_industry)

    return ModuleSelection(
        primary_industry=primary_industry,
        enabled_modules=sorted(requested),
    )


def default_modules_for_industry(primary_industry: str) -> list[str]:
    return normalize_modules(primary_industry=primary_industry).enabled_modules
