import logging

from beak.modules.core.analysis.enum import SampleState
from beak.modules.core.analysis.services.analysis import SampleService
from beak.modules.core.analysis.utils import get_last_verificator
from beak.modules.core.impress.sample.engine import BeakImpress
from beak.modules.core.impress.sample.helpers import _get_user_meta
from beak.modules.core.impress.sample.schemas import ReportImpressCreate, SampleImpressMetadata
from beak.modules.core.impress.services import ReportImpressService
from beak.modules.core.iol.minio.client import MinioClient
from beak.modules.core.iol.minio.enum import MinioBucket
from beak.modules.core.notification.enum import NotificationObject
from beak.modules.core.notification.services import ActivityStreamService
from beak.modules.core.setup.caches import get_laboratory
from beak.core.config import settings
from beak.core.dtz import format_datetime
from beak.database.mongo import MongoService, MongoCollection
from beak.utils import to_text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

exclude = [
    "auth",
    "preference",
    "groups",
    "right",
    "left",
    "level",
    "tree_id",
    "parent_id",
    "parent",
]


async def build_impress_metadata(sample: "Sample", laboratory: "Laboratory") -> dict:
    """Build minimal metadata structure for PDF generation"""
    patient_meta = (
        ((sample.analysis_request.metadata_snapshot or {}).get("patient", {}))
        if sample.analysis_request
        else {}
    )
    return {
        "sample_id": sample.sample_id,
        "status": sample.status,
        "date_collected": format_datetime(sample.date_collected),
        "date_received": format_datetime(sample.date_received),
        "received_by": _get_user_meta(sample.received_by),
        "submitted_by": _get_user_meta(sample.submitted_by),
        "date_submitted": format_datetime(sample.date_submitted),
        "verified_by": _get_user_meta(sample.verified_by),
        "date_verified": format_datetime(sample.date_verified),
        "date_published": format_datetime(sample.date_published),
        "published_by": _get_user_meta(sample.published_by),
        "created_at": format_datetime(sample.created_at),
        "created_by": _get_user_meta(sample.created_by),
        "laboratory": {
            "name": laboratory.name,
            "address": laboratory.address,
            "business_phone": laboratory.business_phone,
            "mobile_phone": laboratory.mobile_phone,
            "email": laboratory.email,
            "quality_statement": laboratory.quality_statement,
        },
        "profiles": [{"name": p.name} for p in sample.profiles] if sample.profiles else [],
        "analyses": [{"name": a.name} for a in sample.analyses] if sample.analyses else [],
        "sample_type": {
            "name": sample.sample_type.name if sample.sample_type else None
        },
        "analysis_request": {
            "client_request_id": sample.analysis_request.client_request_id if sample.analysis_request else None,
            "patient": {
                "first_name": patient_meta.get("first_name", ""),
                "last_name": patient_meta.get("last_name", ""),
                "age": to_text(patient_meta.get("age")),
                "gender": patient_meta.get("gender", ""),
            } if patient_meta else {
                "first_name": "",
                "last_name": "",
                "age": "",
                "gender": ""
            },
            "client": {
                "name": sample.analysis_request.client.name,
                "address": "",
            } if sample.analysis_request and sample.analysis_request.client else {
                "name": "",
                "address": "",
            },
        },
        "analysis_results": [
            {
                "uid": r.uid,
                "result": r.result,
                "status": r.status,
                "unit": {
                    "name": r.analysis.unit.name if r.analysis.unit else None
                },
                "reportable": r.reportable,
                "submitted_by": _get_user_meta(r.submitted_by),
                "date_submitted": format_datetime(r.date_submitted),
                "verified_by": _get_user_meta(await get_last_verificator(r.uid)),
                "date_verified": format_datetime(r.date_verified),
                "analysis": {
                    "name": r.analysis.name if r.analysis else None,
                    "unit": {
                        "name": r.analysis.unit.name if r.analysis.unit else None
                    }
                },
                "method": {"name": r.method.name if r.method else None},
                "laboratory_instrument": {
                    "instrument": {
                        "name": r.laboratory_instrument.instrument.name if r.laboratory_instrument.instrument else None
                    },
                    "lab_name": r.laboratory_instrument.lab_name
                } if r.laboratory_instrument else {
                    "instrument": {"name": ""},
                    "lab_name": ""
                },
            }
            for r in sample.analysis_results
        ] if sample.analysis_results else [],
    }


async def impress_samples(sample_meta: list[dict], user):
    to_return = []

    for s_meta in sample_meta:
        logger.info(f"sample s_meta {s_meta}")
        sample = await SampleService().get(uid=s_meta.get("uid"))
        assert sample.laboratory_uid is not None
        laboratory = await get_laboratory(lab_uid=sample.laboratory_uid)  # noqa
        logger.info(f"sample {sample} {sample.status}")

        if sample.status in [
            SampleState.RECEIVED,
            SampleState.PAIRED,
            SampleState.AWAITING,
            SampleState.APPROVED,
            SampleState.PUBLISHED,
        ]:
            # Build minimal metadata structure
            impress_dict = await build_impress_metadata(sample, laboratory)

            # Validate with Pydantic
            impress_meta = SampleImpressMetadata(**impress_dict)

            report_state = "Unknown"
            action = s_meta.get("action")
            if action == "publish":
                report_state = "Final Report"
            if action == "re-publish":
                report_state = "Final Report [Re]"
            if action == "pre-publish":
                report_state = "Preliminary Report"

            logger.info(f"report_state {report_state}: running impress ....")
            impress_engine = BeakImpress()

            # Convert to dict for PDF generation
            sample_pdf = await impress_engine.generate(impress_meta, report_state)

            ri_in = {
                "state": report_state,
                "sample_uid": sample.uid,
                "email_required": False,
                "email_sent": False,
                "sms_required": False,
                "sms_sent": False,
                "generated_by_uid": user.uid,
            }

            if not settings.OBJECT_STORAGE:
                ri_in["pdf_content"] = sample_pdf

            if not settings.DOCUMENT_STORAGE:
                ri_in["json_content"] = impress_meta.model_dump()

            sc_in = ReportImpressCreate(**ri_in)
            report_impress = await ReportImpressService().create(sc_in)

            # save pdf to minio
            if settings.OBJECT_STORAGE:
                MinioClient().put_object(
                    bucket=MinioBucket.DIAGNOSTIC_REPORT,
                    object_name=f"{sample.sample_id}.pdf",
                    data=sample_pdf,
                    metadata={
                        "state": report_state,
                        "sample_uid": sample.uid,
                        "impress_meta_uid": report_impress.uid,
                    },
                    content_type="application/pdf",
                )

            # Save the minimal json to mongodb
            if settings.DOCUMENT_STORAGE:
                await MongoService().upsert(
                    collection_name=MongoCollection.DIAGNOSTIC_REPORT,
                    uid=report_impress.uid,  # noqa
                    data=impress_meta.model_dump(),
                )

            if action != "pre-publish":
                sample = await SampleService().publish(sample.uid, published_by=user)  # noqa

            logger.info(f"sample {sample.sample_id} has been impressed.")
            to_return.append(sample)

            await ActivityStreamService().stream(
                sample, user, "published", NotificationObject.SAMPLE
            )
        else:
            logger.info(
                f"sample {sample.sample_id} could not be impressed - status: {sample.status}"
            )

    return to_return
