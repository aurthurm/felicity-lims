#!/usr/bin/env python3
"""
HIPAA Encryption Key Generator

Generates secure, properly formatted encryption keys.
Keys are generated using cryptographically secure random sources.
"""

import base64
import os

from cryptography.fernet import Fernet


def generate_fernet_key() -> str:
    """Generate a secure Fernet key (32 bytes, base64url-encoded)."""
    return Fernet.generate_key().decode('utf-8')


def generate_search_key() -> str:
    """Generate a secure key for searchable encryption (32 bytes, base64url-encoded)."""
    # Generate 32 random bytes and encode as base64url
    key_bytes = os.urandom(32)
    return base64.urlsafe_b64encode(key_bytes).decode('utf-8')


def validate_key(key: str) -> bool:
    """Validate that a key is properly formatted for Fernet."""
    try:
        # Try to create a Fernet instance with the key
        Fernet(key.encode('utf-8'))
        return True
    except Exception:
        return False


def main():
    """Generate and display url safe 32 encryption keys."""

    print("Encryption Key Generator")
    print("=" * 40)
    print()

    # Generate keys
    hipaa_key = generate_fernet_key()
    search_key = generate_search_key()
    secret_key = generate_fernet_key()
    refresh_key = generate_search_key()

    # Validate keys
    hipaa_valid = validate_key(hipaa_key)
    search_valid = validate_key(search_key)
    secret_valid = validate_key(secret_key)
    refresh_valid = validate_key(refresh_key)

    print("Generated Keys:")
    print("-" * 20)
    print(f"HIPAA_ENCRYPTION_KEY={hipaa_key}")
    print(f"SEARCH_ENCRYPTION_KEY={search_key}")
    print(f"SECRET_KEY={secret_key}")
    print(f"REFRESH_SECRET_KEY={refresh_key}")
    print()

    print("Key Validation:")
    print("-" * 15)
    print(f"HIPAA key valid: {'✅ Yes' if hipaa_valid else '❌ No'}")
    print(f"Search key valid: {'✅ Yes' if search_valid else '❌ No'}")
    print(f"Secret key valid: {'✅ Yes' if secret_valid else '❌ No'}")
    print(f"refresh key valid: {'✅ Yes' if refresh_valid else '❌ No'}")
    print()

    print("Instructions:")
    print("-" * 12)
    print("1. Copy the keys above to your .env file")
    print("2. Replace the existing SECRET_KEY and REFRESH_SECRET_KEY, "
          "HIPAA_ENCRYPTION_KEY and SEARCH_ENCRYPTION_KEY values")
    print("3. Keep these keys secure and back them up safely")
    print("4. Do NOT commit these keys to version control")
    print()

    print("⚠️  IMPORTANT SECURITY NOTES:")
    print("• These keys encrypt sensitive patient data")
    print("• Loss of keys means permanent data loss")
    print("• Store backup copies in a secure location")
    print("• Rotate keys periodically for enhanced security")
    print("• Use different keys for different environments")


if __name__ == "__main__":
    main()
