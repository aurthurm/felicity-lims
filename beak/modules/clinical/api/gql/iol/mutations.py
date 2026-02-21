import logging

import strawberry  # noqa

from beak.modules.clinical.api.gql.iol.types import AnalyzerExtractedMessageType
from beak.modules.clinical.api.gql.iol.types import AnalyzerParsedMessageType
from beak.modules.shared.api.gql.permissions import IsAuthenticated
from beak.modules.shared.api.gql.types import JSONScalar
from beak.modules.shared.api.gql.types import OperationError
from beak.modules.core.iol.analyzer.services.transformer import MessageTransformer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AnalyzerParsedMessageResponse = strawberry.union(
    "AnalyzerParsedMessageResponse",
    (AnalyzerParsedMessageType, OperationError),
    description="",  # noqa
)

AnalyzerExtractedMessageResponse = strawberry.union(
    "AnalyzerExtractedMessageResponse",
    (AnalyzerExtractedMessageType, OperationError),
    description="",  # noqa
)


@strawberry.type
class IOLMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def parse_analyser_message(
        self, info, message: str
    ) -> AnalyzerParsedMessageResponse:
        msg, sep = MessageTransformer().parse_message(message)
        return AnalyzerParsedMessageType(message=msg, seperators=sep)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def extract_analyser_message(
        self, info, message: str, driver: JSONScalar
    ) -> AnalyzerExtractedMessageResponse:
        # Parse driver if it's a string (from JSON)
        import json

        if isinstance(driver, str):
            try:
                driver = json.loads(driver)
            except (json.JSONDecodeError, TypeError):
                logger.error(f"Failed to parse driver JSON: {driver}")
                return AnalyzerExtractedMessageType(
                    message={
                        "sample_id": None,
                        "instrument": None,
                        "results": [],
                        "error": "Invalid driver format",
                    }
                )
        return AnalyzerExtractedMessageType(
            message=MessageTransformer().extract_fields(message=message, driver=driver)
        )
