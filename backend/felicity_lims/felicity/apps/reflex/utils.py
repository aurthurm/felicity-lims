from typing import List
import logging
from datetime import datetime
from felicity.apps.analysis.models.results import AnalysisResult, conf, schemas
from felicity.apps.analysis.models.analysis import Sample, Analysis
from felicity.apps.reflex import models as reflex_models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ReflexUtil:
    _siblings: List[AnalysisResult] = None
    _cousins: List[AnalysisResult] = None
    _reflex_action: reflex_models.ReflexAction = None

    def __init__(self, analysis_result, user):
        self.analysis_result: AnalysisResult = analysis_result
        self.sample: Sample = analysis_result.sample
        self.analysis: Analysis = analysis_result.analysis
        self.user = user

    @classmethod
    async def set_reflex_actions(cls, analysis_results: List[AnalysisResult]):
        """Prepares an analysis result for reflex testing"""
        for result in analysis_results:
            logger.info(f"set_reflex_actions for : {result}")
            filters = {"analyses___uid": result.analysis_uid, "level": 1}
            action: reflex_models.ReflexAction = await reflex_models.ReflexAction.get(**filters)
            if action:
                result.reflex_level = 1
                await result.save()
                logger.info(f"set_reflex_actions done")

    async def do_reflex(self):
        logger.info(f"do_reflex level: {self.analysis_result.reflex_level} <> SampleId {self.sample.sample_id}")
        if not self.analysis_result.reflex_level:
            return

        filters = {"analyses___uid": self.analysis.uid, "level": self.analysis_result.reflex_level}
        action: reflex_models.ReflexAction = await reflex_models.ReflexAction.get(**filters)
        if not action:
            logger.info(f"No reflex action found for analysis: {self.analysis.name}")
            return
        self._reflex_action = action
        logger.info(f"Reflex action found for analysis: {self.analysis.name}")
        logger.info(f"Reflex action description: {action.description}")

        logger.info(f"Reflex Brains: {self._reflex_action.brains}")
        for brain in self._reflex_action.brains:

            await self.decide(brain)

    async def decide(self, brain: reflex_models.ReflexBrain):
        logger.info(f"Reflex Decision for brain: {brain}")
        current_result = self.analysis_result
        analyses_values = brain.analyses_values

        logger.info(f"Reflex brain analyses_values: {analyses_values}")

        # check whether related analysis must be cousins or siblings
        av_uids = []
        for criteria in brain.analyses_values:
            av_uids.append(criteria.analysis_uid)
        logger.info(f"Reflex Decision av_uids: {av_uids}")
        if not av_uids:
            return

        if len(set(av_uids)) == 1:
            results_pool = await self.siblings()
            logger.info(f"reflex results pool -> siblings: {results_pool}")
        else:
            results_pool = await self.cousins()
            logger.info(f"reflex results pool -> cousins: {results_pool}")

        matches = []

        # current result has to be one of the analysis values
        criteria_values = [(criteria.analysis_uid, criteria.value) for criteria in analyses_values]
        _criteria_values = criteria_values
        logger.info(f"Reflex criteria_values: {criteria_values}")
        if (current_result.analysis_uid, current_result.result) not in criteria_values:
            logger.info(f"{(current_result.analysis_uid, current_result.result)} not in criteria_values")
            return
        else:
            logger.info(f"{(current_result.analysis_uid, current_result.result)} in avs")
            matches.append(True)
            criteria_values.remove((current_result.analysis_uid, current_result.result))

        # check if avs have latest result matches from results pool
        for _cv in _criteria_values:
            _anal = list(filter(
                lambda res: res.analysis_uid == _cv[0],
                results_pool
            ))
            # get latest
            _anal = sorted(_anal, key=lambda x: x.created_at)
            logger.info(f"_anal: {_anal}")

            logger.info(f"_anal[0].result: {_anal[0].result} :: _av[1]: {_cv[1]}")
            if _anal[0].result == _cv[1]:
                matches.append(True)
                criteria_values.remove((_anal[0].analysis_uid, _anal[0].result))
            else:
                matches.append(False)

        logger.info(f"matches: {matches}")
        if all(matches):
            logger.info(f"matches found")
            # Add new Analyses
            logger.info(f"add_new: {brain.add_new}")
            for assoc in brain.add_new:
                for i in list(range(assoc.count)):
                    await self.create_analyte_for(assoc.analysis_uid)
            # Finalise Analyses
            logger.info(f"finalise: {brain.finalise}")
            for final in brain.finalise:
                await self.create_final_for(final.analysis.uid, final.value)
        else:
            logger.info(f"no matches")

    async def siblings(self):
        """
        Siblings of the current analysis result
        Analysis Results from the same sample that share the same analysis
        """
        if self._siblings is None:
            analysis_uid = self.analysis.uid
            results: List[AnalysisResult] = await self.sample.get_analysis_results()
            # get siblings and exclude current analysis
            self._siblings = list(filter(
                lambda result:
                result.analysis_uid == analysis_uid and result.uid != self.analysis_result.uid,
                results
            ))
        return self._siblings

    async def cousins(self):
        """
        Cousins of the current analysis result
        Analysis Results from the same sample that do not share the current result's analysis
        """
        if self._cousins is None:
            analysis_uid = self.analysis.uid
            results: List[AnalysisResult] = await self.sample.get_analysis_results()
            self._cousins = list(filter(lambda result: result.analysis_uid != analysis_uid, results))
        return self._cousins

    async def create_analyte_for(self, analysis_uid) -> AnalysisResult:
        logger.info(f"create_analyte_for: {analysis_uid}")
        analysis = await Analysis.get(uid=analysis_uid)

        a_result_in = {
            "sample_uid": self.sample.uid,
            "analysis_uid": analysis.uid,
            "status": conf.states.result.PENDING,
            "instrument_uid": self.analysis_result.instrument_uid,
            "method_uid": self.analysis_result.method_uid,
            "parent_id": self.analysis_result.uid,
            "retest": True,
            "reflex_level": self.analysis_result.reflex_level + 1
        }
        a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
        retest = await AnalysisResult.create(a_result_schema)
        await self.analysis_result.hide_report()
        return retest

    async def create_final_for(self, analysis_uid, value):
        logger.info(f"create_analyte_for: {analysis_uid} {value}")
        retest = await self.create_analyte_for(analysis_uid)
        res_in = schemas.AnalysisResultUpdate(
            result=value,
            submitted_by_uid=self.user.uid,
            date_submitted=datetime.now(),
            verified_by_uid=self.user.uid,
            date_verified=datetime.now(),
            status=conf.states.result.VERIFIED,
            retest=False,
            reportable=True,
            reflex_level=None
        )
        final = await retest.update(res_in)
        return final
