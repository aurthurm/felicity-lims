from datetime import datetime

from domain.analysis.conf import ResultStates
from domain.analysis.ports.service.analysis import IAnalysisService
from domain.analysis.ports.service.result import IAnalysisResultService
from domain.analysis.schemas import (
    AnalysisResult,
    Analysis,
    AnalysisResultCreate,
    AnalysisResultUpdate,
)
from domain.exceptions import AlreadyExistsError
from domain.reflex.ports import ReflexCriteriaIn, ReflexAddNewIn, ReflexFinalIn
from domain.reflex.ports.repository import (
    IReflexRuleRepository,
    IReflexActionRepository,
    IReflexBrainRepository,
    IReflexBrainCriteriaRepository,
    IReflexBrainFinalRepository,
    IReflexBrainAdditionRepository,
)
from domain.reflex.ports.service import (
    IReflexRuleService,
    IReflexBrainAdditionService,
    IReflexBrainFinalService,
    IReflexBrainCriteriaService,
    IReflexBrainService,
    IReflexActionService,
    IReflexEngineService,
)
from domain.reflex.schemas import (
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
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.schemas import User


class ReflexRuleService(BaseService[ReflexRule], IReflexRuleService):
    def __init__(self, repository: IReflexRuleRepository):
        self.repository = repository

    async def create(self, name: str, description: str, user: User) -> ReflexRule:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"Reflex Rule name must be unique")

        incoming: dict = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = ReflexRuleCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self, info, uid: str, name: str, description: str, user: User
    ) -> ReflexRule:
        payload = locals()

        reflex_rule = await self.get(uid=uid)

        obj_data = marshal(reflex_rule)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(reflex_rule, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(reflex_rule, "updated_by_uid", user.uid)

        obj_in = ReflexRuleUpdate(**marshal(reflex_rule))
        return await super().update(reflex_rule, **marshal(obj_in))


class ReflexBrainAdditionService(
    BaseService[ReflexBrainAddition], IReflexBrainAdditionService
):
    def __init__(self, repository: IReflexBrainAdditionRepository):
        self.repository = repository


class ReflexBrainFinalService(BaseService[ReflexBrainFinal], IReflexBrainFinalService):
    def __init__(self, repository: IReflexBrainFinalRepository):
        self.repository = repository


class ReflexBrainCriteriaService(
    BaseService[ReflexBrainCriteria], IReflexBrainCriteriaService
):
    def __init__(self, repository: IReflexBrainCriteriaRepository):
        self.repository = repository


class ReflexBrainService(BaseService[ReflexBrain], IReflexBrainService):
    def __init__(
        self, repository: IReflexBrainRepository, analysis_service: IAnalysisService
    ):
        self.repository = repository
        self.analysis_service = analysis_service

    async def create(
        self,
        reflex_action_uid: str,
        description: str,
        analyses_values: list[ReflexCriteriaIn] | None,
        add_new: list[ReflexAddNewIn] | None,
        finalise: list[ReflexFinalIn] | None,
        user: User,
    ) -> ReflexBrain:
        payload = locals()

        incoming: dict = {
            "reflex_action_uid": reflex_action_uid,
            "description": description,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        obj_in = ReflexBrainCreate(**incoming)
        brain = await super().create(**marshal(obj_in))

        _analyses_values = []
        for criteria in analyses_values:
            _anal = await self.analysis_service.get(uid=criteria.analysis_uid)
            assoc = ReflexBrainCriteria()  # ??
            assoc.operator = criteria.operator
            assoc.value = criteria.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            _analyses_values.append(assoc)
        brain.analyses_values = _analyses_values

        _finalise = []
        for final in finalise:
            _anal = await self.analysis_service.get(uid=final.analysis_uid)
            assoc = ReflexBrainFinal()
            assoc.value = final.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            _finalise.append(assoc)
        brain.finalise = _finalise

        _add_new = []
        for add_n in add_new:
            _anal = await self.analysis_service.get(uid=add_n.analysis_uid)
            assoc = ReflexBrainAddition()
            assoc.count = add_n.count
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            _add_new.append(assoc)
        brain.add_new = _add_new

        await super().update(brain, **marshal(brain))
        return await self.repository.get_related(
            uid=brain.uid,
            related=["add_new.analysis", "analyses_values.analysis"],
        )

    async def update(
        self,
        info,
        uid: str,
        reflex_action_uid: str,
        description: str,
        analyses_values: list[ReflexCriteriaIn] | None,
        add_new: list[ReflexAddNewIn] | None,
        finalise: list[ReflexFinalIn] | None,
        user: User,
    ) -> ReflexBrain:
        payload = locals()

        reflex_brain = await self.get(uid=uid)

        obj_data = reflex_brain.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(reflex_brain, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(reflex_brain, "updated_by_uid", user.uid)

        _analyses_values = []
        for criteria in analyses_values:
            _anal = await self.analysis_service.get(uid=criteria.analysis_uid)
            assoc = ReflexBrainCriteria()
            assoc.operator = criteria.operator
            assoc.value = criteria.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            _analyses_values.append(assoc)
        reflex_brain.analyses_values = _analyses_values

        _finalise = []
        for final in finalise:
            _anal = await self.analysis_service.get(uid=final.analysis_uid)
            assoc = ReflexBrainFinal()
            assoc.value = final.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            _finalise.append(assoc)
        reflex_brain.finalise = _finalise

        _add_new = []
        for add_n in add_new:
            _anal = await self.analysis_service.get(uid=add_n.analysis_uid)
            assoc = ReflexBrainAddition()
            assoc.count = add_n.count
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            _add_new.append(assoc)
        reflex_brain.add_new = _add_new

        obj_in = ReflexBrainUpdate(**marshal(reflex_brain))
        return await super().update(reflex_brain, **marshal(obj_in))


class ReflexActionService(BaseService[ReflexAction], IReflexActionService):
    def __init__(
        self, repository: IReflexActionRepository, analysis_service: IAnalysisService
    ):
        self.repository = repository
        self.analysis_service = analysis_service

    async def create(
        self,
        level: int,
        description: str,
        analyses: list[str],
        reflex_rule_uid: str,
        sample_type_uid: str | None,
        user: User,
    ) -> ReflexAction:
        payload = locals()

        incoming: dict = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        del incoming["analyses"]

        obj_in = ReflexActionCreate(**incoming)

        _analyses = []
        for _anal_uid in analyses:
            _anal = await self.analysis_service.get(uid=_anal_uid)
            _analyses.append(_anal)
        obj_in.analyses = _analyses

        return await super().create(**marshal(obj_in))

    async def update(
        self,
        info,
        uid: str,
        level: int,
        description: str,
        analyses: list[str],
        reflex_rule_uid: str,
        sample_type_uid: str | None,
        user: User,
    ) -> ReflexAction:
        payload = locals()

        reflex_action = await self.get(uid=uid)

        obj_data = marshal(reflex_action)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(reflex_action, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(reflex_action, "updated_by_uid", user.uid)

        _analyses = []
        for _anal_uid in analyses:
            _anal = await self.analysis_service.get(uid=_anal_uid)
            _analyses.append(_anal)
        setattr(reflex_action, "analyses", _analyses)

        obj_in = ReflexActionUpdate(**marshal(reflex_action))
        return await super().update(reflex_action, **marshal(obj_in))


class ReflexEngineService(IReflexEngineService):
    _siblings: list[AnalysisResult] = []
    _cousins: list[AnalysisResult] = []
    _reflex_action: ReflexAction = None
    user = None
    analysis_result = None
    analysis = None

    def __init__(
        self,
        reflex_action_service: IReflexActionService,
        analysis_result_service: IAnalysisResultService,
    ):
        self.reflex_action_service = reflex_action_service
        self.analysis_result_service = analysis_result_service

    def init(self, analysis_result: AnalysisResult, user: User):
        self.analysis_result = analysis_result
        self.user = user
        self.analysis: Analysis = analysis_result.analysis

    # TODO: apply set_reflex_actions for already created analyses

    async def set_reflex_actions(self, analysis_results: list[AnalysisResult]):
        """Prepares an analysis result for reflex testing"""
        for result in analysis_results:
            # logger.debug(f"set_reflex_actions for : {result}")
            action = await self.reflex_action_service.get(
                **{"analyses___uid": result.analysis_uid, "level": 1}
            )
            if action:
                result.reflex_level = 1
                await self.analysis_result_service.update(result, **marshal(result))
                # logger.debug(f"set_reflex_actions done")

    async def do_reflex(self):
        # logger.info(
        #     f"do_reflex level: {self.analysis_result.reflex_level} <> SampleId {self.sample.sample_id}"
        # )
        if not self.analysis_result.reflex_level:
            return

        filters = {
            "analyses___uid": self.analysis.uid,
            "level": self.analysis_result.reflex_level,
        }
        action = await self.reflex_action_service.get(**filters)
        if not action:
            # logger.info(f"No reflex action found for analysis: {self.analysis.name}")
            return
        self._reflex_action = action
        # logger.info(f"Reflex action found for analysis: {self.analysis.name}")
        # logger.info(f"Reflex action description: {action.description}")

        # logger.info(f"Reflex Brains: {self._reflex_action.brains}")
        for brain in self._reflex_action.brains:
            await self.decide(brain)

    async def decide(self, brain: ReflexBrain):
        # logger.info(f"Reflex Decision for brain: {brain}")
        current_result = self.analysis_result
        analyses_values = brain.analyses_values

        # logger.info(f"Reflex brain analyses_values: {analyses_values}")

        # check whether related analysis must be cousins or siblings
        av_uids = [criteria.analysis_uid for criteria in brain.analyses_values]
        # logger.info(f"Reflex Decision av_uids: {av_uids}")
        if not av_uids:
            return

        if len(set(av_uids)) == 1:
            results_pool = await self.siblings()
            # logger.info(f"reflex results pool -> siblings: {results_pool}")
        else:
            results_pool = await self.cousins()
            # logger.info(f"reflex results pool -> cousins: {results_pool}")

        matches = []

        # 1. the current result must one of the analysis values
        criteria_values = [
            (criteria.analysis_uid, criteria.value) for criteria in analyses_values
        ]
        _criteria_values = criteria_values
        # logger.info(f"Reflex criteria_values: {criteria_values}")

        if (current_result.analysis_uid, current_result.result) not in criteria_values:
            # logger.info(
            #     f"{(current_result.analysis_uid, current_result.result)} not in criteria_values"
            # )
            return
        else:
            # logger.info(
            #     f"{(current_result.analysis_uid, current_result.result)} in avs"
            # )
            matches.append(True)
            criteria_values.remove((current_result.analysis_uid, current_result.result))

        # 2. check for more result matched between the analysis values and results pool
        for _cv in _criteria_values:
            _anal = list(filter(lambda res: res.analysis_uid == _cv[0], results_pool))
            # get latest
            _anal = sorted(_anal, key=lambda x: x.created_at)
            # logger.info(f"_anal: {_anal}")
            #
            # logger.info(f"_anal[0].result: {_anal[0].result} :: _av[1]: {_cv[1]}")

            if _anal[0].result == _cv[1]:
                matches.append(True)
                criteria_values.remove((_anal[0].analysis_uid, _anal[0].result))
            else:
                matches.append(False)

        # 3. If brain criteria expectations are met then take action
        # logger.info(f"matches: {matches}")
        if all(matches):
            # logger.info(f"matches found")
            # Add new Analyses
            # logger.info(f"add_new: {brain.add_new}")
            for assoc in brain.add_new:
                for i in list(range(assoc.count)):
                    await self.create_analyte_for(assoc.analysis_uid)
            # Finalise Analyses
            # logger.info(f"finalise: {brain.finalise}")
            for final in brain.finalise:
                await self.create_final_for(final.analysis.uid, final.value)
        else:
            # logger.info(f"no matches")
            pass

    async def siblings(self):
        """
        Siblings of the current analysis result
        Analysis Results from the same sample that share the same analysis
        """
        if self._siblings is None:
            analysis_uid = self.analysis.uid
            results = await self.analysis_result_service.get_all(
                sample_uid=self.analysis_result.sample_uid
            )
            # get siblings and exclude current analysis
            self._siblings = list(
                filter(
                    lambda result: result.analysis_uid == analysis_uid
                    and result.uid != self.analysis_result.uid,
                    results,
                )
            )
        return self._siblings

    async def cousins(self):
        """
        Cousins of the current analysis result
        Analysis Results from the same sample that do not share the current result's analysis
        """
        if self._cousins is None:
            analysis_uid = self.analysis.uid
            results = await self.analysis_result_service.get_all(
                sample_uid=self.analysis_result.sample_uid
            )
            self._cousins = list(
                filter(lambda result: result.analysis_uid != analysis_uid, results)
            )
        return self._cousins

    async def create_analyte_for(self, analysis_uid) -> AnalysisResult:
        # logger.info(f"create_analyte_for: {analysis_uid}")
        analysis = await Analysis.get(uid=analysis_uid)

        a_result_in = {
            "sample_uid": self.analysis_result.sample_uid,
            "analysis_uid": analysis.uid,
            "status": ResultStates.PENDING,
            "instrument_uid": self.analysis_result.instrument_uid,
            "method_uid": self.analysis_result.method_uid,
            "parent_id": self.analysis_result.uid,
            "retest": True,
            "reflex_level": self.analysis_result.reflex_level + 1,
        }
        a_result_schema = AnalysisResultCreate(**a_result_in)
        await self.analysis_result_service.hide_report(self.analysis_result)
        return await self.analysis_result_service.create(**marshal(a_result_schema))

    async def create_final_for(self, analysis_uid, value):
        # logger.info(f"create_analyte_for: {analysis_uid} {value}")
        retest = await self.create_analyte_for(analysis_uid)
        res_in = AnalysisResultUpdate(
            result=value,
            submitted_by_uid=self.user.uid,
            date_submitted=datetime.now(),
            verified_by_uid=self.user.uid,
            date_verified=datetime.now(),
            status=ResultStates.APPROVED,
            retest=False,
            reportable=True,
            reflex_level=None,
        )
        return await self.analysis_result_service.update(retest, **marshal(res_in))
