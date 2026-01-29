from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.reflex.entities import (
    ReflexRule,
    ReflexTrigger,
    ReflexDecision,
    ReflexRuleGroup,
    ReflexRuleCriteria,
    ReflexAddAnalysis,
    ReflexFinalizeAnalysis, ReflexDecisionExecution,
)


class ReflexRuleRepository(BaseRepository[ReflexRule]):
    def __init__(self) -> None:
        super().__init__(ReflexRule)


class ReflexTriggerRepository(BaseRepository[ReflexTrigger]):
    """Repository for ReflexTrigger"""

    def __init__(self) -> None:
        super().__init__(ReflexTrigger)


class ReflexDecisionRepository(BaseRepository[ReflexDecision]):
    """Repository for ReflexDecision"""

    def __init__(self) -> None:
        super().__init__(ReflexDecision)


class ReflexRuleGroupRepository(BaseRepository[ReflexRuleGroup]):
    """Repository for ReflexRuleGroup"""

    def __init__(self) -> None:
        super().__init__(ReflexRuleGroup)


class ReflexRuleCriteriaRepository(BaseRepository[ReflexRuleCriteria]):
    """Repository for ReflexRuleCriteria"""

    def __init__(self) -> None:
        super().__init__(ReflexRuleCriteria)


class ReflexAddAnalysisRepository(BaseRepository[ReflexAddAnalysis]):
    """Repository for ReflexAddAnalysis"""

    def __init__(self) -> None:
        super().__init__(ReflexAddAnalysis)


class ReflexFinalizeAnalysisRepository(BaseRepository[ReflexFinalizeAnalysis]):
    """Repository for ReflexFinalizeAnalysis"""

    def __init__(self) -> None:
        super().__init__(ReflexFinalizeAnalysis)


class ReflexDecisionExecutionRepository(BaseRepository[ReflexDecisionExecution]):
    """Repository for ReflexDecisionExecution"""

    def __init__(self) -> None:
        super().__init__(ReflexDecisionExecution)
