from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.reflex.entities import (ReflexAction, ReflexBrain,
                                           ReflexBrainAddition,
                                           ReflexBrainCriteria,
                                           ReflexBrainFinal, ReflexRule,
                                           ComplexCondition)


class ReflexRuleRepository(BaseRepository[ReflexRule]):
    def __init__(self) -> None:
        super().__init__(ReflexRule)

    async def get_active_rules(self):
        """Retrieve all active reflex rules"""
        return await self.get_all(is_active=True, order_by="priority")


class ReflexBrainAdditionRepository(BaseRepository[ReflexBrainAddition]):
    def __init__(self) -> None:
        super().__init__(ReflexBrainAddition)

    async def get_by_conditions(self, conditions):
        """Retrieve additions based on specific conditions"""
        return await self.get_all(conditions=conditions)


class ReflexBrainFinalRepository(BaseRepository[ReflexBrainFinal]):
    def __init__(self) -> None:
        super().__init__(ReflexBrainFinal)

    async def get_by_conditions(self, conditions):
        """Retrieve final results based on specific conditions"""
        return await self.get_all(conditions=conditions)


class ReflexBrainCriteriaRepository(BaseRepository[ReflexBrainCriteria]):
    def __init__(self) -> None:
        super().__init__(ReflexBrainCriteria)

    async def get_by_custom_logic(self, custom_logic):
        """Retrieve criteria based on custom logic"""
        return await self.get_all(custom_logic=custom_logic)


class ComplexConditionRepository(BaseRepository[ComplexCondition]):
    def __init__(self) -> None:
        super().__init__(ComplexCondition)

    async def get_by_condition_type(self, condition_type):
        """Retrieve complex conditions by condition type"""
        return await self.get_all(condition_type=condition_type)


class ReflexBrainRepository(BaseRepository[ReflexBrain]):
    def __init__(self) -> None:
        super().__init__(ReflexBrain)

    async def get_with_complex_conditions(self):
        """Retrieve reflex brains with their associated complex conditions"""
        return await self.get_all(include_related=["complex_conditions"])


class ReflexActionRepository(BaseRepository[ReflexAction]):
    def __init__(self) -> None:
        super().__init__(ReflexAction)

    async def get_by_execution_order(self):
        """Retrieve reflex actions ordered by execution order"""
        return await self.get_all(order_by="execution_order")

    async def get_with_custom_logic(self):
        """Retrieve reflex actions with custom logic"""
        return await self.get_all(custom_logic__isnull=False)
