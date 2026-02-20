from beak.modules import get_registry


def observe_events() -> None:
    for manifest in get_registry().resolve(
        [
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
        ]
    ):
        if manifest.register_events:
            manifest.register_events()
