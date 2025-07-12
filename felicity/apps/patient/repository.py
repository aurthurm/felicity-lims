from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.patient.entities import (
    Identification,
    Patient,
    PatientIdentification,
)
from felicity.utils.encryption import encrypt_pii


class PatientRepository(BaseRepository[Patient]):
    def __init__(self) -> None:
        super().__init__(Patient)

    async def search_by_encrypted_fields(
            self,
            first_name: Optional[str] = None,
            last_name: Optional[str] = None,
            email: Optional[str] = None,
            phone_mobile: Optional[str] = None,
            date_of_birth: Optional[str] = None,
            session: Optional[AsyncSession] = None
    ) -> List[Patient]:
        """
        HIPAA-compliant search for patients using encrypted fields.
        
        Since encrypted fields cannot be directly searched in the database,
        this method retrieves all patients and performs decryption and 
        filtering in application memory. For production use, consider
        implementing searchable encryption or maintaining encrypted search indices.
        
        Args:
            first_name: First name to search for
            last_name: Last name to search for
            email: Email to search for
            phone_mobile: Mobile phone to search for
            date_of_birth: Date of birth to search for (format: YYYY-MM-DD)
            session: Optional database session
            
        Returns:
            List of matching patients
        """
        # Get all active patients (or implement pagination for large datasets)
        all_patients = await self.get_all(active=True, session=session)

        matching_patients = []

        for patient in all_patients:
            match = True

            # Check first name match
            if first_name and patient.first_name:
                if first_name.lower() not in patient.first_name.lower():
                    match = False

            # Check last name match
            if last_name and patient.last_name:
                if last_name.lower() not in patient.last_name.lower():
                    match = False

            # Check email match
            if email and patient.email:
                if email.lower() not in patient.email.lower():
                    match = False

            # Check phone match
            if phone_mobile and patient.phone_mobile:
                # Remove formatting for phone comparison
                search_phone = ''.join(filter(str.isdigit, phone_mobile))
                patient_phone = ''.join(filter(str.isdigit, patient.phone_mobile))
                if search_phone not in patient_phone:
                    match = False

            # Check date of birth match
            if date_of_birth and patient.date_of_birth:
                # Convert datetime to string for comparison if needed
                patient_dob_str = patient.date_of_birth.strftime('%Y-%m-%d') if hasattr(patient.date_of_birth,
                                                                                        'strftime') else str(
                    patient.date_of_birth)
                if date_of_birth not in patient_dob_str:
                    match = False

            if match:
                matching_patients.append(patient)

        return matching_patients

    async def find_by_exact_encrypted_field(
            self,
            field_name: str,
            value: str,
            session: Optional[AsyncSession] = None
    ) -> Optional[Patient]:
        """
        Find a patient by exact match on encrypted field.
        
        Args:
            field_name: Name of the encrypted field ('first_name', 'last_name', 'email', etc.)
            value: Exact value to match
            session: Optional database session
            
        Returns:
            Matching patient or None
        """
        # Encrypt the search value
        encrypted_value = encrypt_pii(value)
        if not encrypted_value:
            return None

        # Search using the encrypted value
        filter_kwargs = {field_name: encrypted_value}
        return await self.get(session=session, **filter_kwargs)

    async def search_by_encrypted_indices(
            self,
            first_name: Optional[str] = None,
            last_name: Optional[str] = None,
            email: Optional[str] = None,
            phone_mobile: Optional[str] = None,
            date_of_birth: Optional[str] = None,
            fuzzy_match: bool = False,
            session: Optional[AsyncSession] = None,
            return_uids=False
    ) -> List[Patient | str]:
        """
        High-performance HIPAA-compliant search using searchable encryption indices.
        
        This method uses pre-computed cryptographic indices to search encrypted
        patient data without loading all records into memory, providing much
        better performance for large datasets.
        
        Args:
            first_name: First name to search for
            last_name: Last name to search for
            email: Email to search for
            phone_mobile: Mobile phone to search for
            date_of_birth: Date of birth to search for (format: YYYY-MM-DD)
            fuzzy_match: Enable phonetic/fuzzy matching
            session: Optional database session
            
        Returns:
            List of matching patients
            
        Note:
            This method requires searchable encryption indices to be maintained.
            Call create_patient_indices() when creating/updating patients.
        """
        try:
            # Import here to avoid circular imports
            from felicity.apps.patient.search_service import SearchableEncryptionService

            search_service = SearchableEncryptionService()

            # Get patient UIDs using searchable indices
            matching_uids = await search_service.search_by_indices(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone_mobile,
                date_of_birth=date_of_birth,
                fuzzy_match=fuzzy_match,
                session=session
            )

            if not matching_uids:
                return []

            # Retrieve patients by UIDs (much more efficient than loading all)
            if return_uids: return list(matching_uids)
            return await self.get_by_uids(list(matching_uids), session=session)

        except Exception as e:
            # Fallback to memory-based search if indices are not available
            return await self.search_by_encrypted_fields(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone_mobile=phone_mobile,
                date_of_birth=date_of_birth,
                session=session
            )

    async def create_search_indices(
            self,
            patient: Patient,
            session: Optional[AsyncSession] = None
    ) -> None:
        """
        Create searchable encryption indices for a patient.
        
        This should be called whenever a patient is created or updated
        to maintain the searchable indices for performance.
        
        Args:
            patient: Patient entity to create indices for
            session: Optional database session
        """
        try:
            from felicity.apps.patient.search_service import SearchableEncryptionService

            search_service = SearchableEncryptionService()
            await search_service.create_patient_indices(patient, session)
        except Exception as e:
            # Log but don't fail the main operation
            from felicity.utils.exception_logger import log_exception
            log_exception(e)

    async def update_search_indices(
            self,
            patient: Patient,
            session: Optional[AsyncSession] = None
    ) -> None:
        """
        Update searchable encryption indices for a patient.
        
        Args:
            patient: Patient entity to update indices for
            session: Optional database session
        """
        try:
            from felicity.apps.patient.search_service import SearchableEncryptionService

            search_service = SearchableEncryptionService()
            await search_service.update_patient_indices(patient, session)
        except Exception as e:
            from felicity.utils.exception_logger import log_exception
            log_exception(e)

    async def delete_search_indices(
            self,
            patient_uid: str,
            session: Optional[AsyncSession] = None
    ) -> None:
        """
        Delete searchable encryption indices for a patient.
        
        Args:
            patient_uid: UID of the patient to delete indices for
            session: Optional database session
        """
        try:
            from felicity.apps.patient.search_service import SearchableEncryptionService

            search_service = SearchableEncryptionService()
            await search_service.delete_patient_indices(patient_uid, session)
        except Exception as e:
            from felicity.utils.exception_logger import log_exception
            log_exception(e)


class IdentificationRepository(BaseRepository[Identification]):
    def __init__(self) -> None:
        super().__init__(Identification)


class PatientIdentificationRepository(BaseRepository[PatientIdentification]):
    def __init__(self) -> None:
        super().__init__(PatientIdentification)

    async def find_by_encrypted_value(
            self,
            value: str,
            identification_uid: Optional[str] = None,
            session: Optional[AsyncSession] = None
    ) -> Optional[PatientIdentification]:
        """
        Find patient identification by encrypted value.
        
        Args:
            value: The identification value to search for
            identification_uid: Optional specific identification type
            session: Optional database session
            
        Returns:
            Matching patient identification or None
        """
        # Encrypt the search value
        encrypted_value = encrypt_pii(value)
        if not encrypted_value:
            return None

        # Build search criteria
        filter_kwargs = {"value": encrypted_value}
        if identification_uid:
            filter_kwargs["identification_uid"] = identification_uid

        return await self.get(session=session, **filter_kwargs)
