#!/usr/bin/env python3
"""
Test script to verify HIPAA encryption is working correctly.
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))


def run_test():
    try:
        from felicity.utils.encryption import encrypt_pii, decrypt_pii, encrypt_phi, decrypt_phi

        print("Testing HIPAA Encryption")
        print("=" * 30)

        # Test PII encryption
        test_pii_data = "John Doe"
        print(f"\n1. Testing PII encryption with: '{test_pii_data}'")

        encrypted_pii = encrypt_pii(test_pii_data)
        print(f"   Encrypted: {encrypted_pii[:50]}...")

        decrypted_pii = decrypt_pii(encrypted_pii)
        print(f"   Decrypted: {decrypted_pii}")

        pii_success = decrypted_pii == test_pii_data
        print(f"   Status: {'✅ SUCCESS' if pii_success else '❌ FAILED'}")

        # Test PHI encryption
        test_phi_data = "Blood glucose: 95 mg/dL"
        print(f"\n2. Testing PHI encryption with: '{test_phi_data}'")

        encrypted_phi = encrypt_phi(test_phi_data)
        print(f"   Encrypted: {encrypted_phi[:50]}...")

        decrypted_phi = decrypt_phi(encrypted_phi)
        print(f"   Decrypted: {decrypted_phi}")

        phi_success = decrypted_phi == test_phi_data
        print(f"   Status: {'✅ SUCCESS' if phi_success else '❌ FAILED'}")

        # Test edge cases
        print(f"\n3. Testing edge cases")

        # None values
        none_encrypted = encrypt_pii(None)
        print(f"   None encryption: {none_encrypted}")

        # Empty string
        empty_encrypted = encrypt_pii("")
        empty_decrypted = decrypt_pii(empty_encrypted)
        print(f"   Empty string: '{empty_decrypted}'")

        # Overall result
        overall_success = pii_success and phi_success
        print(f"\n{'=' * 30}")
        print(f"Overall Result: {'✅ ALL TESTS PASSED' if overall_success else '❌ SOME TESTS FAILED'}")
        print(f"{'=' * 30}")

        if overall_success:
            print("\n🎉 HIPAA encryption is working correctly!")
            print("You can now start the application safely.")
        else:
            print("\n⚠️  There are issues with the encryption setup.")
            print("Please check the environment variables and try again.")

    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're running this from the project root directory.")
    except Exception as e:
        print(f"❌ Encryption test failed: {e}")
        print("Check your HIPAA_ENCRYPTION_KEY and SEARCH_ENCRYPTION_KEY in .env file")
        sys.exit(1)


if __name__ == "__main__":
    run_test()
