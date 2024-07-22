from datetime import datetime
from typing import List
import logging

from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis import conf
from felicity.apps.analysis.entities.analysis import Analysis, Sample
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.analysis.schemas import AnalysisResultCreate, AnalysisResultUpdate
from felicity.apps.reflex.repository import (
    ReflexRuleRepository,
    ReflexActionRepository,
    ReflexBrainRepository,
    ReflexBrainCriteriaRepository,
    ReflexBrainFinalRepository,
    ReflexBrainAdditionRepository,
)
from felicity.apps.reflex.schemas import (
    ReflexBrainAdditionCreate,
    ReflexBrainAdditionUpdate,
    ReflexBrainCriteriaCreate,
    ReflexBrainCriteriaUpdate,
    ReflexBrainFinalCreate,
    ReflexBrainFinalUpdate,
    ReflexRule,
    ReflexBrainAddition,
    ReflexBrainFinal,
    ReflexBrainCriteria,
    ReflexBrain,
    ReflexAction,
    ReflexRuleCreate,
    ReflexRuleUpdate,
    ReflexBrainCreate,
    ReflexBrainUpdate,
    ReflexActionCreate,
    ReflexActionUpdate,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ReflexRuleService(BaseService[ReflexRule, ReflexRuleCreate, ReflexRuleUpdate]):
    def __init__(self):
        super().__init__(ReflexRuleRepository)

class ReflexBrainAdditionService(
    BaseService[ReflexBrainAddition, ReflexBrainAdditionCreate, ReflexBrainAdditionUpdate]
):
    def __init__(self):
        super().__init__(ReflexBrainAdditionRepository)


class ReflexBrainFinalService(BaseService[ReflexBrainFinal, ReflexBrainFinalCreate, ReflexBrainFinalUpdate]):
    def __init__(self):
        super().__init__(ReflexBrainFinalRepository)


class ReflexBrainCriteriaService(
    BaseService[ReflexBrainCriteria, ReflexBrainCriteriaCreate, ReflexBrainCriteriaUpdate]
):
    def __init__(self):
        super().__init__(ReflexBrainCriteriaRepository)


class ReflexBrainService(BaseService[ReflexBrain, ReflexBrainCreate, ReflexBrainUpdate]):
    def __init__(self):
        super().__init__(ReflexBrainRepository)
      

class ReflexActionService(BaseService[ReflexAction, ReflexActionCreate, ReflexActionUpdate]):
    def __init__(self):
        super().__init__(ReflexActionRepository)


class ReflexEngineService:
    _siblings: List[AnalysisResult] = None
    _cousins: List[AnalysisResult] = None
    _results_pool: List[AnalysisResult] = None
    _reflex_action: ReflexAction = None

    def __init__(self, analysis_result, user):
        self.analysis_result: AnalysisResult = analysis_result
        self.sample: Sample = analysis_result.sample
        self.analysis: Analysis = analysis_result.analysis
        self.user = user

    # TODO: apply set_reflex_actions for already created analyses

    @classmethod
    async def set_reflex_actions(cls, analysis_results: List[AnalysisResult]):
        """Prepares an analysis result for reflex testing"""
        for result in analysis_results:
            logger.debug(f"set_reflex_actions for : {result}")
            filters = {"analyses___uid": result.analysis_uid, "level": 1}
            action: ReflexAction = await ReflexAction.get(
                **filters
            )
            if action:
                result.reflex_level = 1
                await result.save_async()
                logger.debug(f"set_reflex_actions done")

    async def do_reflex(self):
        if not self.analysis_result.reflex_level:
            return

        logger.info(
            f"do_reflex level: {self.analysis_result.reflex_level} <> SampleId {self.sample.sample_id}"
        )

        filters = {
            "analyses___uid": self.analysis.uid,
            "level": self.analysis_result.reflex_level,
        }
        action: ReflexAction = await ReflexAction.get(
            **filters
        )
        if not action:
            logger.info(f"No reflex action found for analysis: {self.analysis.name}")
            return
        self._reflex_action = action
        logger.info(f"Reflex action found for analysis: {self.analysis.name}")
        logger.info(f"Reflex action description: {action.description}")

        logger.info(f"Reflex Brains: {self._reflex_action.brains}")
        for brain in self._reflex_action.brains:
            await self.decide(brain)

    @staticmethod
    def can_decide(results_pool: list[AnalysisResult]):
        """If all results in consideration are approved then a decision can be made
        """
        if not results_pool:
            return False
        return all([r.status == conf.states.result.APPROVED for r in results_pool])

    async def decide(self, brain: ReflexBrain):
        logger.info(f"Reflex Decision for brain: {brain}")

        if not brain.analyses_values:
            return
        logger.info(f"Reflex brain analyses_values: {brain.analyses_values}")

        results_pool = await self.get_results_pool(brain.analyses_values)
        logger.info(f"relevant results_pool: {[r.result for r in results_pool]}")

        if not self.can_decide(results_pool):
            logger.info(f"A decision cannot be made -> aborting relex: {[r.status for r in results_pool]}")
            return

        # 1. criteria_values must match results_pool
        criteria_values = frozenset([
            (criteria.analysis_uid, criteria.value) for criteria in brain.analyses_values
        ])
        logger.info(f"criteria_values: {criteria_values}")
        results_values = frozenset([
            (result.analysis_uid, result.result) for result in results_pool
        ])
        logger.info(f"results_values: {results_values}")

        is_match = criteria_values == results_values

        # 2. If brain criteria expectations are met then take action
        if is_match:
            logger.info("Perfect match yay!")
            # Add new Analyses
            logger.info(f"add_new... : {brain.add_new}")
            for assoc in brain.add_new:
                for i in list(range(assoc.count)):
                    await self.create_analyte_for(assoc.analysis_uid)
            # Finalise Analyses
            logger.info(f"finalise... : {brain.finalise}")
            for final in brain.finalise:
                await self.create_final_for(final.analysis.uid, final.value)

            # clean up
            for r in results_pool:
                if r.reportable:
                    await r.hide_report()
        else:
            logger.info("No matches found :)")

    async def get_results_pool(self, criteria: list[ReflexBrainCriteria]):
        total_criteria = len(criteria)
        criteria_anals = list(set([cr.analysis_uid for cr in criteria]))
        logger.info(f"criteria_anals: {criteria_anals}")

        if self._results_pool is None:
            results: List[AnalysisResult] = await self.sample.get_analysis_results()
            self._results_pool = list(
                filter(lambda result: result.analysis_uid in criteria_anals, results)
            )
            if len(self._results_pool) > 1:
                self._results_pool = list(
                    filter(lambda result: result.uid != self.analysis_result.uid, self._results_pool)
                )

        logger.info(f"entire results_pool: {[r.result for r in self._results_pool]}")
        self._results_pool.sort(key=lambda x: x.created_at, reverse=True)
        return self._results_pool[:total_criteria]

    # async def siblings(self, latest_n: int = None):
    #     """
    #     Siblings of the current analysis result
    #     Analysis Results from the same sample that share the same analysis
    #     """
    #     if self._siblings is None:
    #         analysis_uid = self.analysis.uid
    #         results: List[AnalysisResult] = await self.sample.get_analysis_results()
    #         # get siblings and exclude current analysis
    #         self._siblings = list(
    #             filter(
    #                 lambda result: result.analysis_uid == analysis_uid
    #                                and result.uid != self.analysis_result.uid,
    #                 results,
    #             )
    #         )
    #
    #     # Sort the siblings by created_at in descending order and get the first latest_n items
    #     self._siblings.sort(key=lambda x: x.created_at, reverse=True)
    #     if latest_n:
    #         return self._siblings[:latest_n]
    #     return self._siblings
    #
    # async def cousins(self, latest_n: int = None):
    #     """
    #     Cousins of the current analysis result
    #     Analysis Results from the same sample that do not share the current result's analysis
    #     """
    #     if self._cousins is None:
    #         analysis_uid = self.analysis.uid
    #         results: List[AnalysisResult] = await self.sample.get_analysis_results()
    #         self._cousins = list(
    #             filter(lambda result: result.analysis_uid != analysis_uid, results)
    #         )
    #
    #     # Sort the cousins by created_at in descending order and get the first latest_n items
    #     self._cousins.sort(key=lambda x: x.created_at, reverse=True)
    #     if latest_n:
    #         return self._cousins[:latest_n]
    #     return self._cousins

    async def create_analyte_for(self, analysis_uid) -> AnalysisResult:
        logger.info(f"create_analyte_for: {analysis_uid}")
        analysis = await Analysis.get(uid=analysis_uid)

        a_result_in = {
            "sample_uid": self.sample.uid,
            "analysis_uid": analysis.uid,
            "status": conf.states.result.PENDING,
            "laboratory_instrument_uid": self.analysis_result.laboratory_instrument_uid,
            "method_uid": self.analysis_result.method_uid,
            "parent_id": self.analysis_result.uid,
            "retest": True,
            "reflex_level": self.analysis_result.reflex_level + 1,
        }
        a_result_schema = AnalysisResultCreate(**a_result_in)
        retest = await AnalysisResult.create(a_result_schema)
        await self.analysis_result.hide_report()
        return retest

    async def create_final_for(self, analysis_uid, value):
        logger.info(f"create_final_for: {analysis_uid} {value}")
        retest = await self.create_analyte_for(analysis_uid)
        res_in = AnalysisResultUpdate(
            result=value,
            submitted_by_uid=self.user.uid,
            date_submitted=datetime.now(),
            verified_by_uid=self.user.uid,
            date_verified=datetime.now(),
            status=conf.states.result.APPROVED,
            retest=False,
            reportable=True,
            reflex_level=None,
        )
        final = await retest.update(res_in)
        return final
