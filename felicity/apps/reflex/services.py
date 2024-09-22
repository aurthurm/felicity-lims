import logging
from datetime import datetime
from operator import gt, lt, eq, ge, le, ne
from typing import List, Optional

from cachetools import TTLCache, cached

from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.analysis import Analysis, Sample
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.analysis.enum import ResultState
from felicity.apps.analysis.schemas import AnalysisResultCreate, AnalysisResultUpdate
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.reflex.entities import (
    ReflexRule,
    ReflexBrainAddition,
    ReflexBrainFinal,
    ReflexBrain,
    ReflexAction,
    ReflexBrainCondition,
    ReflexBrainConditionCriteria,
    ReflexBrainAction,
)
from felicity.apps.reflex.repository import (
    ReflexActionRepository,
    ReflexBrainAdditionRepository,
    ReflexBrainFinalRepository,
    ReflexBrainRepository,
    ReflexRuleRepository,
    ReflexBrainConditionRepository,
    ReflexBrainActionRepository,
    ReflexBrainConditionCriteriaRepository,
)
from felicity.apps.reflex.schemas import (
    ReflexActionCreate,
    ReflexActionUpdate,
    ReflexBrainAdditionCreate,
    ReflexBrainAdditionUpdate,
    ReflexBrainCreate,
    ReflexBrainFinalCreate,
    ReflexBrainFinalUpdate,
    ReflexBrainUpdate,
    ReflexRuleCreate,
    ReflexRuleUpdate,
    ReflexBrainConditionCreate,
    ReflexBrainConditionUpdate,
    ReflexBrainConditionCriteriaCreate,
    ReflexBrainConditionCriteriaUpdate,
    ReflexBrainActionCreate,
    ReflexBrainActionUpdate,
)

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
reflex_action_cache = TTLCache(maxsize=1000, ttl=3600)  # 1 hour TTL


def is_number(value) -> bool:
    """Helper function to check if a value can be treated as a number."""
    try:
        float(value)
        return True
    except ValueError:
        return False


class ReflexRuleService(BaseService[ReflexRule, ReflexRuleCreate, ReflexRuleUpdate]):
    def __init__(self):
        super().__init__(ReflexRuleRepository)


class ReflexBrainAdditionService(
    BaseService[
        ReflexBrainAddition, ReflexBrainAdditionCreate, ReflexBrainAdditionUpdate
    ]
):
    def __init__(self):
        super().__init__(ReflexBrainAdditionRepository)


class ReflexBrainFinalService(
    BaseService[ReflexBrainFinal, ReflexBrainFinalCreate, ReflexBrainFinalUpdate]
):
    def __init__(self):
        super().__init__(ReflexBrainFinalRepository)


class ReflexBrainActionService(
    BaseService[ReflexBrainAction, ReflexBrainActionCreate, ReflexBrainActionUpdate]
):
    def __init__(self):
        super().__init__(ReflexBrainActionRepository)


class ReflexBrainConditionService(
    BaseService[
        ReflexBrainCondition, ReflexBrainConditionCreate, ReflexBrainConditionUpdate
    ]
):
    def __init__(self):
        super().__init__(ReflexBrainConditionRepository)


class ReflexBrainConditionCriteriaService(
    BaseService[
        ReflexBrainConditionCriteria,
        ReflexBrainConditionCriteriaCreate,
        ReflexBrainConditionCriteriaUpdate,
    ]
):
    def __init__(self):
        super().__init__(ReflexBrainConditionCriteriaRepository)


class ReflexBrainService(
    BaseService[ReflexBrain, ReflexBrainCreate, ReflexBrainUpdate]
):
    def __init__(self):
        super().__init__(ReflexBrainRepository)


class ReflexActionService(
    BaseService[ReflexAction, ReflexActionCreate, ReflexActionUpdate]
):
    def __init__(self):
        super().__init__(ReflexActionRepository)


class ReflexEngineService:
    """
    Service class for handling reflex testing logic in a clinical laboratory setting.

    This class manages the process of applying reflex rules to analysis results,
    determining when additional tests are needed, and executing those tests.
    """

    def __init__(self, analysis_result: AnalysisResult, user):
        self.analysis_result = analysis_result
        self.sample: Sample = analysis_result.sample
        self.analysis: Analysis = analysis_result.analysis
        self.user = user
        self.analysis_result_service = AnalysisResultService()
        self.reflex_action_service = ReflexActionService()
        self._results_pool: Optional[List[AnalysisResult]] = None
        self._reflex_action: Optional[ReflexAction] = None
        logger.info(
            f"ReflexEngineService initialized for analysis result: {analysis_result.uid}"
        )

    async def set_reflex_actions(self, analysis_results: List[AnalysisResult]) -> None:
        """
        Prepare analysis results for reflex testing by setting initial reflex level to 1.

        :param analysis_results: List of analysis results to prepare for reflex testing
        """
        for result in analysis_results:
            logger.info(f"Setting reflex actions for: {result} with level 1")
            action = await self.get_reflex_action(result.analysis_uid, 1)
            if action:
                result.reflex_level = 1
                await self.analysis_result_service.save(result)
                logger.info(f"Reflex actions set for {result}")

    @cached(cache=reflex_action_cache)
    async def get_reflex_action(
        self, analysis_uid: str, level: int
    ) -> Optional[ReflexAction]:
        """
        Get reflex action with caching to improve performance.

        :param analysis_uid: UID of the analysis
        :param level: Reflex level
        :return: ReflexAction if found, None otherwise
        """
        filters = {"analyses___uid": analysis_uid, "level": level}
        logger.info(f"Reflex actions searching with: {filters}")
        return await self.reflex_action_service.get_related(
            **filters, related=["brains.conditions.criteria", "brains.actions"]
        )

    async def do_reflex(self) -> None:
        """
        Execute the reflex testing process for the current analysis result.
        """
        if not isinstance(self.analysis_result.reflex_level, int):
            logger.info(
                f"No reflex level set for analysis result: {self.analysis_result.uid}. Skipping reflex."
            )
            return

        logger.info(
            f"Starting reflex for level: {self.analysis_result.reflex_level} on SampleId {self.sample.sample_id}"
        )

        action = await self.get_reflex_action(
            self.analysis.uid, self.analysis_result.reflex_level
        )
        if not action:
            logger.info(f"No reflex action found for analysis: {self.analysis.name}")
            return

        self._reflex_action = action
        logger.info(f"Reflex action found for analysis: {self.analysis.name}")
        logger.info(f"Reflex action description: {action.description}")

        logger.info(f"Processing {len(self._reflex_action.brains)} Reflex Brains")
        for index, brain in enumerate(self._reflex_action.brains, 1):
            logger.info(
                f"Processing Reflex Brain {index}/{len(self._reflex_action.brains)}"
            )
            await self.decide(brain)

    @staticmethod
    def can_decide(results_pool: list[AnalysisResult]) -> bool:
        """
        Check if all results in consideration are approved and a decision can be made.

        :param results_pool: List of analysis results to check
        :return: True if all results are approved, False otherwise
        """
        return bool(results_pool) and all(
            r.status == ResultState.APPROVED for r in results_pool
        )

    async def decide(self, brain: ReflexBrain) -> None:
        """
        Make a decision based on the reflex brain and execute actions if criteria are met.

        :param brain: ReflexBrain object containing decision criteria and actions
        """
        logger.info(f"Making reflex decision for brain: {brain}")
        logger.info(f"ReflexBrain description: {brain.description}")

        if not brain.conditions:
            logger.warning("No conditions found for brain. -- skipping decision.")
            return

        if not brain.actions:
            logger.warning("No actions found for brain. -- skipping decision.")
            return

        results_pool = await self.get_results_pool(brain.conditions)
        if not self.can_decide(results_pool):
            logger.info(
                f"Decision cannot be made. Aborting reflex: {[r.status for r in results_pool]}"
            )
            return

        # 1. Evaluate conditions
        can_action = await self.evaluate(
            conditions=brain.conditions, results_pool=results_pool
        )
        if not can_action:
            logger.info(
                "Evaluations do not meet the criteria for brain: Cannot execute actions"
            )
            return

        # 2. If brain criteria expectations are met then take action
        logger.info("Brain criteria met. Executing matching actions.")
        await self.apply_actions(brain.actions, results_pool)

    async def evaluate(
        self, conditions: list[ReflexBrainCondition], results_pool: List[AnalysisResult]
    ) -> bool:
        """
        Evaluate conditions for decision-making.

        :param conditions: List of ReflexBrainCondition for this decision
        :param results_pool: List of analysis results to use in evaluation
        :return: Boolean result of the evaluation
        """

        evaluations = []
        # 1st evaluate AND: All criteria within a condition
        for condition in conditions:
            evaluations.append(await self._eval_condition(condition, results_pool))

        # 2nd evaluate OR: at least one condition must be met :: any()
        return any(evaluations)

    @staticmethod
    async def _eval_condition(
        condition: ReflexBrainCondition, results_pool: List[AnalysisResult]
    ) -> bool:
        """
        Evaluate a single condition against the results pool.

        :param condition: ReflexBrainCondition to evaluate
        :param results_pool: List of analysis results to use in evaluation
        Returns:
            Boolean result of the evaluation
        """
        logger.info(f"Evaluating condition: {condition.description}")

        # limit results to those relevant to conditions under evaluation
        _condition_analyses = [criteria.analysis_uid for criteria in condition.criteria]
        relevant_pool = [
            result
            for result in results_pool
            if result.analysis_uid in _condition_analyses
        ]

        if not relevant_pool:
            logger.info("No relevant results pool was found for this condition.")
            return False

        # Perform comparison based on criteria :ALl criteria must pass
        evaluations: list[bool] = []
        for criteria in condition.criteria:
            # find all matching analyses results
            matches = [
                result
                for result in relevant_pool
                if result.analysis_uid == criteria.analysis_uid
            ]
            if not matches:
                logger.info(
                    f"Criteria analyses not found in relevant result pool: {criteria.analysis_uid}"
                )
                return False

            # Get the comparison function based on the operator
            comparison_func = OPERAND_FUNCTIONS.get(criteria.operator)
            if comparison_func is None:
                logger.error(f"Unsupported operator: {criteria.operator}")
                return False

            # Perform the comparison for each matching result
            successful_hits = 0
            for match in matches:
                match_value = match.result
                criteria_value = criteria.value

                all_numbers = [is_number(match_value), is_number(criteria_value)]

                # if one is numer and another is string
                # not all(all_numbers): Checks if not both values are numbers (i.e., at least one is not a number).
                # any(all_numbers): Checks if at least one of the values is a number.
                if not all(all_numbers) and any(all_numbers):
                    logger.warning(
                        f"Cannot compare number and string: {match_value} {criteria.operator}, {criteria_value}"
                    )
                    continue
                    # return False

                # Determine if the values are numeric or strings
                if all(all_numbers):
                    # Convert both to float for numeric comparison
                    match_value = float(match_value)
                    criteria_value = float(criteria_value)
                else:
                    # Compare as strings: check that the operator is =
                    if not (criteria.operator == "="):
                        logger.error(
                            f"Incorrect operator for string matching: {criteria.operator}"
                        )
                        continue

                try:
                    # Append the result of the comparison (True or False)
                    evaluations.append(comparison_func(match_value, criteria_value))
                    successful_hits += 1
                except ValueError as e:
                    logger.error(f"Error comparing results: {e}")
                    return False

            if successful_hits == 0:
                # All matched results had some issues during comparison
                # No need to proceed further since a criteria has already failed
                logger.info("No evaluations matches were found during evaluation")
                return False

            if successful_hits > 1:
                logger.warning(
                    f"More than one successful match for criteria: {criteria.analysis_uid}"
                )

        if not evaluations:
            logger.info("No evaluations matches were found during evaluation")
            return False

        # AND: all criteria must be met
        return all(evaluations)

    async def apply_actions(
        self, actions: list[ReflexBrainAction], results_pool: List[AnalysisResult]
    ) -> None:
        """
        Execute actions for a matching reflex brain.

        :param actions: ReflexBrainAction object containing actions to execute
        :param results_pool: List of analysis results
        """
        logger.info("Executing actions for matching brain.")

        for action in actions:
            # Add new Analyses
            for addition in action.add_new:
                logger.info(
                    f"Adding {addition.count} instance(s) of analysis: {addition.analysis_uid}"
                )
                for _ in range(addition.count):
                    await self.create_analyte_for(addition.analysis_uid)

            # Finalise Analyses
            logger.info(f"Finalizing {len(action.finalise)} analyses")
            for final in action.finalise:
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
        self, conditions: list[ReflexBrainCondition]
    ) -> List[AnalysisResult]:
        """
        Get a pool of relevant analysis results for the given conditions.

        :param conditions: List of ReflexBrainCondition to filter results for all criteria
        :return: List of relevant AnalysisResult objects
        """
        criteria = []
        for condition in conditions:
            criteria = criteria + condition.criteria

        total_criteria = len(criteria)
        criteria_anals = set(cr.analysis_uid for cr in criteria)
        logger.info(f"Criteria analyses: {criteria_anals}")

        if self._results_pool is None:
            # Fetch all results for the sample if not already cached
            results: List[
                AnalysisResult
            ] = await self.analysis_result_service.get_related(
                sample_uid=self.sample.uid, many=True, related=["analysis"]
            )
            # Filter results based on criteria -- limits to relevant analysis results
            self._results_pool = [
                result for result in results if result.analysis_uid in criteria_anals
            ]

        logger.info(
            f"Entire (relevant) results pool: {[(r.analysis.name, r.result) for r in self._results_pool]}"
        )
        # Sort results by creation date (newest first) and return the required number
        self._results_pool.sort(key=lambda x: x.created_at, reverse=True)
        return self._results_pool[:total_criteria]

    async def create_analyte_for(self, analysis_uid: str) -> AnalysisResult:
        """
        Create a new analyte (analysis result) for a given analysis.

        :param analysis_uid: UID of the analysis to create a new result for
        :return: Newly created AnalysisResult
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

        :param analysis_uid: UID of the analysis to create a final result for
        :param value: Final result value
        :return: Newly created AnalysisResult
        """
        logger.info(f"Creating final result for: {analysis_uid} with value: {value}")
        retest = await self.create_analyte_for(analysis_uid)
        res_in = AnalysisResultUpdate(
            result=value,
            submitted_by_uid=self.user.uid,
            date_submitted=datetime.now(),
            status=ResultState.RESULTED,
            retest=False,
            reportable=True,
            reflex_level=None,
        )
        await self.analysis_result_service.update(retest.uid, res_in)
        return await self.analysis_result_service.verify(retest.uid, verifier=self.user)
