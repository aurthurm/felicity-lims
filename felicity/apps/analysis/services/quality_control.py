from domain.analysis.conf import SampleStates, ResultStates
from domain.analysis.ports import QCSetIn
from domain.analysis.ports.repository.quality_control import (
    IQCSetRepository,
    IQCLevelRepository,
    IQCTemplateRepository,
)
from domain.analysis.ports.service.analysis import (
    IProfileService,
    IAnalysisService,
    ISampleService,
)
from domain.analysis.ports.service.quality_control import (
    IQCSetService,
    IQCLevelService,
    IQCTemplateService,
)
from domain.analysis.ports.service.result import IAnalysisResultService
from domain.analysis.schemas import (
    QCSet,
    # QCReference,
    QCLevel,
    QCTemplate,
    QCSetCreate,
    SampleCreate,
    AnalysisResultCreate,
    Sample,
    QCLevelCreate,
    QCTemplateUpdate,
    QCTemplateCreate,
)
from domain.exceptions import AlreadyExistsError
from domain.setup.ports.service import IDepartmentService
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal


# class QCReferenceService(BaseService[QCReference], IQCReferenceService):
#     ...


class QCSetService(BaseService[QCSet], IQCSetService):
    def __init__(
            self,
            repository: IQCSetRepository,
            qc_template_service: IQCTemplateService,
            qc_level_service: IQCLevelService,
            profile_service: IProfileService,
            analysis_service: IAnalysisService,
            analysis_result_service: IAnalysisResultService,
            sample_service: ISampleService,
    ):
        self.repository = repository
        self.qc_template_service = qc_template_service
        self.qc_level_service = qc_level_service
        self.profile_service = profile_service
        self.analysis_service = analysis_service
        self.analysis_result_service = analysis_result_service
        self.sample_service = sample_service

    async def create(self, samples: list[QCSetIn]) -> tuple[list[Sample], list[QCSet]]:

        qc_sample_type = await self.sample_service.get_qc_sample_type()
        qc_samples = []
        qc_sets = []

        for qc_set_in in samples:
            qc_set_schema = QCSetCreate(name="Set", note="Auto Generated")
            qc_set = await super().create(**marshal(qc_set_schema))

            qc_levels = []
            qc_levels_uids = []
            if qc_set_in.get("qcTemplateUid"):
                qc_template = await self.qc_template_service.get(
                    uid=qc_set_in.get("qcTemplateUid")
                )
                for level in qc_template.qc_levels:
                    if level.uid not in qc_levels_uids:
                        qc_levels.append(level)
                        qc_levels_uids.append(level.uid)

            if qc_set_in.get("qcLevels"):
                for level_uid in qc_set_in.get("qcLevels"):
                    if level_uid not in qc_levels_uids:
                        level = await self.qc_level_service.get(uid=level_uid)
                        qc_levels.append(level)
                        qc_levels_uids.append(level_uid)

            profiles = []
            analyses = []
            _profiles_analyses = set()

            if qc_set_in.get("analysisProfiles"):
                for p_uid in qc_set_in.get("analysisProfiles"):
                    profile = await self.profile_service.get(uid=p_uid)
                    profiles.append(profile)
                    analyses_ = profile.analyses
                    for _an in analyses_:
                        _profiles_analyses.add(_an)

            if qc_set_in.get("analysisServices"):
                # make sure the selected analyses are not part of the selected profiles
                for a_uid in qc_set_in.get("analysisServices"):
                    analysis = await self.analysis_service.get(uid=a_uid)
                    if analysis not in _profiles_analyses:
                        analyses.append(analysis)
                        _profiles_analyses.add(analysis)

            for level in qc_levels:
                # create qc_sample
                s_in = SampleCreate(
                    sampletype_uid=qc_sample_type.uid,
                    internal_use=True,
                    status=SampleStates.RECEIVED,
                )
                sample = await self.sample_service.create(**marshal(s_in))
                sample.analyses = analyses
                sample.profiles = profiles
                sample.qc_set_uid = qc_set.uid
                sample.qc_level_uid = level.uid
                sample = await self.sample_service.update(sample, **marshal(sample))

                # Attach Analysis result for each Analyses
                for _service in _profiles_analyses:
                    a_result_in = {
                        "sample_uid": sample.uid,
                        "analysis_uid": _service.uid,
                        "status": ResultStates.PENDING,
                    }
                    a_result_schema = AnalysisResultCreate(**a_result_in)
                    await self.analysis_result_service.create(
                        **marshal(a_result_schema)
                    )

                qc_samples.append(sample)

            qc_sets.append(qc_set)

        return qc_samples, qc_sets


class QCLevelService(BaseService[QCLevel], IQCLevelService):
    def __init__(self, repository: IQCLevelRepository):
        self.repository = repository

    async def create(self, level: str) -> QCLevel:
        exists = await self.get(level=level)
        if exists:
            raise AlreadyExistsError(f"A QCLevel named {level} already exists")

        obj_in = QCLevelCreate(level=level)
        return await super().create(**marshal(obj_in))

    async def update(self, uid: str, level: str) -> QCLevel:

        qc_level = await self.get(uid=uid)
        try:
            setattr(qc_level, "level", level)
        except AttributeError as e:
            pass

        qc_in = QCTemplateUpdate(**marshal(qc_level))
        return await super().update(qc_level, **marshal(qc_in))


class QCTemplateService(BaseService[QCTemplate], IQCTemplateService):
    def __init__(
            self,
            repository: IQCTemplateRepository,
            qc_level_service: IQCLevelService,
            department_service: IDepartmentService,
    ):
        self.repository = repository
        self.qc_level_service = qc_level_service
        self.department_service = department_service

    async def create(
            self,
            name: str,
            description: str,
            departments: list[str],
            levels: list[str],
    ) -> QCTemplate:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"A QCTemplate named {name} already exists")

        incoming = {}
        for k, v in payload.__dict__.items():
            if k not in ["levels", "departments"]:
                incoming[k] = v

        obj_in = QCTemplateCreate(**incoming)
        qc_template = await super().create(**marshal(obj_in))

        qc_template.qc_levels.clear()
        if levels:
            for _uid in levels:
                level = await self.qc_level_service.get(uid=_uid)
                if level not in qc_template.qc_levels:
                    qc_template.qc_levels.append(level)
        qc_template = await qc_template.save()

        qc_template.departments.clear()
        if departments:
            for _uid in departments:
                dept = await self.department_service.get(uid=_uid)
                if dept not in qc_template.departments:
                    qc_template.departments.append(dept)
        return await super().update(qc_template, **marshal(qc_template))

    async def update(
            self,
            uid: str,
            name: str,
            description: str,
            departments: list[str],
            levels: list[str],
    ) -> QCTemplate:
        payload = locals()

        qc_template = await self.get(uid=uid)
        qc_data = marshal(qc_template)
        for field in qc_data:
            if field in payload.__dict__:
                try:
                    setattr(qc_template, field, payload.__dict__[field])
                except AttributeError as e:  # noqa
                    # raise Exception(f"{e}")
                    pass

        qc_in = QCTemplateUpdate(**marshal(qc_template))
        qc_template = await super().update(qc_template, **marshal(qc_in))

        if levels:
            qc_template.qc_levels.clear()
            qc_template = await super().update(qc_template, **marshal(qc_template))
            for _uid in levels:
                level = await self.qc_level_service.get(uid=_uid)
                if level not in qc_template.qc_levels:
                    qc_template.qc_levels.append(level)
            qc_template = await super().update(qc_template, **marshal(qc_template))

        if departments:
            qc_template.departments.clear()
            qc_template = await super().update(qc_template, **marshal(qc_template))
            for _uid in departments:
                dept = await self.department_service.get(uid=_uid)
                if dept not in qc_template.departments:
                    qc_template.departments.append(dept)
        return await super().update(qc_template, **marshal(qc_template))
