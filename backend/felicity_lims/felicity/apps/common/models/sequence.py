import logging
from datetime import datetime

from felicity.apps.common.utils import sequencer
from felicity.database.base_class import DBModel
from felicity.database.session import async_session_factory
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import insert

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class IdSequence(DBModel):
    prefix = Column(String, nullable=False, unique=True)
    number = Column(Integer, nullable=False)

    @classmethod
    async def get_next_number(cls, prefix: str = None):
        if not prefix:
            raise Exception("prefix must not be empty")

        prefix_year = str(datetime.now().year)[2:]
        if prefix_year not in prefix:
            prefix = f"{prefix}{prefix_year}"

        insert_stmt = (
            insert(IdSequence)
            .values(prefix=prefix, number=1)
            .on_conflict_do_update(
                index_elements=["prefix"], set_=dict(number=IdSequence.number + 1)
            )
            .returning(IdSequence.number)
        )

        async with async_session_factory() as session:
            results = await session.execute(insert_stmt)

            try:
                await session.flush()
                await session.commit()
            except Exception as e:
                session.rollback()
                raise Exception(f"Failed to generate sequential id {e}")

        next_number = results.scalars().first()

        return next_number, f"{prefix}-{sequencer(next_number + 5, 5)}"
