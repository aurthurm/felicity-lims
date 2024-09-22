from datetime import datetime
from typing import TypeVar

from felicity.apps.abstract.service import BaseService
from felicity.apps.common.schemas.dummy import Dummy
from felicity.apps.idsequencer.conf import SEQUENCE_CUTOFF, PADDING_LENGTH
from felicity.apps.idsequencer.exception import IncompleDataError
from felicity.apps.idsequencer.repository import IdSequenceRepository
from felicity.apps.idsequencer.utils import sequence_alpha, sequencer

IdSequence = TypeVar("IdSequence")


class IdSequenceService(BaseService[IdSequence, Dummy, Dummy]):
    def __init__(self) -> None:
        super().__init__(IdSequenceRepository)

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

        return next_number, f"{prefix}-{sequencer(next_number, PADDING_LENGTH)}"
