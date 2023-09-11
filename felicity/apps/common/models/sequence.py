import logging
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import insert

from apps.common.utils import sequencer, sequence_alpha
from database.base_class import DBModel
from database.session import async_session_factory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class IdSequence(DBModel):
    __tablename__ = "id_sequence"

    prefix = Column(String, nullable=False, unique=True)
    number = Column(Integer, nullable=False)
    updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @classmethod
    async def get_next_number(cls, prefix: str = None, generic=False):

        if not prefix:
            raise Exception("A prefix is requred")
        prefix_year = str(datetime.now().year)[2:]

        if generic:
            fetch = await cls.get_all(prefix__istartswith=f"{prefix}{prefix_year}")
            if not fetch:
                alpha = f"AA"
            else:
                sequences = sorted(fetch, key=lambda s: s.updated, reverse=True)

                latest = sequences[0]

                alpha = latest.prefix.split(prefix_year)[1]
                if not alpha:
                    alpha = "AA"

                if latest.number >= 10:
                    alpha = sequence_alpha(alpha)

            if prefix_year not in prefix:
                prefix = f"{prefix}{prefix_year}{alpha}"
        else:

            if prefix_year not in prefix:
                prefix = f"{prefix}{prefix_year}"

        insert_stmt = (
            insert(IdSequence)
            .values(prefix=prefix, number=1)
            .on_conflict_do_update(
                index_elements=["prefix"],
                set_=dict(
                    prefix=prefix,
                    number=IdSequence.number + 1,
                    updated=datetime.utcnow(),
                ),
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

        return next_number, f"{prefix}-{sequencer(next_number, 5)}"
