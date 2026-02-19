from sqlalchemy.ext.asyncio import AsyncSession

from beak.modules.core.abstract.service import BaseService
from beak.modules.core.common.schemas.dummy import Dummy
from beak.modules.core.idsequencer.conf import SEQUENCE_CUTOFF, PADDING_LENGTH
from beak.modules.core.idsequencer.entities import IdSequence
from beak.modules.core.idsequencer.exception import IncompleDataError
from beak.modules.core.idsequencer.repository import IdSequenceRepository
from beak.modules.core.idsequencer.utils import sequence_alpha, sequencer
from beak.core.dtz import timenow_dt


class IdSequenceService(BaseService[IdSequence, Dummy, Dummy]):
    def __init__(self) -> None:
        self.repository: IdSequenceRepository = IdSequenceRepository()
        super().__init__(self.repository)

    async def get_next_number(
        self,
        prefix: str | None = None,
        generic=False,
        commit: bool = True,
        session: AsyncSession | None = None,
    ) -> tuple[int, str]:
        if not prefix:
            raise IncompleDataError("A prefix is required")
        prefix_year = str(timenow_dt().year)[2:]

        if generic:
            fetch = await self.get_all(
                prefix__istartswith=f"{prefix}{prefix_year}", session=session
            )
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

        next_number = await self.repository.next_number(
            prefix=prefix, commit=commit, session=session
        )

        return next_number, f"{prefix}-{sequencer(next_number, PADDING_LENGTH)}"
