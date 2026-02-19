import strawberry

from beak.modules import registry


def _compose_type(name: str, mixins: tuple[type, ...]):
    bases = mixins or (object,)
    return strawberry.type(type(name, bases, {}))


def _build_schema() -> strawberry.Schema:
    manifests = registry.resolve(["core", "clinical", "pharma", "environment", "industrial"])

    types: list[type] = []
    query_mixins: list[type] = []
    mutation_mixins: list[type] = []
    subscription_mixins: list[type] = []

    for manifest in manifests:
        gql = manifest.graphql
        types.extend(gql.types)
        query_mixins.extend(gql.query_mixins)
        mutation_mixins.extend(gql.mutation_mixins)
        subscription_mixins.extend(gql.subscription_mixins)

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
