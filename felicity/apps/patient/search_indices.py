"""
Searchable Encryption Indices for HIPAA-compliant Patient Search

This module implements searchable encryption indices that allow efficient
searching of encrypted patient data without decrypting all records.
Uses cryptographic hash-based indices for performance optimization.
"""

from sqlalchemy import Column, String, Index, ForeignKey
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity


class PatientSearchIndex(LabScopedEntity):
    """
    Searchable encryption index for patient data.
    
    Stores cryptographic hashes of searchable terms to enable efficient
    database-level searching without exposing plaintext data.
    """
    
    __tablename__ = "patient_search_index"
    
    # Foreign key to the patient
    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=False)
    patient = relationship("Patient", backref="search_indices", lazy="selectin")
    
    # Field being indexed
    field_name = Column(String, nullable=False)  # e.g., 'first_name', 'last_name', 'email'
    
    # Searchable hash of the field value (using HMAC for security)
    search_hash = Column(String, nullable=False, index=True)
    
    # Additional partial hashes for substring searches
    partial_hash_3 = Column(String, nullable=True, index=True)  # First 3 characters
    partial_hash_4 = Column(String, nullable=True, index=True)  # First 4 characters
    partial_hash_5 = Column(String, nullable=True, index=True)  # First 5 characters
    
    # Soundex or phonetic hash for fuzzy matching
    phonetic_hash = Column(String, nullable=True, index=True)
    
    # Metadata for search optimization
    value_length = Column(String, nullable=True)  # Encrypted length for range queries
    
    # Create composite indices for efficient searching
    __table_args__ = (
        Index('idx_patient_field_hash', 'field_name', 'search_hash'),
        Index('idx_patient_partial_3', 'field_name', 'partial_hash_3'),
        Index('idx_patient_partial_4', 'field_name', 'partial_hash_4'),
        Index('idx_patient_partial_5', 'field_name', 'partial_hash_5'),
        Index('idx_patient_phonetic', 'field_name', 'phonetic_hash'),
    )


class PhoneSearchIndex(LabScopedEntity):
    """
    Specialized search index for phone numbers with normalization.
    
    Handles various phone number formats and provides efficient searching
    for phone-related queries while maintaining HIPAA compliance.
    """
    
    __tablename__ = "phone_search_index"
    
    # Foreign key to the patient
    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=False)
    patient = relationship("Patient", backref="phone_indices", lazy="selectin")
    
    # Field being indexed (phone_mobile, phone_home)
    field_name = Column(String, nullable=False)
    
    # Normalized phone number hash (digits only)
    normalized_hash = Column(String, nullable=False, index=True)
    
    # Last 4 digits hash for partial matching
    last_four_hash = Column(String, nullable=True, index=True)
    
    # Area code hash for regional searches
    area_code_hash = Column(String, nullable=True, index=True)
    
    # Create composite indices
    __table_args__ = (
        Index('idx_phone_normalized', 'field_name', 'normalized_hash'),
        Index('idx_phone_last_four', 'field_name', 'last_four_hash'),
        Index('idx_phone_area_code', 'field_name', 'area_code_hash'),
    )


class DateSearchIndex(LabScopedEntity):
    """
    Search index for date fields with range query support.
    
    Provides efficient date-based searching while maintaining encryption
    of the actual date values.
    """
    
    __tablename__ = "date_search_index"
    
    # Foreign key to the patient
    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=False)
    patient = relationship("Patient", backref="date_indices", lazy="selectin")
    
    # Field being indexed (date_of_birth, etc.)
    field_name = Column(String, nullable=False)
    
    # Year hash for year-based searches
    year_hash = Column(String, nullable=True, index=True)
    
    # Month hash for month-based searches
    month_hash = Column(String, nullable=True, index=True)
    
    # Day hash for day-based searches
    day_hash = Column(String, nullable=True, index=True)
    
    # Full date hash for exact matching
    date_hash = Column(String, nullable=False, index=True)
    
    # Age range hash for demographic queries
    age_range_hash = Column(String, nullable=True, index=True)  # e.g., "20-30", "30-40"
    
    # Create composite indices
    __table_args__ = (
        Index('idx_date_full', 'field_name', 'date_hash'),
        Index('idx_date_year', 'field_name', 'year_hash'),
        Index('idx_date_month', 'field_name', 'month_hash'),
        Index('idx_date_age_range', 'field_name', 'age_range_hash'),
    )