from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from beak.modules.registry import ModuleRegistry


def collect_graphql_contrib(registry: ModuleRegistry) -> tuple[list[type], list[type], list[type], list[type]]:
    """Collect GraphQL types and mixins from module manifests."""
    types: list[type] = []
    query_mixins: list[type] = []
    mutation_mixins: list[type] = []
    subscription_mixins: list[type] = []

    manifests = registry.resolve(["core", "clinical", "pharma", "environment", "industrial"])
    for manifest in manifests:
        gql = manifest.graphql
        types.extend(gql.types)
        query_mixins.extend(gql.query_mixins)
        mutation_mixins.extend(gql.mutation_mixins)
        subscription_mixins.extend(gql.subscription_mixins)

    return types, query_mixins, mutation_mixins, subscription_mixins
