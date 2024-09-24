from felicity.apps.iol.fhir.services.create import FhirCreateService
from felicity.apps.iol.fhir.services.read import FhirReadService
from felicity.apps.iol.relay import post_data
from felicity.apps.job.enum import JobState
from felicity.apps.job.services import JobService
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.shipment.enum import ShipmentState
from felicity.apps.shipment.services import ShipmentService, ShippedSampleService
from felicity.apps.user.services import UserService


class IOLService:
    def __init__(self):
        self.fhir_read_service = FhirReadService()
        self.fhir_create_service = FhirCreateService()
        self.user_service = UserService()
        self.job_service = JobService()
        self.shipment_service = ShipmentService()
        self.activity_stream_service = ActivityStreamService()
        self.shipped_sample_service = ShippedSampleService()

    async def send(self, shipment_uid: str, user_uid: str):
        shipment = await self.shipment_service.get(uid=shipment_uid)
        user = await self.user_service.get(uid=user_uid)

        resource = await self.fhir_read_service.get_shipment_bundle_resource(
            shipment.uid
        )
        # TODO -> get from iol_service
        if not resource:
            raise Exception("Failed to get shipment bundle resource")

        success = await post_data(
            f"{shipment.laboratory.url}Bundle",
            resource.model_dump(exclude_none=True),
            shipment.laboratory.username,
            shipment.laboratory.password,
        )
        return await self.shipment_service.change_state(
            shipment.uid,
            state=ShipmentState.FAILED if not success else ShipmentState.SHIPPED,
            updated_by_uid=user.uid,
        )

    async def dispatch(self, job_uid: str, by_uid=None):
        # logger.info(f"running shipment dispatch job: {job_uid} ....")
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobState.PENDING:
            return None

        user = await self.user_service.get(uid=by_uid if by_uid else job.creator_uid)

        await self.job_service.change_status(job.uid, new_status=JobState.RUNNING)
        shipment_uid = job.job_id
        shipment = await self.shipment_service.get(uid=shipment_uid)

        if not shipment.state == ShipmentState.AWAITING:
            await self.job_service.change_status(job.uid, new_status=JobState.FAILED)
            return None

        resource = await self.fhir_read_service.get_shipment_bundle_resource(
            shipment_uid
        )
        if not resource:
            raise Exception("Failed to get shipment bundle resource")

        success = await post_data(
            f"{shipment.laboratory.url}Bundle",
            resource.model_dump(exclude_none=True),
            shipment.laboratory.username,
            shipment.laboratory.password,
        )

        await self.job_service.change_status(
            job.uid, new_status=JobState.PENDING if not success else JobState.FINISHED
        )
        await self.shipment_service.change_state(
            shipment.uid,
            state=ShipmentState.FAILED if not success else ShipmentState.SHIPPED,
            updated_by_uid=user.uid,
        )
        if not success:
            await self.job_service.backoff(job.uid, 1, 10)

        if shipment.state == ShipmentState.READY:
            shipment.state = ShipmentState.AWAITING
            shipment.dispatched_by_uid = user.uid
            saved = await self.shipment_service.update(
                shipment.uid, **shipment.marshal_simple()
            )
            await self.activity_stream_service.stream(
                saved, user, "dispatched", "shipment"
            )
            return saved
        return shipment

    async def return_shipped_report(self, job_uid: str):
        # logger.info(f"starting job return shipped report: {job_uid} ....")
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobState.PENDING:
            return

        await self.job_service.change_status(job.uid, new_status=JobState.RUNNING)

        shipped_sample_uid = job.job_id
        shipped = await self.shipped_sample_service.get(uid=shipped_sample_uid)

        if not shipped:
            await self.job_service.change_status(
                job.uid,
                new_status=JobState.FAILED,
                change_reason=f"Failed to acquire shipped sample {shipped_sample_uid}",
            )
            # logger.warning(f"Failed to acquire shipped sample {shipped_sample_uid}")
            return

        shipment = await self.shipment_service.get(uid=shipped.shipment_uid)
        if not shipment:
            await self.job_service.change_status(
                job.uid,
                new_status=JobState.FAILED,
                change_reason=f"Failed to acquire Shipment {shipped.shipment_uid}",
            )
            # logger.warning(f"Failed to acquire Shipment {shipped.shipment_uid}")
            return

        result_uids = []
        if job.data["target"] == "result":
            result_uids.append(job.data["uid"])

        resource = await self.fhir_read_service.get_diagnostic_report_resource(
            shipped.sample.analysis_request_uid, result_uids, True
        )
        if not resource:
            raise Exception("Failed to get Diagnostic report")

        success = await post_data(
            f"{shipment.laboratory.url}DiagnosticReport",
            resource.model_dump(exclude_none=True),
            shipment.laboratory.username,
            shipment.laboratory.password,
        )

        if not success:
            await self.job_service.change_status(job.uid, new_status=JobState.FAILED)
        else:
            await self.job_service.change_status(job.uid, new_status=JobState.FINISHED)
