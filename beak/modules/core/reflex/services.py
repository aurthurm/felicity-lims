import logging
from operator import gt, lt, eq, ge, le, ne
from typing import List, Optional

from cachetools import TTLCache
from sqlalchemy.exc import IntegrityError

from beak.modules.core.abstract.service import BaseService
from beak.modules.core.analysis.entities.analysis import Analysis, Sample
from beak.modules.core.analysis.entities.results import AnalysisResult
from beak.modules.core.analysis.enum import ResultState
from beak.modules.core.analysis.schemas import AnalysisResultCreate, AnalysisResultUpdate
from beak.modules.core.analysis.services.result import AnalysisResultService
from beak.modules.core.reflex.entities import (
    ReflexRule,
    ReflexTrigger,
    ReflexDecision,
    ReflexRuleGroup,
    ReflexRuleCriteria, ReflexDecisionExecution,
)
from beak.modules.core.reflex.repository import (
    ReflexRuleRepository, ReflexTriggerRepository, ReflexDecisionRepository, ReflexRuleGroupRepository,
    ReflexRuleCriteriaRepository, ReflexAddAnalysisRepository, ReflexFinalizeAnalysisRepository,
    ReflexDecisionExecutionRepository,
)
from beak.modules.core.reflex.schemas import (
    ReflexRuleCreate,
    ReflexRuleUpdate, ReflexDecisionExecutionCreate,
)
from beak.core.dtz import timenow_dt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OPERAND_FUNCTIONS = {
    "eq": eq,
    "gt": gt,
    "lt": lt,
    "gte": ge,
    "lte": le,
    "neq": ne,
}

# Cache for storing reflex actions
reflex_trigger_cache = TTLCache(maxsize=1000, ttl=3600)  # 1 hour TTL
REFLEX_EXECUTION_RUNNING = "running"
REFLEX_EXECUTION_COMPLETED = "completed"
REFLEX_EXECUTION_FAILED = "failed"


def is_number(value) -> bool:
    """Helper function to check if a value can be treated as a number."""
    try:
        float(value)
        return True
    except (TypeError, ValueError):
        return False


class ReflexRuleService(BaseService[ReflexRule, ReflexRuleCreate, ReflexRuleUpdate]):
    def __init__(self):
        super().__init__(ReflexRuleRepository())


class ReflexTriggerService(BaseService):
    """Service for ReflexTrigger V2 entities (replaces ReflexTriggerService)"""

    def __init__(self):
        super().__init__(ReflexTriggerRepository())


class ReflexDecisionService(BaseService):
    """Service for ReflexDecision V2 entities (replaces ReflexDecisionService)"""

    def __init__(self):
        super().__init__(ReflexDecisionRepository())


class ReflexRuleGroupService(BaseService):
    """Service for ReflexRuleGroup V2 entities (replaces ReflexDecisionConditionService)"""

    def __init__(self):
        super().__init__(ReflexRuleGroupRepository())


class ReflexRuleCriteriaService(BaseService):
    """Service for ReflexRuleCriteria V2 entities (replaces ReflexDecisionConditionCriteriaService)"""

    def __init__(self):
        super().__init__(ReflexRuleCriteriaRepository())


class ReflexAddAnalysisService(BaseService):
    """Service for ReflexAddAnalysis V2 entities (replaces ReflexDecisionAdditionService)"""

    def __init__(self):
        super().__init__(ReflexAddAnalysisRepository())


class ReflexFinalizeAnalysisService(BaseService):
    """Service for ReflexFinalizeAnalysis"""

    def __init__(self):
        super().__init__(ReflexFinalizeAnalysisRepository())


class ReflexDecisionExecutionService(BaseService):
    """Service for ReflexDecisionExecution"""

    def __init__(self):
        super().__init__(ReflexDecisionExecutionRepository())


class ReflexEngineService:
    """
    Service class for handling reflex testing logic in a clinical laboratory setting.

    V2 version using:
    - ReflexTrigger.decisions
    - ReflexDecision.rule_groups (conditions) + add_analyses / finalize_analyses (actions)
    """

    def __init__(self):
        self.analysis_result_service = AnalysisResultService()
        self.reflex_trigger_service = ReflexTriggerService()
        # Keep your existing execution service name/class if already defined
        self.reflex_decision_execution_service = ReflexDecisionExecutionService()
        self._results_pool: list[AnalysisResult] | None = None
        self._results_by_analysis: dict[str, AnalysisResult] | None = None
        self._reflex_trigger: ReflexTrigger | None = None
        self.user = None
        self.analysis_result: AnalysisResult | None = None
        self.sample: Sample | None = None
        self.analysis: Analysis | None = None

    @classmethod
    async def set_reflex_triggers(cls, analysis_results: List[AnalysisResult]) -> None:
        """
        Prepare analysis results for reflex testing by setting initial reflex level to 1.
        """
        for result in analysis_results:
            logger.info(f"Setting reflex trigger for: {result} with level 1")
            trigger = await cls.get_reflex_trigger(
                analysis_uid=result.analysis_uid, level=1
            )
            if trigger:
                result.reflex_level = 1
                await AnalysisResultService().save(result)
                logger.info(f"Reflex trigger set for {result}")

    @staticmethod
    # @cached(cache=reflex_trigger_cache)
    async def get_reflex_trigger(
            analysis_uid: str,
            level: int,
    ) -> Optional[ReflexTrigger]:
        """
        Get reflex trigger with caching to improve performance.

        :param analysis_uid: UID of the analysis
        :param level: Reflex level
        :return: ReflexTrigger if found, None otherwise
        """
        filters = {"analyses___uid": analysis_uid, "level": level}
        logger.info(f"Reflex trigger searching with: {filters}")
        # Load decisions + rule groups + rules + actions
        return await ReflexTriggerService().get(
            **filters,
            related=[
                "decisions.rule_groups.rules",
                "decisions.add_analyses.analysis",
                "decisions.finalize_analyses.analysis",
            ],
        )

    async def do_reflex(self, analysis_result: AnalysisResult, user) -> None:
        """
        Execute the reflex testing process for the current analysis result.
        """
        self.user = user
        self.analysis_result = analysis_result
        self.sample = analysis_result.sample
        self.analysis = analysis_result.analysis
        self._results_pool = None
        self._results_by_analysis = None

        if not isinstance(self.analysis_result.reflex_level, int):
            logger.info(
                f"No reflex level set for analysis result: {self.analysis_result.uid}. "
                f"Skipping reflex."
            )
            return

        logger.info(
            f"Starting reflex for level: {self.analysis_result.reflex_level} "
            f"on SampleId {self.sample.sample_id}"
        )

        trigger = await self.get_reflex_trigger(
            self.analysis.uid,
            self.analysis_result.reflex_level,
        )
        if not trigger:
            logger.info(f"No reflex trigger found for analysis: {self.analysis.name}")
            return

        self._reflex_trigger = trigger
        logger.info(f"Reflex trigger found for analysis: {self.analysis.name}")
        logger.info(f"Reflex trigger description: {trigger.description}")

        decisions = sorted(trigger.decisions or [], key=lambda d: d.priority)
        logger.info(f"Processing {len(decisions)} Reflex Decisions")

        for index, decision in enumerate(decisions, 1):
            logger.info(
                f"Processing Reflex Decision {index}/{len(decisions)} "
                f"(uid={decision.uid}, priority={decision.priority})"
            )
            await self.decide(decision)

    @staticmethod
    def can_decide(results_pool: list[AnalysisResult]) -> bool:
        """
        Check if all results in consideration are approved and a decision can be made.
        """
        return bool(results_pool) and all(
            r.status == ResultState.APPROVED for r in results_pool
        )

    async def decide(self, decision: ReflexDecision) -> None:
        """
        Make a decision based on the reflex decision and execute actions if criteria are met.
        """
        logger.info(f"Making reflex decision for decision: {decision.uid}")
        logger.info(f"ReflexDecision description: {decision.description}")

        rule_groups = decision.rule_groups or []
        if not rule_groups:
            logger.warning(
                "No rule groups found for decision. -- skipping decision."
            )
            return

        if not (decision.add_analyses or decision.finalize_analyses):
            logger.warning(
                "No actions (add_analyses/finalize_analyses) found for decision. "
                "-- skipping decision."
            )
            return

        results_pool = await self.get_results_pool(rule_groups)
        if not self.can_decide(results_pool):
            logger.info(
                f"Decision cannot be made. Aborting reflex: "
                f"{[r.status for r in results_pool]}"
            )
            return

        # 1. Evaluate rule groups (OR over groups, AND inside each group)
        can_action = await self.evaluate(
            rule_groups=rule_groups,
            results_pool=results_pool,
        )
        if not can_action:
            logger.info(
                "Evaluations do not meet the criteria for decision: "
                "Cannot execute actions"
            )
            return

        # 2. If criteria expectations are met then take action
        logger.info("Decision criteria met. Executing matching actions.")
        execution = await self._acquire_decision_execution(decision)
        if not execution:
            logger.info(
                "Reflex decision already executed for sample. "
                "Skipping duplicate actions."
            )
            return

        try:
            await self.apply_actions(decision, results_pool)
            await self.reflex_decision_execution_service.update(
                execution.uid, {"status": REFLEX_EXECUTION_COMPLETED}
            )
        except Exception:
            await self.reflex_decision_execution_service.update(
                execution.uid, {"status": REFLEX_EXECUTION_FAILED}
            )
            raise

    async def evaluate(
            self,
            rule_groups: list[ReflexRuleGroup],
            results_pool: List[AnalysisResult],
    ) -> bool:
        """
        Evaluate rule groups for decision-making.

        - AND inside each group (all rules must pass).
        - OR across groups (at least one group must pass).
        """
        evaluations: list[bool] = []

        # First: evaluate AND logic inside each group
        for group in rule_groups:
            evaluations.append(
                await self._eval_rule_group(group, results_pool)
            )

        # Second: OR logic across groups: at least one group must be met
        return any(evaluations)

    @staticmethod
    async def _eval_rule_group(
            rule_group: ReflexRuleGroup,
            results_pool: List[AnalysisResult],
    ) -> bool:
        """
        Evaluate a single rule group against the results pool.

        - All rules in the group must be satisfied (AND).
        """
        logger.info(
            f"Evaluating rule group: {rule_group.description} "
            f"(uid={rule_group.uid})"
        )

        rules = rule_group.rules or []
        if not rules:
            logger.info("Rule group has no rules; cannot evaluate.")
            return False

        # Limit results to those relevant to rules under evaluation
        _group_analyses = [rule.analysis_uid for rule in rules]
        relevant_pool = [
            result
            for result in results_pool
            if result.analysis_uid in _group_analyses
        ]

        if not relevant_pool:
            logger.info("No relevant results pool was found for this rule group.")
            return False

        evaluations: list[bool] = []

        # AND: all rules in this group must pass
        for rule in rules:
            matches = [
                result
                for result in relevant_pool
                if result.analysis_uid == rule.analysis_uid
            ]

            if not matches:
                logger.info(
                    f"Rule analysis not found in relevant result pool: "
                    f"{rule.analysis_uid}"
                )
                return False

            comparison_func = OPERAND_FUNCTIONS.get(rule.operator)
            if comparison_func is None:
                logger.error(f"Unsupported operator: {rule.operator}")
                return False

            successful_hits = 0
            for match in matches:
                match_value = match.result
                criteria_value = rule.value

                all_numbers = [is_number(match_value), is_number(criteria_value)]

                # One numeric, one string → cannot compare safely
                if not all(all_numbers) and any(all_numbers):
                    logger.warning(
                        f"Cannot compare number and string: "
                        f"{match_value} {rule.operator} {criteria_value}"
                    )
                    continue

                # Numeric comparison
                if all(all_numbers):
                    match_value = float(match_value)
                    criteria_value = float(criteria_value)
                else:
                    # String comparison: only allow eq/neq
                    if rule.operator not in ("eq", "neq"):
                        logger.error(
                            "Incorrect operator for string matching: %s",
                            rule.operator,
                        )
                        continue

                try:
                    evaluations.append(
                        comparison_func(match_value, criteria_value)
                    )
                    successful_hits += 1
                except ValueError as e:
                    logger.error(f"Error comparing results: {e}")
                    return False

            if successful_hits == 0:
                logger.info(
                    "No evaluation matches were found for rule in this group"
                )
                return False

            if successful_hits > 1:
                logger.warning(
                    f"More than one successful match for rule: "
                    f"{rule.analysis_uid}"
                )

        if not evaluations:
            logger.info(
                "No evaluations matches were found during rule group evaluation"
            )
            return False

        # AND: all rules must be met
        return all(evaluations)

    async def apply_actions(
            self,
            decision: ReflexDecision,
            results_pool: List[AnalysisResult],
    ) -> None:
        """
        Execute actions for a matching reflex decision.

        Actions are defined directly on the decision:
        - decision.add_analyses → create new AnalysisResult(s)
        - decision.finalize_analyses → create + finalize with value
        """
        logger.info(
            f"Executing actions for matching decision uid={decision.uid} "
            f"(add_analyses={len(decision.add_analyses or [])}, "
            f"finalize_analyses={len(decision.finalize_analyses or [])})"
        )

        # Add new Analyses
        for addition in decision.add_analyses or []:
            logger.info(
                f"Adding {addition.count} instance(s) of analysis: "
                f"{addition.analysis_uid}"
            )
            for _ in range(addition.count):
                await self.create_analyte_for(addition.analysis_uid)

        # Finalise Analyses
        logger.info(
            f"Finalizing {len(decision.finalize_analyses or [])} analyses"
        )
        for final in decision.finalize_analyses or []:
            logger.info(
                f"Finalizing analysis {final.analysis.uid} with value: {final.value}"
            )
            await self.create_final_for(final.analysis.uid, final.value)

        # Clean up: hide reports for results that were used in this decision
        logger.info("Hiding reports for used results")
        for r in results_pool:
            if r.reportable:
                logger.info(f"Hiding report for result: {r.uid}")
                await self.analysis_result_service.hide_report(r.uid)

    async def get_results_pool(
            self,
            rule_groups: list[ReflexRuleGroup],
    ) -> List[AnalysisResult]:
        """
        Get a pool of relevant analysis results for the given rule groups.

        :param rule_groups: List of ReflexRuleGroup to filter results for all rules
        :return: List of relevant AnalysisResult objects
        """
        rules: list[ReflexRuleCriteria] = []
        for group in rule_groups:
            rules.extend(group.rules or [])

        criteria_anals = set(rule.analysis_uid for rule in rules)
        logger.info(f"Criteria analyses: {criteria_anals}")

        if self._results_by_analysis is None:
            results: List[AnalysisResult] = await self.analysis_result_service.get_all(
                sample_uid=self.sample.uid,
                related=["analysis"],
            )
            results.sort(key=lambda x: x.created_at, reverse=True)
            self._results_by_analysis = {}
            for result in results:
                if result.analysis_uid not in self._results_by_analysis:
                    self._results_by_analysis[result.analysis_uid] = result

        self._results_pool = [
            self._results_by_analysis[analysis_uid]
            for analysis_uid in criteria_anals
            if analysis_uid in self._results_by_analysis
        ]

        logger.info(
            "Entire (relevant) results pool: %s",
            [(r.analysis.name, r.result) for r in self._results_pool],
        )
        return self._results_pool

    async def _acquire_decision_execution(
            self,
            decision: ReflexDecision,
    ) -> ReflexDecisionExecution | None:
        """
        Attempt to create a reflex execution record to guarantee idempotency.

        Returns:
            ReflexDecisionExecution when acquired, otherwise None if already executed.
        """
        if not decision.uid:
            return None
        payload = ReflexDecisionExecutionCreate(
            sample_uid=self.sample.uid,
            reflex_decision_uid=decision.uid,  # keep field name as in your current schema
            status=REFLEX_EXECUTION_RUNNING,
        )
        try:
            return await self.reflex_decision_execution_service.create(payload)
        except IntegrityError:
            return None

    async def create_analyte_for(self, analysis_uid: str) -> AnalysisResult:
        """
        Create a new analyte (analysis result) for a given analysis.
        """
        logger.info(f"Creating analyte for: {analysis_uid}")

        a_result_in = {
            "sample_uid": self.sample.uid,
            "analysis_uid": analysis_uid,
            "status": ResultState.PENDING,
            "laboratory_instrument_uid": self.analysis_result.laboratory_instrument_uid,
            "method_uid": self.analysis_result.method_uid,
            "parent_id": self.analysis_result.uid,
            "retest": True,
            "reflex_level": self.analysis_result.reflex_level + 1,
        }
        a_result_schema = AnalysisResultCreate(**a_result_in)
        retest = await self.analysis_result_service.create(a_result_schema)
        await self.analysis_result_service.hide_report(self.analysis_result.uid)
        return retest

    async def create_final_for(self, analysis_uid: str, value: str) -> AnalysisResult:
        """
        Create a final analysis result for a given analysis and value.
        """
        logger.info(f"Creating final result for: {analysis_uid} with value: {value}")
        retest = await self.create_analyte_for(analysis_uid)
        res_in = AnalysisResultUpdate(
            result=value,
            submitted_by_uid=self.user.uid,
            date_submitted=timenow_dt(),
            status=ResultState.RESULTED,
            retest=False,
            reportable=True,
            reflex_level=None,
        )
        await self.analysis_result_service.update(retest.uid, res_in)
        return await self.analysis_result_service.verify(retest.uid, verifier=self.user)
