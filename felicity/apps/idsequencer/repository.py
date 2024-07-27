from datetime import datetime

from sqlalchemy.dialects.postgresql import insert

from felicity.apps.abstract import BaseRepository
from felicity.apps.idsequencer.entities import IdSequence
from felicity.apps.idsequencer.exception import SequenceGenerateError

SEQUENCE_BEGIN = 5
SEQUENCE_CUTOFF = 10


class IdSequenceRepository(BaseRepository[IdSequence]):
    def __init__(self) -> None:
        super().__init__(IdSequence)

    async def next_number(self, prefix: str) -> int:

        insert_stmt = (
            insert(self.model)
            .values(prefix=prefix, number=1)
            .on_conflict_do_update(
                index_elements=["prefix"],
                set_=dict(
                    prefix=prefix,
                    number=self.model.number + 1,
                    updated=datetime.utcnow(),
                ),
            )
            .returning(self.model.number)
        )

        async with self.async_session() as session:
            results = await session.execute(insert_stmt)

            try:
                await session.flush()
                await session.commit()
            except Exception as e:
                session.rollback()
                raise SequenceGenerateError(f"Failed to generate sequential id {e}")

        return results.scalars().first()
