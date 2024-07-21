from datetime import datetime
from sqlalchemy.dialects.postgresql import insert


from domain.idsequence.ports.repository import IIdSequenceRepository
from domain.idsequence.exception import SequenceGenerateError
from infrastructure.database.repository.base import BaseRepository
from infrastructure.database.idsequencer.entities import IdSequence

SEQUENCE_BEGIN = 5
SEQUENCE_CUTOFF = 10


class IdSequenceRepository(BaseRepository[IdSequence], IIdSequenceRepository):
    def __init__(self) -> None:
        self.model = IdSequence
        super().__init__()

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
