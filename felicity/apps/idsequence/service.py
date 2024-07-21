from datetime import datetime
from typing import TypeVar
from sqlalchemy.dialects.postgresql import insert

from domain.shared.services import BaseService
from domain.idsequence.ports.service import IIdSequenceService
from domain.idsequence.ports.repository import IIdSequenceRepository
from domain.idsequence.utils import sequencer, sequence_alpha
from domain.idsequence.exception import (
    SequenceGenerateError,
    IncompleDataError,
)

IdSequence = TypeVar("IdSequence")
SEQUENCE_BEGIN = 5
SEQUENCE_CUTOFF = 10


class IdSequenceService(BaseService[IdSequence], IIdSequenceService):
    def __init__(self, repository: IIdSequenceRepository) -> None:
        self.repository = repository
        super().__init__(repository)

    async def get_next_number(
        self, prefix: str = None, generic=False
    ) -> tuple[int, str]:
        if not prefix:
            raise IncompleDataError("A prefix is required")
        prefix_year = str(datetime.now().year)[2:]

        if generic:
            fetch = await self.get_all(prefix__istartswith=f"{prefix}{prefix_year}")
            if not fetch:
                alpha = "AA"
            else:
                sequences = sorted(fetch, key=lambda s: s.updated, reverse=True)

                latest = sequences[0]

                alpha = latest.prefix.split(prefix_year)[1]
                if not alpha:
                    alpha = "AA"

                if latest.number >= SEQUENCE_CUTOFF:
                    alpha = sequence_alpha(alpha)

            if prefix_year not in prefix:
                prefix = f"{prefix}{prefix_year}{alpha}"
        else:

            if prefix_year not in prefix:
                prefix = f"{prefix}{prefix_year}"

        next_number = await self.repository.next_number(prefix)

        return next_number, f"{prefix}-{sequencer(next_number, SEQUENCE_BEGIN)}"
