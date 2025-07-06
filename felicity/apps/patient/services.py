from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract.service import BaseService
from felicity.apps.client.services import ClientService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.patient.entities import (
    Identification,
    Patient,
    PatientIdentification,
)
from felicity.apps.patient.repository import (
    IdentificationRepository,
    PatientIdentificationRepository,
    PatientRepository,
)
from felicity.apps.patient.schemas import (
    IdentificationCreate,
    IdentificationUpdate,
    PatientCreate,
    PatientIdentificationCreate,
    PatientIdentificationUpdate,
    PatientUpdate,
)


class IdentificationService(
    BaseService[Identification, IdentificationCreate, IdentificationUpdate]
):
    def __init__(self):
        super().__init__(IdentificationRepository())


class PatientIdentificationService(
    BaseService[
        PatientIdentification, PatientIdentificationCreate, PatientIdentificationUpdate
    ]
):
    def __init__(self):
        super().__init__(PatientIdentificationRepository())

    async def find_by_identification_value(
            self,
            value: str,
            identification_uid: Optional[str] = None,
            session: Optional[AsyncSession] = None
    ) -> Optional[PatientIdentification]:
        """
        HIPAA-compliant search for patient identification by encrypted value.
        
        Args:
            value: The identification value to search for
            identification_uid: Optional specific identification type
            session: Optional database session
            
        Returns:
            Matching patient identification or None
        """
        return await self.repository.find_by_encrypted_value(
            value=value,
            identification_uid=identification_uid,
            session=session
        )


class PatientService(BaseService[Patient, PatientCreate, PatientUpdate]):
    def __init__(self):
        self.id_sequence_service = IdSequenceService()
        super().__init__(PatientRepository())

    async def search(self, query_string: str | None = None) -> list[Patient]:
        """
        HIPAA-compliant patient search.
        
        For encrypted fields (first_name, last_name, phone_mobile, etc.),
        uses specialized repository methods that decrypt data for searching.
        For non-encrypted fields, uses standard database search.
        
        Args:
            query_string: Search term to match across patient fields
            
        Returns:
            List of matching patients
        """
        if not query_string:
            return []

        # Search non-encrypted fields using standard database queries
        non_encrypted_results = []
        non_encrypted_filters = {
            "patient_id": query_string,
            "client_patient_id": query_string,
        }
        for field, value in non_encrypted_filters.items():
            results = await super().search(**{field: value})
            non_encrypted_results.extend(results)

        # Search encrypted fields using specialized repository method
        encrypted_results = await self.repository.search_by_encrypted_fields(
            first_name=query_string,
            last_name=query_string,
            email=query_string,
            phone_mobile=query_string,
            date_of_birth=query_string
        )

        # Combine and deduplicate results
        all_results = non_encrypted_results + encrypted_results
        unique_results = []
        seen_uids = set()

        for patient in all_results:
            if patient.uid not in seen_uids:
                unique_results.append(patient)
                seen_uids.add(patient.uid)

        return unique_results

    async def hipaa_compliant_search(
            self,
            first_name: Optional[str] = None,
            last_name: Optional[str] = None,
            email: Optional[str] = None,
            phone_mobile: Optional[str] = None,
            date_of_birth: Optional[str] = None,
            patient_id: Optional[str] = None,
            client_patient_id: Optional[str] = None,
            session: Optional[AsyncSession] = None
    ) -> List[Patient]:
        """
        Perform HIPAA-compliant search across patient fields.
        
        Args:
            first_name: Patient first name to search
            last_name: Patient last name to search
            email: Patient email to search
            phone_mobile: Patient mobile phone to search
            date_of_birth: Patient date of birth to search (format: YYYY-MM-DD)
            patient_id: Patient ID to search (non-encrypted)
            client_patient_id: Client patient ID to search (non-encrypted)
            session: Optional database session
            
        Returns:
            List of matching patients
        """
        all_results = []

        # Search encrypted fields
        if any([first_name, last_name, email, phone_mobile, date_of_birth]):
            encrypted_results = await self.repository.search_by_encrypted_fields(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone_mobile=phone_mobile,
                date_of_birth=date_of_birth,
                session=session
            )
            all_results.extend(encrypted_results)

        # Search non-encrypted fields
        if patient_id:
            result = await self.get(patient_id=patient_id, session=session)
            if result:
                all_results.append(result)

        if client_patient_id:
            result = await self.get(client_patient_id=client_patient_id, session=session)
            if result:
                all_results.append(result)

        # Deduplicate results
        unique_results = []
        seen_uids = set()

        for patient in all_results:
            if patient.uid not in seen_uids:
                unique_results.append(patient)
                seen_uids.add(patient.uid)

        return unique_results

    async def high_performance_search(
            self,
            first_name: Optional[str] = None,
            last_name: Optional[str] = None,
            email: Optional[str] = None,
            phone_mobile: Optional[str] = None,
            date_of_birth: Optional[str] = None,
            patient_id: Optional[str] = None,
            client_patient_id: Optional[str] = None,
            fuzzy_match: bool = False,
            session: Optional[AsyncSession] = None
    ) -> List[Patient]:
        """
        High-performance HIPAA-compliant search using searchable encryption indices.
        
        This method provides much better performance than the standard search methods
        by using pre-computed cryptographic indices instead of loading all patients
        into memory for filtering.
        
        Args:
            first_name: Patient first name to search
            last_name: Patient last name to search
            email: Patient email to search
            phone_mobile: Patient mobile phone to search
            date_of_birth: Patient date of birth to search (format: YYYY-MM-DD)
            patient_id: Patient ID to search (non-encrypted)
            client_patient_id: Client patient ID to search (non-encrypted)
            fuzzy_match: Enable phonetic/fuzzy matching for names
            session: Optional database session
            
        Returns:
            List of matching patients
            
        Note:
            This method requires searchable encryption indices to be maintained.
            Indices are automatically created/updated when patients are created/updated.
        """
        all_results = []

        # Search using high-performance indices for encrypted fields
        if any([first_name, last_name, email, phone_mobile, date_of_birth]):
            encrypted_results = await self.repository.search_by_encrypted_indices(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone_mobile=phone_mobile,
                date_of_birth=date_of_birth,
                fuzzy_match=fuzzy_match,
                session=session
            )
            all_results.extend(encrypted_results)

        # Search non-encrypted fields using standard database queries
        if patient_id:
            result = await self.get(patient_id=patient_id, session=session)
            if result:
                all_results.append(result)

        if client_patient_id:
            result = await self.get(client_patient_id=client_patient_id, session=session)
            if result:
                all_results.append(result)

        # Deduplicate results
        unique_results = []
        seen_uids = set()

        for patient in all_results:
            if patient.uid not in seen_uids:
                unique_results.append(patient)
                seen_uids.add(patient.uid)

        return unique_results

    async def create(
            self, obj_in: dict | PatientCreate, related: list[str] | None = None,
            commit: bool = True, session: AsyncSession | None = None
    ) -> Patient:
        data = self._import(obj_in)
        data["patient_id"] = (
            await self.id_sequence_service.get_next_number(prefix="P", generic=True, commit=commit, session=session)
        )[1]

        # Create the patient
        patient = await super().create(data, related, commit=commit, session=session)

        # Create searchable encryption indices for high-performance searching
        await self.repository.create_search_indices(patient, session=session)

        return patient

    async def update(
            self, uid: str, update: PatientUpdate | dict, related: list[str] | None = None,
            commit: bool = True, session: AsyncSession | None = None
    ) -> Patient:
        """
        Update a patient and maintain searchable encryption indices.
        
        Args:
            uid: Patient UID to update
            update: Update data
            related: Related entities to fetch
            commit: Whether to commit the transaction
            session: Optional database session
            
        Returns:
            Updated patient entity
        """
        # Update the patient
        patient = await super().update(uid, update, related, commit=commit, session=session)

        # Update searchable encryption indices for high-performance searching
        await self.repository.update_search_indices(patient, session=session)

        return patient

    async def snapshot(self, pt: Patient, metadata: dict = {}):
        fields = ["client", "province", "district", "country"]
        patient = await self.get(related=["province", "district", "country"], uid=pt.uid)
        for _field in fields:
            if _field not in metadata:
                if _field == "client":
                    client = await ClientService().get(related=["province", "district"], uid=pt.client_uid)
                    metadata[_field] = client.snapshot()
                    metadata[_field]["province"] = client.province.snapshot() if client.province else None
                    metadata[_field]["district"] = client.district.snapshot() if client.district else None
                if _field == "province":
                    metadata[_field] = patient.province.snapshot() if patient.province else None
                if _field == "district":
                    metadata[_field] = patient.district.snapshot() if patient.district else None
                if _field == "country":
                    metadata[_field] = patient.country.snapshot() if patient.country else None
        return await self.update(pt.uid, {"metadata_snapshot": marshaller(metadata, depth=3)})
