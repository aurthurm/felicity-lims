import strawberry

from beak.modules import get_registry
from beak.api.gql.registry import collect_graphql_contrib


def _compose_type(name: str, mixins: tuple[type, ...]):
    bases = mixins or (object,)
    return strawberry.type(type(name, bases, {}))


def _build_schema() -> strawberry.Schema:
    types, query_mixins, mutation_mixins, subscription_mixins = collect_graphql_contrib(
        get_registry()
    )

    Query = _compose_type("Query", tuple(query_mixins))
    Mutation = _compose_type("Mutation", tuple(mutation_mixins))
    Subscription = _compose_type("Subscription", tuple(subscription_mixins))

    return strawberry.Schema(
        query=Query,
        mutation=Mutation,
        subscription=Subscription,
        types=types,
    )


schema = _build_schema()
