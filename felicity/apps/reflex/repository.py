from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.reflex.entities import (ReflexAction, ReflexBrain,
                                           ReflexBrainAddition,
                                           ReflexBrainCondition,
                                           ReflexBrainFinal, ReflexRule, ReflexBrainConditionCriteria,
                                           ReflexBrainAction,
                                           )


class ReflexRuleRepository(BaseRepository[ReflexRule]):
    def __init__(self) -> None:
        super().__init__(ReflexRule)


class ReflexBrainAdditionRepository(BaseRepository[ReflexBrainAddition]):
    def __init__(self) -> None:
        super().__init__(ReflexBrainAddition)


class ReflexBrainFinalRepository(BaseRepository[ReflexBrainFinal]):
    def __init__(self) -> None:
        super().__init__(ReflexBrainFinal)


class ReflexBrainActionRepository(BaseRepository[ReflexBrainAction]):
    def __init__(self) -> None:
        super().__init__(ReflexBrainAction)


class ReflexBrainConditionRepository(BaseRepository[ReflexBrainCondition]):
    def __init__(self) -> None:
        super().__init__(ReflexBrainCondition)


class ReflexBrainConditionCriteriaRepository(BaseRepository[ReflexBrainConditionCriteria]):
    def __init__(self) -> None:
        super().__init__(ReflexBrainConditionCriteria)


class ReflexBrainRepository(BaseRepository[ReflexBrain]):
    def __init__(self) -> None:
        super().__init__(ReflexBrain)


class ReflexActionRepository(BaseRepository[ReflexAction]):
    def __init__(self) -> None:
        super().__init__(ReflexAction)
