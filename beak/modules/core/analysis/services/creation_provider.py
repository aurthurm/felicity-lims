import logging
from datetime import timedelta
from typing import Any, Protocol

from sqlalchemy.ext.asyncio import AsyncSession

from beak.core.dtz import timenow_dt
from beak.modules.core.analysis import schemas
from beak.modules.core.analysis.entities.analysis import sample_analysis, sample_profile
from beak.modules.core.analysis.enum import ResultState, SampleState
from beak.modules.core.analysis.schemas import ClinicalDataCreate
from beak.modules.core.analysis.services.analysis import (
    AnalysisRequestService,
    AnalysisService,
    ClinicalDataService,
    ProfileService,
    SampleService,
    SampleTypeService,
)
from beak.modules.core.analysis.services.result import AnalysisResultService
from beak.modules.core.client.services import ClientService

logger = logging.getLogger(__name__)


class AnalysisRequestCreationError(ValueError):
    """Raised when analysis-request creation input is invalid."""


class AnalysisRequestCreationProvider(Protocol):
    async def create_analysis_request(self, payload: Any, actor: Any) -> Any:
        """Create analysis request and nested artifacts from incoming payload."""


class CoreAnalysisRequestCreationProvider:
    def _required(self, payload: Any, name: str, default: Any = None) -> Any:
        return getattr(payload, name, default)

    async def _validate(
        self, payload: Any, session: AsyncSession | None = None
    ) -> None:
        samples = self._required(payload, "samples", []) or []
        if len(samples) == 0:
            raise AnalysisRequestCreationError("Samples are required")

        for sample in samples:
            profiles = getattr(sample, "profiles", []) or []
            analyses = getattr(sample, "analyses", []) or []
            if not any([len(profiles) > 0, len(analyses) > 0]):
                raise AnalysisRequestCreationError(
                    "Samples must have either analysis or profiles or both"
                )

        client_uid = self._required(payload, "client_uid")
        client = await ClientService().get(uid=client_uid, session=session)
        if not client:
            raise AnalysisRequestCreationError(f"Client with uid {client_uid} Not found")

    async def _after_results_created(
        self,
        created_results: list[Any],
        session: AsyncSession | None = None,
    ) -> None:
        # Core has no extension-specific hooks by default.
        _ = created_results
        _ = session

    async def _after_analysis_request_created(
        self,
        analysis_request: Any,
        payload: Any,
        actor: Any,
        session: AsyncSession | None = None,
    ) -> None:
        _ = analysis_request
        _ = payload
        _ = actor
        _ = session

    async def create_analysis_request(self, payload: Any, actor: Any) -> Any:
        async with SampleService().repository.async_session() as transaction_session:
            await self._validate(payload, session=transaction_session)

            incoming = {
                "patient_uid": self._required(payload, "patient_uid"),
                "client_uid": self._required(payload, "client_uid"),
                "request_id": None,
                "client_request_id": self._required(payload, "client_request_id"),
                "created_by_uid": actor.uid,
                "updated_by_uid": actor.uid,
            }

            obj_in = schemas.AnalysisRequestCreate(**incoming)
            analysis_request = await AnalysisRequestService().create(
                obj_in, session=transaction_session
            )
            await self._after_analysis_request_created(
                analysis_request=analysis_request,
                payload=payload,
                actor=actor,
                session=transaction_session,
            )

            clinical_data = self._required(payload, "clinical_data")
            if clinical_data:
                has_data = any(
                    [
                        clinical_data.symptoms,
                        clinical_data.symptoms_raw,
                        clinical_data.clinical_indication,
                        clinical_data.pregnancy_status,
                        clinical_data.breast_feeding,
                        clinical_data.vitals,
                        clinical_data.treatment_notes,
                        clinical_data.other_context,
                    ]
                )
                if has_data:
                    c_data_in = ClinicalDataCreate(
                        analysis_request_uid=analysis_request.uid,
                        symptoms=clinical_data.symptoms,
                        symptoms_raw=clinical_data.symptoms_raw,
                        clinical_indication=clinical_data.clinical_indication,
                        pregnancy_status=clinical_data.pregnancy_status,
                        breast_feeding=clinical_data.breast_feeding,
                        vitals=clinical_data.vitals,
                        treatment_notes=clinical_data.treatment_notes,
                        other_context=clinical_data.other_context,
                    )
                    await ClinicalDataService().create(
                        c_data_in, session=transaction_session
                    )

            samples = self._required(payload, "samples", []) or []
            for sample_payload in samples:
                sample_type_uid = sample_payload.sample_type
                sample_type = await SampleTypeService().get(
                    uid=sample_type_uid, session=transaction_session
                )
                if not sample_type:
                    raise AnalysisRequestCreationError(
                        f"Error, failed to retrieve sample type {sample_type_uid}"
                    )

                sample_in = {
                    "created_by_uid": actor.uid,
                    "updated_by_uid": actor.uid,
                    "analysis_request_uid": analysis_request.uid,
                    "date_collected": sample_payload.date_collected,
                    "date_received": sample_payload.date_received,
                    "sample_type_uid": sample_type_uid,
                    "sample_id": None,
                    "priority": self._required(payload, "priority"),
                    "status": SampleState.EXPECTED,
                    "metadata_snapshot": {},
                }

                profiles = []
                analyses = []
                profile_analyses = set()

                for profile_uid in sample_payload.profiles:
                    profile = await ProfileService().get(
                        related=["analyses"], uid=profile_uid, session=transaction_session
                    )
                    if not profile:
                        raise AnalysisRequestCreationError(
                            f"Failed to retrieve profile information: {profile_uid}"
                        )
                    profiles.append(profile)
                    for analysis in profile.analyses:
                        profile_analyses.add(analysis)

                for analysis_uid in sample_payload.analyses:
                    analysis = await AnalysisService().get(
                        uid=analysis_uid, session=transaction_session
                    )
                    if not analysis:
                        raise AnalysisRequestCreationError(
                            f"Failed to retrieve analysis information: {analysis_uid}"
                        )
                    if analysis not in profile_analyses:
                        analyses.append(analysis)
                        profile_analyses.add(analysis)

                tat_lengths = [
                    analysis.tat_length_minutes
                    for analysis in profile_analyses
                    if analysis.tat_length_minutes
                ]
                if tat_lengths:
                    sample_in["due_date"] = timenow_dt() + timedelta(
                        minutes=max(tat_lengths)
                    )

                sample_schema = schemas.SampleCreate(**sample_in)
                sample = await SampleService().create(
                    sample_schema, session=transaction_session
                )

                for profile in profiles:
                    await SampleService().repository.table_insert(
                        table=sample_profile,
                        mappings=[{"sample_uid": sample.uid, "profile_uid": profile.uid}],
                        session=transaction_session,
                    )

                for analysis in analyses:
                    await SampleService().repository.table_insert(
                        table=sample_analysis,
                        mappings=[{"sample_uid": sample.uid, "analysis_uid": analysis.uid}],
                        session=transaction_session,
                    )

                result_seed = schemas.AnalysisResultCreate(
                    sample_uid=sample.uid,
                    status=ResultState.PENDING,
                    analysis_uid=None,
                    due_date=None,
                    metadata_snapshot={},
                    created_by_uid=actor.uid,
                    updated_by_uid=actor.uid,
                )
                result_schemas = []
                for analysis in profile_analyses:
                    if analysis.keyword == "beak_ast_abx_antibiotic":
                        continue
                    result_schemas.append(
                        result_seed.model_copy(
                            update={
                                "analysis_uid": analysis.uid,
                                "due_date": (
                                    timenow_dt() + timedelta(minutes=analysis.tat_length_minutes)
                                    if analysis.tat_length_minutes
                                    else None
                                ),
                            }
                        )
                    )

                created = await AnalysisResultService().bulk_create(
                    result_schemas,
                    related=["sample", "analysis"],
                    session=transaction_session,
                )
                await self._after_results_created(
                    created_results=created, session=transaction_session
                )

            await SampleService().repository.save_transaction(transaction_session)
            return analysis_request


_analysis_request_creation_provider: AnalysisRequestCreationProvider = (
    CoreAnalysisRequestCreationProvider()
)


def register_analysis_request_creation_provider(
    provider: AnalysisRequestCreationProvider,
) -> None:
    global _analysis_request_creation_provider
    _analysis_request_creation_provider = provider


def get_analysis_request_creation_provider() -> AnalysisRequestCreationProvider:
    return _analysis_request_creation_provider
