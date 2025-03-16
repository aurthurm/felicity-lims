from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract import BaseRepository
from felicity.apps.idsequencer.entities import IdSequence
from felicity.apps.idsequencer.exception import SequenceGenerateError
from felicity.core.dtz import timenow_dt


class IdSequenceRepository(BaseRepository[IdSequence]):
    def __init__(self) -> None:
        super().__init__(IdSequence)

    async def next_number(self, prefix: str, commit=True, session: AsyncSession | None = None) -> int:
        insert_stmt = (
            insert(self.model)
            .values(prefix=prefix, number=1)
            .on_conflict_do_update(
                index_elements=["prefix"],
                set_=dict(
                    prefix=prefix,
                    number=self.model.number + 1,
                    updated=timenow_dt(),
                ),
            )
            .returning(self.model.number)
        )

        if session:
            results = await session.execute(insert_stmt)
            if commit:
                await session.flush()
        else:
            async with self.async_session() as session:
                results = await session.execute(insert_stmt)

            try:
                await session.flush()
                await session.commit()
            except Exception as e:
                session.rollback()
                raise SequenceGenerateError(f"Failed to generate sequential id {e}")

        return results.scalars().first()
