import base64
import hashlib
import os
from typing import Optional, Union

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

from felicity.core.config import settings
from felicity.utils.exception_logger import log_exception


def derive_key(secret_key):
    # Use a key derivation function to get a suitable encryption key
    dk = hashlib.pbkdf2_hmac("sha256", secret_key.encode(), b"salt", 100000)
    return base64.urlsafe_b64encode(dk)


# Encrypt data
def encrypt_data(data):
    try:
        if data:
            cipher_suite = Fernet(derive_key(settings.SECRET_KEY))
            encrypted_data = cipher_suite.encrypt(data.encode())
            return encrypted_data.decode()  # Convert bytes to string
        else:
            return ""
    except Exception as e:
        log_exception(e)
        return ""


# Decrypt data
def decrypt_data(encrypted_data):
    try:
        if encrypted_data:
            cipher_suite = Fernet(derive_key(settings.SECRET_KEY))
            decrypted_data = cipher_suite.decrypt(
                encrypted_data.encode()
            )  # Convert string back to bytes
            return decrypted_data.decode()
        else:
            return ""
    except Exception as e:
        log_exception(e)
        return ""


class HIPAAEncryption:
    """
    HIPAA-compliant encryption utility for protecting sensitive data at rest.
    
    Uses AES-256 encryption through the Fernet symmetric encryption implementation
    which provides authenticated encryption with associated data (AEAD).
    """

    def __init__(self, password: Optional[str] = None):
        """
        Initialize the encryption utility.
        
        Args:
            password: Optional password for key derivation. If not provided,
                     will use environment variable HIPAA_ENCRYPTION_KEY or
                     generate a new key.
        """
        self._fernet = self._initialize_fernet(password)

    def _initialize_fernet(self, password: Optional[str] = None) -> Fernet:
        """
        Initialize the Fernet encryption instance.
        
        Args:
            password: Optional password for key derivation
            
        Returns:
            Fernet instance for encryption/decryption
        """
        if password:
            # Derive key from password using stronger salt
            salt = os.urandom(16)
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        else:
            # Use environment variable or derive from settings
            env_key = settings.HIPAA_ENCRYPTION_KEY
            if not env_key:
                # Use existing settings-based key derivation for consistency
                key = derive_key(settings.SECRET_KEY)
            else:
                # Environment key is already base64url-encoded, use as bytes
                key = env_key.encode('utf-8')
        
        return Fernet(key)

    def encrypt_pii(self, data: Union[str, bytes, None]) -> Optional[str]:
        """
        Encrypt personally identifiable information for HIPAA compliance.
        
        Args:
            data: The PII data to encrypt (string, bytes, or None)
            
        Returns:
            Base64-encoded encrypted data as string, or None if input is None
        """
        if data is None:
            return None

        try:
            if isinstance(data, str):
                data = data.encode('utf-8')

            encrypted_data = self._fernet.encrypt(data)
            return base64.urlsafe_b64encode(encrypted_data).decode('utf-8')
        except Exception as e:
            log_exception(e)
            return None

    def decrypt_pii(self, encrypted_data: Optional[str]) -> Optional[str]:
        """
        Decrypt HIPAA-protected personally identifiable information.
        
        Args:
            encrypted_data: Base64-encoded encrypted data, or None
            
        Returns:
            Decrypted data as string, or None if input is None
        """
        if encrypted_data is None:
            return None

        try:
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode('utf-8'))
            decrypted_data = self._fernet.decrypt(encrypted_bytes)
            return decrypted_data.decode('utf-8')
        except Exception as e:
            log_exception(e)
            return None

    def encrypt_phi(self, data: Union[str, bytes, None]) -> Optional[str]:
        """
        Encrypt protected health information for HIPAA compliance.
        
        Args:
            data: The PHI data to encrypt (string, bytes, or None)
            
        Returns:
            Base64-encoded encrypted data as string, or None if input is None
        """
        return self.encrypt_pii(data)  # Same encryption method for both PII and PHI

    def decrypt_phi(self, encrypted_data: Optional[str]) -> Optional[str]:
        """
        Decrypt HIPAA-protected health information.
        
        Args:
            encrypted_data: Base64-encoded encrypted data, or None
            
        Returns:
            Decrypted data as string, or None if input is None
        """
        return self.decrypt_pii(encrypted_data)  # Same decryption method for both PII and PHI


# Global instance for application use
hipaa_encryption = HIPAAEncryption()


def encrypt_pii(data: Union[str, bytes, None]) -> Optional[str]:
    """
    Convenience function to encrypt personally identifiable information.
    
    Args:
        data: The PII data to encrypt
        
    Returns:
        Encrypted data as string, or None if input is None
    """
    return hipaa_encryption.encrypt_pii(data)


def decrypt_pii(encrypted_data: Optional[str]) -> Optional[str]:
    """
    Convenience function to decrypt personally identifiable information.
    
    Args:
        encrypted_data: The encrypted PII data
        
    Returns:
        Decrypted data as string, or None if input is None
    """
    return hipaa_encryption.decrypt_pii(encrypted_data)


def encrypt_phi(data: Union[str, bytes, None]) -> Optional[str]:
    """
    Convenience function to encrypt protected health information.
    
    Args:
        data: The PHI data to encrypt
        
    Returns:
        Encrypted data as string, or None if input is None
    """
    return hipaa_encryption.encrypt_phi(data)


def decrypt_phi(encrypted_data: Optional[str]) -> Optional[str]:
    """
    Convenience function to decrypt protected health information.
    
    Args:
        encrypted_data: The encrypted PHI data
        
    Returns:
        Decrypted data as string, or None if input is None
    """
    return hipaa_encryption.decrypt_phi(encrypted_data)
