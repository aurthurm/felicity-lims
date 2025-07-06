"""
HIPAA-compliant encrypted database fields for SQLAlchemy

This module provides custom SQLAlchemy column types that automatically
encrypt and decrypt sensitive data to ensure HIPAA compliance for data at rest.
"""

import json
from datetime import datetime
from typing import Optional, Union
from sqlalchemy import String, TypeDecorator
from sqlalchemy.engine import Dialect

from felicity.utils.encryption import encrypt_pii, decrypt_pii, encrypt_phi, decrypt_phi


class EncryptedPIIType(TypeDecorator):
    """
    SQLAlchemy column type for encrypting Personally Identifiable Information (PII).
    
    Automatically encrypts data when storing to database and decrypts when retrieving.
    Uses HIPAA-compliant AES-256 encryption.
    """
    
    impl = String
    cache_ok = True
    
    def process_bind_param(self, value: Optional[Union[str, datetime]], dialect: Dialect) -> Optional[str]:
        """
        Encrypt value before storing in database.
        
        Args:
            value: The plaintext value to encrypt (string or datetime)
            dialect: SQLAlchemy dialect (unused)
            
        Returns:
            Encrypted value or None
        """
        if value is not None:
            # Handle datetime objects by converting to ISO format
            if isinstance(value, datetime):
                value_to_encrypt = value.isoformat()
            else:
                value_to_encrypt = str(value)
            return encrypt_pii(value_to_encrypt)
        return value
    
    def process_result_value(self, value: Optional[str], dialect: Dialect) -> Optional[Union[str, datetime]]:
        """
        Decrypt value after retrieving from database.
        
        Args:
            value: The encrypted value from database
            dialect: SQLAlchemy dialect (unused)
            
        Returns:
            Decrypted plaintext value (string or datetime) or None
        """
        if value is not None:
            decrypted_value = decrypt_pii(value)
            if decrypted_value:
                # Try to parse as datetime if it looks like an ISO format
                try:
                    if 'T' in decrypted_value or '-' in decrypted_value:
                        return datetime.fromisoformat(decrypted_value.replace('Z', '+00:00'))
                except (ValueError, TypeError):
                    pass
                # Return as string if not a datetime
                return decrypted_value
        return value


class EncryptedPHIType(TypeDecorator):
    """
    SQLAlchemy column type for encrypting Protected Health Information (PHI).
    
    Automatically encrypts data when storing to database and decrypts when retrieving.
    Uses HIPAA-compliant AES-256 encryption.
    """
    
    impl = String
    cache_ok = True
    
    def process_bind_param(self, value: Optional[str], dialect: Dialect) -> Optional[str]:
        """
        Encrypt value before storing in database.
        
        Args:
            value: The plaintext value to encrypt
            dialect: SQLAlchemy dialect (unused)
            
        Returns:
            Encrypted value or None
        """
        if value is not None:
            return encrypt_phi(value)
        return value
    
    def process_result_value(self, value: Optional[str], dialect: Dialect) -> Optional[str]:
        """
        Decrypt value after retrieving from database.
        
        Args:
            value: The encrypted value from database
            dialect: SQLAlchemy dialect (unused)
            
        Returns:
            Decrypted plaintext value or None
        """
        if value is not None:
            return decrypt_phi(value)
        return value


# Convenience functions for creating encrypted columns
def EncryptedPII(length: int = 255, **kwargs) -> EncryptedPIIType:
    """
    Create an encrypted PII column.
    
    Args:
        length: Maximum length of the encrypted data (default: 255)
        **kwargs: Additional column arguments
        
    Returns:
        EncryptedPIIType column
    """
    return EncryptedPIIType(length, **kwargs)


def EncryptedPHI(length: int = 255, **kwargs) -> EncryptedPHIType:
    """
    Create an encrypted PHI column.
    
    Args:
        length: Maximum length of the encrypted data (default: 255)
        **kwargs: Additional column arguments
        
    Returns:
        EncryptedPHIType column
    """
    return EncryptedPHIType(length, **kwargs)