import strawberry  # noqa

from felicity.api.gql.types import JSONScalar


@strawberry.type
class AnalyzerParsedMessageType:
    message: JSONScalar
    seperators: JSONScalar


@strawberry.type
class AnalyzerExtractedMessageType:
    message: JSONScalar
