import sqlalchemy as sa

from domain.reflex.ports.repository import (
    IReflexRuleRepository,
    IReflexBrainAdditionRepository,
    IReflexBrainFinalRepository,
    IReflexBrainCriteriaRepository,
    IReflexBrainRepository,
    IReflexActionRepository,
)
from domain.shared.ports.paginator.cursor import PageCursor
from infrastructure.database.reflex.entities import (
    ReflexRule,
    ReflexBrainAddition,
    ReflexBrainFinal,
    ReflexBrainCriteria,
    ReflexBrain,
    ReflexAction,
)
from infrastructure.database.repository.base import BaseRepository


class ReflexRuleRepository(BaseRepository[ReflexRule], IReflexRuleRepository):
    def __init__(self) -> None:
        self.model = ReflexRule
        super().__init__()

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

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class ReflexBrainAdditionRepository(
    BaseRepository[ReflexBrainAddition], IReflexBrainAdditionRepository
):
    def __init__(self) -> None:
        self.model = ReflexBrainAddition
        super().__init__()


class ReflexBrainFinalRepository(
    BaseRepository[ReflexBrainFinal], IReflexBrainFinalRepository
):
    def __init__(self) -> None:
        self.model = ReflexBrainFinal
        super().__init__()


class ReflexBrainCriteriaRepository(
    BaseRepository[ReflexBrainCriteria], IReflexBrainCriteriaRepository
):
    def __init__(self) -> None:
        self.model = ReflexBrainCriteria
        super().__init__()


class ReflexBrainRepository(BaseRepository[ReflexBrain], IReflexBrainRepository):
    def __init__(self) -> None:
        self.model = ReflexBrain
        super().__init__()


class ReflexActionRepository(BaseRepository[ReflexAction], IReflexActionRepository):
    def __init__(self) -> None:
        self.model = ReflexAction
        super().__init__()
