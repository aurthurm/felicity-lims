from typing import Any, Protocol


class PatientGateway(Protocol):
    async def create_patient(self, payload: dict) -> Any | None:
        """Create a patient record from normalized payload data."""

    async def get_patient(self, uid: str) -> Any | None:
        """Retrieve patient by uid."""

    async def find_patient(self, **kwargs) -> Any | None:
        """Retrieve patient by arbitrary filters."""


class NullPatientGateway:
    async def create_patient(self, payload: dict) -> Any | None:
        _ = payload
        return None

    async def get_patient(self, uid: str) -> Any | None:
        _ = uid
        return None

    async def find_patient(self, **kwargs) -> Any | None:
        _ = kwargs
        return None


_patient_gateway: PatientGateway = NullPatientGateway()


def register_patient_gateway(gateway: PatientGateway) -> None:
    global _patient_gateway
    _patient_gateway = gateway


def get_patient_gateway() -> PatientGateway:
    return _patient_gateway
