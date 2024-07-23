from domain.iol.ports.service import IIOLService, IFhirReadService, IFhirCreateService
from domain.iol.relay import post_data

from domain.job.enum import JobStates
from domain.job.ports.service import IJobService
from domain.notification.ports.service import IActivityStreamService
from domain.shared.utils.serialisers import marshal
from domain.shipment.enum import ShipmentStates
from domain.shipment.ports.service import IShipmentService, IShippedSampleService
from domain.user.ports.service import IUserService


class IOLService(IIOLService):
    def __init__(
        self,
        fhir_read_service: IFhirReadService,
        fhir_create_service: IFhirCreateService,
        user_service: IUserService,
        job_service: IJobService,
        shipment_service: IShipmentService,
        activity_stream_service: IActivityStreamService,
        shipped_sample_service: IShippedSampleService,
    ):
        self.fhir_read_service = fhir_read_service
        self.fhir_create_service = fhir_create_service
        self.user_service = user_service
        self.job_service = job_service
        self.shipment_service = shipment_service
        self.activity_stream_service = activity_stream_service
        self.shipped_sample_service = shipped_sample_service

    async def send(self, shipment_uid: str, user_uid: str):
        shipment = await self.shipment_service.get(uid=shipment_uid)
        user = await self.user_service.get(uid=user_uid)

        resource = await self.fhir_read_service.get_shipment_bundle_resource(
            shipment.uid
        )  # TODO -> get from iol_service
        success = await post_data(
            f"{shipment.laboratory.url}Bundle",
            resource.model_dump(exclude_none=True),
            shipment.laboratory.username,
            shipment.laboratory.password,
        )
        return await self.shipment_service.change_state(
            shipment,
            state=ShipmentStates.FAILED if not success else ShipmentStates.SHIPPED,
            updated_by=user,
        )

    async def dispatch(self, job_uid: str, by_uid=None):
        # logger.info(f"running shipment dispatch job: {job_uid} ....")
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobStates.PENDING:
            return None

        user = await self.user_service.get(uid=by_uid if by_uid else job.creator_uid)

        await self.job_service.change_status(job, new_status=JobStates.RUNNING)
        shipment_uid = job.job_id
        shipment = await self.shipment_service.get(uid=shipment_uid)

        if not shipment.state == ShipmentStates.AWAITING:
            await self.job_service.change_status(job, new_status=JobStates.FAILED)
            return None

        resource = await self.fhir_read_service.get_shipment_bundle_resource(
            shipment_uid
        )
        success = await post_data(
            f"{shipment.laboratory.url}Bundle",
            resource.model_dump(exclude_none=True),
            shipment.laboratory.username,
            shipment.laboratory.password,
        )

        await self.job_service.change_status(
            job, new_status=JobStates.PENDING if not success else JobStates.FINISHED
        )
        await self.shipment_service.change_state(
            shipment,
            state=ShipmentStates.FAILED if not success else ShipmentStates.SHIPPED,
            updated_by=user,
        )
        if not success:
            await self.job_service.backoff(job, 1, 10)

        if shipment.state == ShipmentStates.READY:
            shipment.state = ShipmentStates.AWAITING
            shipment.dispatched_by_uid = user.uid
            saved = await self.shipment_service.update(shipment, **marshal(shipment))
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

        if not job.status == JobStates.PENDING:
            return

        await self.job_service.change_status(job, new_status=JobStates.RUNNING)

        shipped_sample_uid = job.job_id
        shipped = await self.shipped_sample_service.get(uid=shipped_sample_uid)

        if not shipped:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"Failed to acquire shipped sample {shipped_sample_uid}",
            )
            # logger.warning(f"Failed to acquire shipped sample {shipped_sample_uid}")
            return

        shipment = await self.shipment_service.get(uid=shipped.shipment_uid)
        if not shipment:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
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
        success = await post_data(
            f"{shipment.laboratory.url}DiagnosticReport",
            resource.model_dump(exclude_none=True),
            shipment.laboratory.username,
            shipment.laboratory.password,
        )

        if not success:
            await self.job_service.change_status(job, new_status=JobStates.FAILED)
        else:
            await self.job_service.change_status(job, new_status=JobStates.FINISHED)
