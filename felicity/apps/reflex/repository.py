from felicity.apps.reflex.entities import (
    ReflexRule,
    ReflexBrainAddition,
    ReflexBrainFinal,
    ReflexBrainCriteria,
    ReflexBrain,
    ReflexAction,
)
from felicity.apps.abstract.repository import BaseRepository


class ReflexRuleRepository(BaseRepository[ReflexRule]):
    def __init__(self) -> None:
        super().__init__(ReflexRule)


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
