import strawberry  # noqa

from beak.api.gql.types import JSONScalar


@strawberry.type
class AnalyzerParsedMessageType:
    message: JSONScalar
    seperators: JSONScalar


@strawberry.type
class AnalyzerExtractedMessageType:
    message: JSONScalar
