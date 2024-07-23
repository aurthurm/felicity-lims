import sqlalchemy as sa

from felicity.apps.reflex.entities import (
    ReflexRule,
    ReflexBrainAddition,
    ReflexBrainFinal,
    ReflexBrainCriteria,
    ReflexBrain,
    ReflexAction,
)
from felicity.database.paging import PageCursor
from felicity.apps.abstract.repository import BaseRepository


class ReflexRuleRepository(BaseRepository[ReflexRule]):
    def __init__(self) -> None:
        super().__init__(ReflexRule)

    async def paginate_with_cursors(
            self,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> PageCursor:
        filters = {}

        _or_ = dict()
        if text:
            arg_list = ["name__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        return super().paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class ReflexBrainAdditionRepository(
    BaseRepository[ReflexBrainAddition]
):
    def __init__(self) -> None:
        super().__init__(ReflexBrainAddition)


class ReflexBrainFinalRepository(
    BaseRepository[ReflexBrainFinal]
):
    def __init__(self) -> None:
        super().__init__(ReflexBrainFinal)


class ReflexBrainCriteriaRepository(
    BaseRepository[ReflexBrainCriteria]
):
    def __init__(self) -> None:
        super().__init__(ReflexBrainCriteria)


class ReflexBrainRepository(BaseRepository[ReflexBrain]):
    def __init__(self) -> None:
        super().__init__(ReflexBrain)


class ReflexActionRepository(BaseRepository[ReflexAction]):
    def __init__(self) -> None:
        super().__init__(ReflexAction)
