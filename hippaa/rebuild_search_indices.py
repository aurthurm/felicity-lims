#!/usr/bin/env python3
"""
Search Index Rebuild Script for HIPAA Migration

Rebuilds search indices for encrypted data, useful for fixing
inconsistencies or updating indices after migration issues.
"""

import asyncio
import argparse
import sys
from pathlib import Path
from typing import List, Dict

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session
from felicity.apps.patient.entities import Patient
from felicity.apps.patient.search_service import SearchableEncryptionService


class SearchIndexRebuilder:
    """Rebuilds search indices for HIPAA-compliant encrypted data."""
    
    def __init__(self, batch_size: int = 100):
        self.batch_size = batch_size
        self.search_service = SearchableEncryptionService()
        self.rebuild_stats = {
            "patients_processed": 0,
            "indices_created": 0,
            "indices_updated": 0,
            "errors": []
        }
    
    async def clear_existing_indices(self, patient_uids: List[str] = None):
        """Clear existing search indices for specified patients or all patients."""
        
        print("Clearing existing search indices...")
        
        try:
            async with async_session() as session:
                
                if patient_uids:
                    # Clear indices for specific patients
                    where_clause = "WHERE patient_uid = ANY(:patient_uids)"
                    params = {"patient_uids": patient_uids}
                else:
                    # Clear all indices
                    where_clause = ""
                    params = {}
                
                # Clear patient search indices
                await session.execute(
                    f"DELETE FROM patient_search_index {where_clause}",
                    params
                )
                
                # Clear phone search indices  
                await session.execute(
                    f"DELETE FROM phone_search_index {where_clause}",
                    params
                )
                
                # Clear date search indices
                await session.execute(
                    f"DELETE FROM date_search_index {where_clause}",
                    params
                )
                
                await session.commit()
                
                if patient_uids:
                    print(f"  ✅ Cleared indices for {len(patient_uids)} patients")
                else:
                    print(f"  ✅ Cleared all search indices")
        
        except Exception as e:
            error_msg = f"Failed to clear search indices: {e}"
            self.rebuild_stats["errors"].append(error_msg)
            print(f"  ❌ {error_msg}")
            raise
    
    async def get_patients_for_rebuild(self, patient_uids: List[str] = None) -> List[Dict]:
        """Get patient data for index rebuilding."""
        
        try:
            async with async_session() as session:
                
                if patient_uids:
                    # Get specific patients
                    query = """
                        SELECT uid, first_name, middle_name, last_name,
                               phone_mobile, phone_home, email, date_of_birth,
                               migration_status
                        FROM patient 
                        WHERE uid = ANY(:patient_uids)
                        AND migration_status = 'encrypted'
                        ORDER BY updated_at
                    """
                    params = {"patient_uids": patient_uids}
                else:
                    # Get all migrated patients
                    query = """
                        SELECT uid, first_name, middle_name, last_name,
                               phone_mobile, phone_home, email, date_of_birth,
                               migration_status
                        FROM patient 
                        WHERE migration_status = 'encrypted'
                        ORDER BY updated_at
                    """
                    params = {}
                
                result = await session.execute(query, params)
                patients = result.fetchall()
                
                patient_data = []
                for patient in patients:
                    patient_dict = {
                        "uid": patient[0],
                        "first_name": patient[1],
                        "middle_name": patient[2],
                        "last_name": patient[3],
                        "phone_mobile": patient[4],
                        "phone_home": patient[5],
                        "email": patient[6],
                        "date_of_birth": patient[7],
                        "migration_status": patient[8]
                    }
                    patient_data.append(patient_dict)
                
                print(f"  Found {len(patient_data)} patients for index rebuild")
                return patient_data
        
        except Exception as e:
            error_msg = f"Failed to get patient data: {e}"
            self.rebuild_stats["errors"].append(error_msg)
            print(f"  ❌ {error_msg}")
            raise
    
    async def rebuild_indices_batch(self, patients: List[Dict]) -> Dict[str, int]:
        """Rebuild search indices for a batch of patients."""
        
        batch_stats = {"processed": 0, "indices_created": 0, "errors": 0}
        
        try:
            async with async_session() as session:
                
                for patient_data in patients:
                    try:
                        # Create Patient object for the search service
                        patient = Patient()
                        patient.uid = patient_data["uid"]
                        patient.first_name = patient_data["first_name"]
                        patient.middle_name = patient_data["middle_name"]
                        patient.last_name = patient_data["last_name"]
                        patient.phone_mobile = patient_data["phone_mobile"]
                        patient.phone_home = patient_data["phone_home"]
                        patient.email = patient_data["email"]
                        patient.date_of_birth = patient_data["date_of_birth"]
                        
                        # Create search indices
                        await self.search_service.create_patient_indices(patient, session)
                        
                        batch_stats["indices_created"] += 1
                        batch_stats["processed"] += 1
                        
                    except Exception as e:
                        batch_stats["errors"] += 1
                        batch_stats["processed"] += 1
                        error_msg = f"Failed to rebuild indices for patient {patient_data['uid']}: {e}"
                        self.rebuild_stats["errors"].append(error_msg)
                        print(f"    ❌ {error_msg}")
                
                await session.commit()
        
        except Exception as e:
            error_msg = f"Batch rebuild failed: {e}"
            self.rebuild_stats["errors"].append(error_msg)
            print(f"  ❌ {error_msg}")
            batch_stats["errors"] += len(patients) - batch_stats["processed"]
        
        return batch_stats
    
    async def rebuild_all_indices(self, patient_uids: List[str] = None, 
                                 clear_existing: bool = True):
        """Rebuild all search indices for specified patients or all patients."""
        
        print(f"Starting search index rebuild...")
        if patient_uids:
            print(f"Target: {len(patient_uids)} specific patients")
        else:
            print(f"Target: All migrated patients")
        
        try:
            # Clear existing indices if requested
            if clear_existing:
                await self.clear_existing_indices(patient_uids)
            
            # Get patient data
            patients = await self.get_patients_for_rebuild(patient_uids)
            
            if not patients:
                print("No patients found for index rebuild")
                return
            
            print(f"\nRebuilding indices for {len(patients)} patients...")
            
            # Process in batches
            total_batches = (len(patients) + self.batch_size - 1) // self.batch_size
            
            for batch_num in range(total_batches):
                start_idx = batch_num * self.batch_size
                end_idx = min(start_idx + self.batch_size, len(patients))
                batch_patients = patients[start_idx:end_idx]
                
                print(f"  Processing batch {batch_num + 1}/{total_batches} "
                      f"({len(batch_patients)} patients)...")
                
                batch_stats = await self.rebuild_indices_batch(batch_patients)
                
                # Update overall stats
                self.rebuild_stats["patients_processed"] += batch_stats["processed"]
                self.rebuild_stats["indices_created"] += batch_stats["indices_created"]
                
                print(f"    Processed: {batch_stats['processed']}, "
                      f"Indices created: {batch_stats['indices_created']}, "
                      f"Errors: {batch_stats['errors']}")
        
        except Exception as e:
            error_msg = f"Index rebuild failed: {e}"
            self.rebuild_stats["errors"].append(error_msg)
            print(f"❌ {error_msg}")
            raise
    
    async def validate_rebuilt_indices(self, patient_uids: List[str] = None) -> bool:
        """Validate that indices were rebuilt correctly."""
        
        print("\nValidating rebuilt search indices...")
        
        try:
            async with async_session() as session:
                
                # Check index counts
                if patient_uids:
                    where_clause = "WHERE patient_uid = ANY(:patient_uids)"
                    params = {"patient_uids": patient_uids}
                else:
                    where_clause = ""
                    params = {}
                
                validation_queries = {
                    "patient_search_indices": f"SELECT COUNT(*) FROM patient_search_index {where_clause}",
                    "phone_search_indices": f"SELECT COUNT(*) FROM phone_search_index {where_clause}",
                    "date_search_indices": f"SELECT COUNT(*) FROM date_search_index {where_clause}",
                    "unique_patients_in_indices": f"SELECT COUNT(DISTINCT patient_uid) FROM patient_search_index {where_clause}"
                }
                
                validation_passed = True
                
                for check_name, query in validation_queries.items():
                    result = await session.execute(query, params)
                    count = result.scalar()
                    print(f"  {check_name}: {count}")
                    
                    if count == 0 and check_name != "date_search_indices":
                        # Date indices might be 0 if no patients have dates
                        print(f"    ⚠️  Warning: No {check_name} found")
                        validation_passed = False
                
                # Check for consistency between patient count and index count
                if patient_uids:
                    expected_patients = len(patient_uids)
                else:
                    # Get count of migrated patients
                    patient_count_query = "SELECT COUNT(*) FROM patient WHERE migration_status = 'encrypted'"
                    result = await session.execute(patient_count_query)
                    expected_patients = result.scalar()
                
                result = await session.execute(validation_queries["unique_patients_in_indices"], params)
                indexed_patients = result.scalar()
                
                print(f"  Expected patients with indices: {expected_patients}")
                print(f"  Actual patients with indices: {indexed_patients}")
                
                if indexed_patients < expected_patients * 0.9:  # Allow 10% tolerance
                    print(f"    ❌ Index coverage too low: {indexed_patients}/{expected_patients}")
                    validation_passed = False
                else:
                    print(f"    ✅ Index coverage acceptable")
                
                return validation_passed
        
        except Exception as e:
            error_msg = f"Index validation failed: {e}"
            self.rebuild_stats["errors"].append(error_msg)
            print(f"  ❌ {error_msg}")
            return False
    
    def print_summary(self):
        """Print rebuild summary."""
        
        print(f"\n" + "=" * 60)
        print("SEARCH INDEX REBUILD SUMMARY")
        print("=" * 60)
        print(f"Patients processed: {self.rebuild_stats['patients_processed']}")
        print(f"Indices created: {self.rebuild_stats['indices_created']}")
        print(f"Errors encountered: {len(self.rebuild_stats['errors'])}")
        
        if self.rebuild_stats["errors"]:
            print(f"\nErrors:")
            for error in self.rebuild_stats["errors"][:10]:  # Show first 10 errors
                print(f"  • {error}")
            if len(self.rebuild_stats["errors"]) > 10:
                print(f"  ... and {len(self.rebuild_stats['errors']) - 10} more errors")


async def main():
    """Main entry point for search index rebuilding."""
    
    parser = argparse.ArgumentParser(description='Rebuild search indices for HIPAA migration')
    parser.add_argument('--batch-size', type=int, default=100, 
                       help='Number of patients to process per batch')
    parser.add_argument('--patient-uids', type=str, nargs='*',
                       help='Specific patient UIDs to rebuild indices for')
    parser.add_argument('--no-clear', action='store_true',
                       help='Do not clear existing indices before rebuilding')
    parser.add_argument('--validate-only', action='store_true',
                       help='Only validate existing indices without rebuilding')
    
    args = parser.parse_args()
    
    rebuilder = SearchIndexRebuilder(batch_size=args.batch_size)
    
    try:
        if args.validate_only:
            print("Validating existing search indices...")
            success = await rebuilder.validate_rebuilt_indices(args.patient_uids)
        else:
            print("HIPAA Search Index Rebuild")
            print("=" * 50)
            
            # Rebuild indices
            await rebuilder.rebuild_all_indices(
                patient_uids=args.patient_uids,
                clear_existing=not args.no_clear
            )
            
            # Validate results
            validation_success = await rebuilder.validate_rebuilt_indices(args.patient_uids)
            
            # Print summary
            rebuilder.print_summary()
            
            success = len(rebuilder.rebuild_stats["errors"]) == 0 and validation_success
            
            if success:
                print(f"\n✅ Search index rebuild completed successfully!")
            else:
                print(f"\n❌ Search index rebuild completed with errors!")
        
        return success
        
    except Exception as e:
        print(f"❌ Search index rebuild failed: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)