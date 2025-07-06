"""
HIPAA-compliant Searchable Encryption Service

This service manages searchable encryption indices for patient data,
enabling efficient searching without compromising data security.
"""

import hashlib
import hmac
import re
from datetime import datetime
from typing import List, Optional, Set
from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.patient.entities import Patient
from felicity.apps.patient.search_indices import (
    PatientSearchIndex, 
    PhoneSearchIndex, 
    DateSearchIndex
)
from felicity.core.config import settings
from felicity.utils.exception_logger import log_exception


class SearchableEncryptionService:
    """
    Service for managing searchable encryption indices for patient data.
    
    This service creates and maintains cryptographic indices that allow
    efficient searching of encrypted patient data without exposing plaintext.
    """
    
    def __init__(self):
        self.search_key = self._get_search_key()
        self.patient_index_repo = BaseRepository(PatientSearchIndex)
        self.phone_index_repo = BaseRepository(PhoneSearchIndex)
        self.date_index_repo = BaseRepository(DateSearchIndex)
    
    def _get_search_key(self) -> bytes:
        """Get the search key for HMAC operations."""
        # In production, this should be a separate key from encryption key
        search_key = getattr(settings, 'SEARCH_ENCRYPTION_KEY', settings.SECRET_KEY)
        return search_key.encode() if isinstance(search_key, str) else search_key
    
    def _create_search_hash(self, value: str, salt: str = "") -> str:
        """Create a searchable hash using HMAC."""
        if not value:
            return ""
        
        # Normalize the value
        normalized_value = value.lower().strip()
        message = f"{normalized_value}{salt}".encode()
        
        # Create HMAC hash
        hash_obj = hmac.new(self.search_key, message, hashlib.sha256)
        return hash_obj.hexdigest()[:32]  # Truncate for performance
    
    def _create_partial_hashes(self, value: str) -> dict:
        """Create partial hashes for substring searching."""
        if not value or len(value) < 3:
            return {}
        
        normalized = value.lower().strip()
        return {
            'partial_hash_3': self._create_search_hash(normalized[:3]) if len(normalized) >= 3 else None,
            'partial_hash_4': self._create_search_hash(normalized[:4]) if len(normalized) >= 4 else None,
            'partial_hash_5': self._create_search_hash(normalized[:5]) if len(normalized) >= 5 else None,
        }
    
    def _create_phonetic_hash(self, value: str) -> Optional[str]:
        """Create a phonetic hash for fuzzy matching (simplified Soundex-like)."""
        if not value:
            return None
        
        # Remove non-alphabetic characters and convert to uppercase
        clean_value = re.sub(r'[^A-Za-z]', '', value).upper()
        if not clean_value:
            return None
        
        # Simplified phonetic algorithm
        # Map similar sounding letters
        phonetic_map = {
            'B': '1', 'F': '1', 'P': '1', 'V': '1',
            'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
            'D': '3', 'T': '3',
            'L': '4',
            'M': '5', 'N': '5',
            'R': '6'
        }
        
        phonetic = clean_value[0]  # Keep first letter
        for char in clean_value[1:]:
            if char in phonetic_map:
                phonetic += phonetic_map[char]
        
        # Remove consecutive duplicates and limit length
        result = phonetic[0]
        for i in range(1, len(phonetic)):
            if phonetic[i] != phonetic[i-1]:
                result += phonetic[i]
                if len(result) >= 6:  # Limit phonetic hash length
                    break
        
        return self._create_search_hash(result)
    
    def _normalize_phone(self, phone: str) -> str:
        """Normalize phone number by extracting digits only."""
        if not phone:
            return ""
        return re.sub(r'[^\d]', '', phone)
    
    def _create_phone_hashes(self, phone: str) -> dict:
        """Create phone-specific search hashes."""
        if not phone:
            return {}
        
        normalized = self._normalize_phone(phone)
        if len(normalized) < 4:
            return {}
        
        result = {
            'normalized_hash': self._create_search_hash(normalized),
            'last_four_hash': self._create_search_hash(normalized[-4:]) if len(normalized) >= 4 else None,
        }
        
        # Extract area code (first 3 digits for US numbers)
        if len(normalized) >= 10:
            area_code = normalized[:3] if normalized.startswith('1') and len(normalized) == 11 else normalized[:3]
            result['area_code_hash'] = self._create_search_hash(area_code)
        
        return result
    
    def _create_date_hashes(self, date_value: datetime) -> dict:
        """Create date-specific search hashes."""
        if not date_value:
            return {}
        
        # Calculate age range
        current_year = datetime.now().year
        age = current_year - date_value.year
        age_range = f"{(age // 10) * 10}-{((age // 10) + 1) * 10 - 1}"
        
        return {
            'year_hash': self._create_search_hash(str(date_value.year)),
            'month_hash': self._create_search_hash(f"{date_value.month:02d}"),
            'day_hash': self._create_search_hash(f"{date_value.day:02d}"),
            'date_hash': self._create_search_hash(date_value.strftime('%Y-%m-%d')),
            'age_range_hash': self._create_search_hash(age_range),
        }
    
    async def create_patient_indices(
        self, 
        patient: Patient, 
        session: Optional[AsyncSession] = None
    ) -> None:
        """
        Create searchable indices for a patient.
        
        Args:
            patient: Patient entity to index
            session: Optional database session
        """
        try:
            # Create text field indices
            text_fields = {
                'first_name': patient.first_name,
                'middle_name': patient.middle_name,
                'last_name': patient.last_name,
                'email': patient.email,
            }
            
            for field_name, field_value in text_fields.items():
                if field_value:
                    # Create main search index
                    search_data = {
                        'patient_uid': patient.uid,
                        'field_name': field_name,
                        'search_hash': self._create_search_hash(field_value),
                        'phonetic_hash': self._create_phonetic_hash(field_value),
                        **self._create_partial_hashes(field_value)
                    }
                    
                    await self.patient_index_repo.create(session=session, **search_data)
            
            # Create phone indices
            phone_fields = {
                'phone_mobile': patient.phone_mobile,
                'phone_home': patient.phone_home,
            }
            
            for field_name, field_value in phone_fields.items():
                if field_value:
                    phone_data = {
                        'patient_uid': patient.uid,
                        'field_name': field_name,
                        **self._create_phone_hashes(field_value)
                    }
                    
                    await self.phone_index_repo.create(session=session, **phone_data)
            
            # Create date indices
            if patient.date_of_birth:
                # Convert string to datetime if needed
                dob = patient.date_of_birth
                if isinstance(dob, str):
                    try:
                        dob = datetime.fromisoformat(dob.replace('Z', '+00:00'))
                    except (ValueError, TypeError):
                        dob = None
                
                if dob:
                    date_data = {
                        'patient_uid': patient.uid,
                        'field_name': 'date_of_birth',
                        **self._create_date_hashes(dob)
                    }
                    
                    await self.date_index_repo.create(session=session, **date_data)
        
        except Exception as e:
            log_exception(e)
            raise
    
    async def update_patient_indices(
        self, 
        patient: Patient, 
        session: Optional[AsyncSession] = None
    ) -> None:
        """
        Update searchable indices for a patient.
        
        Args:
            patient: Patient entity to update indices for
            session: Optional database session
        """
        try:
            # Delete existing indices
            await self.delete_patient_indices(patient.uid, session)
            
            # Create new indices
            await self.create_patient_indices(patient, session)
        
        except Exception as e:
            log_exception(e)
            raise
    
    async def delete_patient_indices(
        self, 
        patient_uid: str, 
        session: Optional[AsyncSession] = None
    ) -> None:
        """
        Delete all searchable indices for a patient.
        
        Args:
            patient_uid: UID of the patient
            session: Optional database session
        """
        try:
            await self.patient_index_repo.delete_where(patient_uid=patient_uid, session=session)
            await self.phone_index_repo.delete_where(patient_uid=patient_uid, session=session)
            await self.date_index_repo.delete_where(patient_uid=patient_uid, session=session)
        
        except Exception as e:
            log_exception(e)
            raise
    
    async def search_by_indices(
        self,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        date_of_birth: Optional[str] = None,
        fuzzy_match: bool = False,
        session: Optional[AsyncSession] = None
    ) -> Set[str]:
        """
        Search for patient UIDs using searchable indices.
        
        Args:
            first_name: First name to search for
            last_name: Last name to search for
            email: Email to search for
            phone: Phone number to search for
            date_of_birth: Date of birth to search for (YYYY-MM-DD format)
            fuzzy_match: Whether to use phonetic matching
            session: Optional database session
            
        Returns:
            Set of patient UIDs matching the search criteria
        """
        try:
            matching_uids = set()
            
            # Search text fields
            text_searches = {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
            }
            
            for field_name, search_value in text_searches.items():
                if search_value:
                    field_uids = set()
                    
                    # Exact hash match
                    search_hash = self._create_search_hash(search_value)
                    exact_matches = await self.patient_index_repo.get_all(
                        field_name=field_name,
                        search_hash=search_hash,
                        session=session
                    )
                    field_uids.update(idx.patient_uid for idx in exact_matches)
                    
                    # Partial matches for substring search
                    if len(search_value) >= 3:
                        partial_hashes = self._create_partial_hashes(search_value)
                        for partial_field, partial_hash in partial_hashes.items():
                            if partial_hash:
                                partial_matches = await self.patient_index_repo.get_all(
                                    field_name=field_name,
                                    **{partial_field: partial_hash},
                                    session=session
                                )
                                field_uids.update(idx.patient_uid for idx in partial_matches)
                    
                    # Phonetic match if enabled
                    if fuzzy_match:
                        phonetic_hash = self._create_phonetic_hash(search_value)
                        if phonetic_hash:
                            phonetic_matches = await self.patient_index_repo.get_all(
                                field_name=field_name,
                                phonetic_hash=phonetic_hash,
                                session=session
                            )
                            field_uids.update(idx.patient_uid for idx in phonetic_matches)
                    
                    # Intersect or union results
                    if not matching_uids:
                        matching_uids = field_uids
                    else:
                        matching_uids &= field_uids  # Intersection for AND logic
            
            # Search phone numbers
            if phone:
                phone_hashes = self._create_phone_hashes(phone)
                phone_uids = set()
                
                for hash_field, hash_value in phone_hashes.items():
                    if hash_value:
                        phone_matches = await self.phone_index_repo.get_all(
                            **{hash_field: hash_value},
                            session=session
                        )
                        phone_uids.update(idx.patient_uid for idx in phone_matches)
                
                if phone_uids:
                    if not matching_uids:
                        matching_uids = phone_uids
                    else:
                        matching_uids &= phone_uids
            
            # Search dates
            if date_of_birth:
                try:
                    dob = datetime.strptime(date_of_birth, '%Y-%m-%d')
                    date_hashes = self._create_date_hashes(dob)
                    date_uids = set()
                    
                    # Use exact date hash for precise matching
                    if date_hashes.get('date_hash'):
                        date_matches = await self.date_index_repo.get_all(
                            field_name='date_of_birth',
                            date_hash=date_hashes['date_hash'],
                            session=session
                        )
                        date_uids.update(idx.patient_uid for idx in date_matches)
                    
                    if date_uids:
                        if not matching_uids:
                            matching_uids = date_uids
                        else:
                            matching_uids &= date_uids
                
                except ValueError:
                    # Invalid date format, skip date search
                    pass
            
            return matching_uids
        
        except Exception as e:
            log_exception(e)
            return set()