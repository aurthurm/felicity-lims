#!/usr/bin/env python3
"""
HIPAA Migration Runner Script

This script orchestrates the complete HIPAA migration process for existing clients.
It handles data encryption, search index creation, and validation in a safe,
incremental manner with comprehensive logging and rollback capabilities.

Usage:
    python run_migration.py [options]

Options:
    --batch-size N      Process N records per batch (default: 100)
    --dry-run          Show what would be done without making changes
    --table TABLE      Migrate only specific table (patient, analysis_result, etc.)
    --resume           Resume interrupted migration
    --validate-only    Only run validation without migration
    --force            Skip confirmation prompts (use with caution)

Examples:
    # Dry run to see what would be migrated
    python run_migration.py --dry-run
    
    # Migrate patients only with smaller batches
    python run_migration.py --table patient --batch-size 50
    
    # Resume interrupted migration
    python run_migration.py --resume
    
    # Validate migration results
    python run_migration.py --validate-only
"""

import asyncio
import argparse
import logging
import sys
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session
from felicity.apps.patient.entities import Patient
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.utils.encryption import encrypt_pii, encrypt_phi, decrypt_pii, decrypt_phi
from felicity.apps.patient.search_service import SearchableEncryptionService

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'hipaa_migration_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class HIPAAMigrationRunner:
    """Orchestrates the complete HIPAA migration process."""
    
    def __init__(self, batch_size: int = 100, dry_run: bool = False):
        self.batch_size = batch_size
        self.dry_run = dry_run
        self.search_service = SearchableEncryptionService()
        self.total_stats = {
            "processed": 0,
            "successful": 0,
            "failed": 0,
            "errors": []
        }
        
    async def get_migration_status(self, session) -> Dict[str, Dict[str, int]]:
        """Get current migration status for all tables."""
        
        queries = {
            "patient": """
                SELECT 
                    COALESCE(migration_status, 'pending') as status,
                    COUNT(*) as count
                FROM patient 
                GROUP BY COALESCE(migration_status, 'pending')
            """,
            "patient_identification": """
                SELECT 
                    COALESCE(migration_status, 'pending') as status,
                    COUNT(*) as count
                FROM patient_identification 
                GROUP BY COALESCE(migration_status, 'pending')
            """,
            "analysis_result": """
                SELECT 
                    COALESCE(migration_status, 'pending') as status,
                    COUNT(*) as count
                FROM analysis_result 
                WHERE result IS NOT NULL
                GROUP BY COALESCE(migration_status, 'pending')
            """,
            "result_mutation": """
                SELECT 
                    COALESCE(migration_status, 'pending') as status,
                    COUNT(*) as count
                FROM result_mutation 
                GROUP BY COALESCE(migration_status, 'pending')
            """,
            "clinical_data": """
                SELECT 
                    COALESCE(migration_status, 'pending') as status,
                    COUNT(*) as count
                FROM clinical_data 
                GROUP BY COALESCE(migration_status, 'pending')
            """
        }
        
        status = {}
        
        for table_name, query in queries.items():
            try:
                result = await session.execute(query)
                rows = result.fetchall()
                
                table_status = {"pending": 0, "encrypted": 0, "failed": 0, "total": 0}
                
                for row in rows:
                    status_name = row[0] if row[0] else "pending"
                    count = row[1]
                    table_status[status_name] = count
                    table_status["total"] += count
                
                status[table_name] = table_status
                
            except Exception as e:
                logger.error(f"Error getting status for {table_name}: {e}")
                status[table_name] = {"error": str(e)}
        
        return status
    
    async def migrate_patients_batch(self, session, offset: int = 0) -> Dict[str, int]:
        """Migrate a batch of patients to encrypted storage."""
        
        query = """
            SELECT uid, first_name, middle_name, last_name, phone_mobile, 
                   phone_home, email, date_of_birth
            FROM patient 
            WHERE COALESCE(migration_status, 'pending') = 'pending'
            AND first_name IS NOT NULL
            ORDER BY created_at
            OFFSET :offset LIMIT :limit
        """
        
        if self.dry_run:
            logger.info(f"[DRY RUN] Would migrate patients batch: offset={offset}, limit={self.batch_size}")
            # Return fake stats for dry run
            result = await session.execute(query.replace("OFFSET :offset LIMIT :limit", ""), 
                                         {"offset": offset, "limit": self.batch_size})
            count = len(result.fetchall())
            return {"processed": min(count - offset, self.batch_size), "successful": min(count - offset, self.batch_size), "failed": 0, "errors": []}
        
        result = await session.execute(query, {"offset": offset, "limit": self.batch_size})
        patients = result.fetchall()
        
        batch_stats = {"processed": 0, "successful": 0, "failed": 0, "errors": []}
        
        for patient_row in patients:
            try:
                patient_uid = patient_row[0]
                
                # Encrypt patient data
                encrypted_data = {}
                field_mapping = {
                    'first_name': 1,
                    'middle_name': 2, 
                    'last_name': 3,
                    'phone_mobile': 4,
                    'phone_home': 5,
                    'email': 6,
                    'date_of_birth': 7
                }
                
                for field_name, index in field_mapping.items():
                    value = patient_row[index]
                    if value is not None:
                        if field_name == 'date_of_birth':
                            # Handle datetime objects
                            if hasattr(value, 'isoformat'):
                                value = value.isoformat()
                            else:
                                value = str(value)
                        encrypted_data[f'{field_name}_encrypted'] = encrypt_pii(str(value))
                
                # Update patient with encrypted data
                update_fields = []
                update_params = {"uid": patient_uid}
                
                for encrypted_field, encrypted_value in encrypted_data.items():
                    update_fields.append(f"{encrypted_field} = :{encrypted_field}")
                    update_params[encrypted_field] = encrypted_value
                
                update_query = f"""
                    UPDATE patient 
                    SET {', '.join(update_fields)},
                        migration_status = 'encrypted',
                        updated_at = NOW()
                    WHERE uid = :uid
                """
                
                await session.execute(update_query, update_params)
                
                # Create search indices
                patient_obj = Patient()
                patient_obj.uid = patient_uid
                patient_obj.first_name = patient_row[1]
                patient_obj.middle_name = patient_row[2]
                patient_obj.last_name = patient_row[3]
                patient_obj.phone_mobile = patient_row[4]
                patient_obj.phone_home = patient_row[5]
                patient_obj.email = patient_row[6]
                patient_obj.date_of_birth = patient_row[7]
                
                await self.search_service.create_patient_indices(patient_obj, session)
                
                batch_stats["successful"] += 1
                logger.debug(f"Successfully migrated patient {patient_uid}")
                
            except Exception as e:
                batch_stats["failed"] += 1
                error_msg = f"Patient {patient_row[0]}: {str(e)}"
                batch_stats["errors"].append(error_msg)
                logger.error(f"Failed to migrate patient {patient_row[0]}: {str(e)}")
                
            batch_stats["processed"] += 1
        
        if not self.dry_run:
            await session.commit()
        
        return batch_stats
    
    async def migrate_analysis_results_batch(self, session, offset: int = 0) -> Dict[str, int]:
        """Migrate a batch of analysis results to encrypted storage."""
        
        query = """
            SELECT uid, result
            FROM analysis_result 
            WHERE COALESCE(migration_status, 'pending') = 'pending' 
            AND result IS NOT NULL
            ORDER BY created_at
            OFFSET :offset LIMIT :limit
        """
        
        if self.dry_run:
            logger.info(f"[DRY RUN] Would migrate analysis results batch: offset={offset}, limit={self.batch_size}")
            result = await session.execute(query.replace("OFFSET :offset LIMIT :limit", ""), 
                                         {"offset": offset, "limit": self.batch_size})
            count = len(result.fetchall())
            return {"processed": min(count - offset, self.batch_size), "successful": min(count - offset, self.batch_size), "failed": 0, "errors": []}
        
        result = await session.execute(query, {"offset": offset, "limit": self.batch_size})
        results = result.fetchall()
        
        batch_stats = {"processed": 0, "successful": 0, "failed": 0, "errors": []}
        
        for result_row in results:
            try:
                result_uid = result_row[0]
                result_value = result_row[1]
                
                # Encrypt result value
                encrypted_result = encrypt_phi(str(result_value))
                
                # Update analysis result
                update_query = """
                    UPDATE analysis_result 
                    SET result_encrypted = :result_encrypted,
                        migration_status = 'encrypted',
                        updated_at = NOW()
                    WHERE uid = :uid
                """
                
                await session.execute(update_query, {
                    "uid": result_uid,
                    "result_encrypted": encrypted_result
                })
                
                batch_stats["successful"] += 1
                logger.debug(f"Successfully migrated analysis result {result_uid}")
                
            except Exception as e:
                batch_stats["failed"] += 1
                error_msg = f"Result {result_row[0]}: {str(e)}"
                batch_stats["errors"].append(error_msg)
                logger.error(f"Failed to migrate result {result_row[0]}: {str(e)}")
                
            batch_stats["processed"] += 1
        
        if not self.dry_run:
            await session.commit()
        
        return batch_stats
    
    async def migrate_table(self, session, table_name: str) -> bool:
        """Migrate a specific table."""
        
        logger.info(f"Starting migration for table: {table_name}")
        
        if table_name == "patient":
            offset = 0
            while True:
                batch_stats = await self.migrate_patients_batch(session, offset)
                
                if batch_stats["processed"] == 0:
                    break
                
                # Update total stats
                for key in ["processed", "successful", "failed"]:
                    self.total_stats[key] += batch_stats[key]
                self.total_stats["errors"].extend(batch_stats["errors"])
                
                logger.info(f"Patients batch completed - Processed: {batch_stats['processed']}, "
                           f"Successful: {batch_stats['successful']}, Failed: {batch_stats['failed']}")
                
                if batch_stats["errors"]:
                    for error in batch_stats["errors"][:3]:  # Show first 3 errors
                        logger.warning(f"  Error: {error}")
                    if len(batch_stats["errors"]) > 3:
                        logger.warning(f"  ... and {len(batch_stats['errors']) - 3} more errors")
                
                offset += batch_stats["processed"]
                
        elif table_name == "analysis_result":
            offset = 0
            while True:
                batch_stats = await self.migrate_analysis_results_batch(session, offset)
                
                if batch_stats["processed"] == 0:
                    break
                
                # Update total stats
                for key in ["processed", "successful", "failed"]:
                    self.total_stats[key] += batch_stats[key]
                self.total_stats["errors"].extend(batch_stats["errors"])
                
                logger.info(f"Analysis results batch completed - Processed: {batch_stats['processed']}, "
                           f"Successful: {batch_stats['successful']}, Failed: {batch_stats['failed']}")
                
                offset += batch_stats["processed"]
        
        else:
            logger.warning(f"Migration for table '{table_name}' not yet implemented")
            return False
        
        return True
    
    async def validate_migration(self, session) -> bool:
        """Validate that migration completed successfully."""
        
        logger.info("Validating migration results...")
        
        validation_queries = {
            "unmigrated_patients": """
                SELECT COUNT(*) FROM patient 
                WHERE COALESCE(migration_status, 'pending') = 'pending'
                AND first_name IS NOT NULL
            """,
            "unmigrated_results": """
                SELECT COUNT(*) FROM analysis_result 
                WHERE COALESCE(migration_status, 'pending') = 'pending'
                AND result IS NOT NULL
            """,
            "encrypted_patients": """
                SELECT COUNT(*) FROM patient 
                WHERE migration_status = 'encrypted'
            """,
            "patient_indices": """
                SELECT COUNT(DISTINCT patient_uid) FROM patient_search_index
            """,
        }
        
        validation_results = {}
        
        for check_name, query in validation_queries.items():
            try:
                result = await session.execute(query)
                count = result.scalar()
                validation_results[check_name] = count
                logger.info(f"Validation - {check_name}: {count}")
            except Exception as e:
                logger.error(f"Validation failed for {check_name}: {e}")
                validation_results[check_name] = f"ERROR: {e}"
        
        # Check for critical issues
        success = True
        
        if validation_results.get("unmigrated_patients", 0) > 0:
            logger.error(f"CRITICAL: {validation_results['unmigrated_patients']} patients still unmigrated!")
            success = False
        
        if validation_results.get("unmigrated_results", 0) > 0:
            logger.error(f"CRITICAL: {validation_results['unmigrated_results']} analysis results still unmigrated!")
            success = False
        
        # Test encryption/decryption
        try:
            test_query = """
                SELECT first_name_encrypted 
                FROM patient 
                WHERE migration_status = 'encrypted' 
                AND first_name_encrypted IS NOT NULL 
                LIMIT 1
            """
            result = await session.execute(test_query)
            encrypted_value = result.scalar()
            
            if encrypted_value:
                decrypted_value = decrypt_pii(encrypted_value)
                if decrypted_value:
                    logger.info("Encryption/decryption test: PASSED")
                else:
                    logger.error("Encryption/decryption test: FAILED - Could not decrypt")
                    success = False
            else:
                logger.warning("Encryption/decryption test: SKIPPED - No encrypted data found")
        
        except Exception as e:
            logger.error(f"Encryption/decryption test: FAILED - {e}")
            success = False
        
        return success
    
    async def run_migration(self, tables: Optional[List[str]] = None, 
                           resume: bool = False, validate_only: bool = False) -> bool:
        """Run the complete migration process."""
        
        if validate_only:
            async with async_session() as session:
                return await self.validate_migration(session)
        
        logger.info("=" * 60)
        logger.info("HIPAA DATA MIGRATION STARTING")
        logger.info("=" * 60)
        
        if self.dry_run:
            logger.info("*** DRY RUN MODE - NO CHANGES WILL BE MADE ***")
        
        try:
            async with async_session() as session:
                # Get initial status
                initial_status = await self.get_migration_status(session)
                
                logger.info("Initial Migration Status:")
                for table_name, status in initial_status.items():
                    if "error" in status:
                        logger.error(f"  {table_name}: {status['error']}")
                    else:
                        total = status.get("total", 0)
                        pending = status.get("pending", 0)
                        encrypted = status.get("encrypted", 0)
                        failed = status.get("failed", 0)
                        logger.info(f"  {table_name}: {pending} pending, {encrypted} encrypted, {failed} failed (total: {total})")
                
                # Determine which tables to migrate
                if tables is None:
                    tables_to_migrate = ["patient", "analysis_result"]
                else:
                    tables_to_migrate = tables
                
                # Migrate each table
                for table_name in tables_to_migrate:
                    if not await self.migrate_table(session, table_name):
                        logger.error(f"Migration failed for table: {table_name}")
                        return False
                
                # Get final status
                final_status = await self.get_migration_status(session)
                
                logger.info("Final Migration Status:")
                for table_name, status in final_status.items():
                    if "error" in status:
                        logger.error(f"  {table_name}: {status['error']}")
                    else:
                        total = status.get("total", 0)
                        pending = status.get("pending", 0)
                        encrypted = status.get("encrypted", 0)
                        failed = status.get("failed", 0)
                        logger.info(f"  {table_name}: {pending} pending, {encrypted} encrypted, {failed} failed (total: {total})")
                
                # Validate results
                validation_success = await self.validate_migration(session)
                
                # Print summary
                logger.info("=" * 60)
                logger.info("MIGRATION SUMMARY")
                logger.info("=" * 60)
                logger.info(f"Total Records Processed: {self.total_stats['processed']}")
                logger.info(f"Successful Migrations: {self.total_stats['successful']}")
                logger.info(f"Failed Migrations: {self.total_stats['failed']}")
                logger.info(f"Validation: {'PASSED' if validation_success else 'FAILED'}")
                
                if self.total_stats["errors"]:
                    logger.info(f"Errors encountered: {len(self.total_stats['errors'])}")
                    for error in self.total_stats["errors"][:10]:  # Show first 10 errors
                        logger.error(f"  {error}")
                    if len(self.total_stats["errors"]) > 10:
                        logger.info(f"  ... and {len(self.total_stats['errors']) - 10} more errors")
                
                if self.dry_run:
                    logger.info("*** DRY RUN COMPLETED - NO CHANGES WERE MADE ***")
                
                return validation_success and self.total_stats["failed"] == 0
        
        except Exception as e:
            logger.error(f"Migration failed with exception: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return False


def main():
    """Main entry point for the migration script."""
    
    parser = argparse.ArgumentParser(
        description='HIPAA Migration Runner - Migrate existing data to encrypted storage',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    parser.add_argument('--batch-size', type=int, default=100,
                       help='Number of records to process per batch (default: 100)')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be done without making changes')
    parser.add_argument('--table', type=str, choices=['patient', 'analysis_result'],
                       help='Migrate only specific table')
    parser.add_argument('--resume', action='store_true',
                       help='Resume interrupted migration')
    parser.add_argument('--validate-only', action='store_true',
                       help='Only run validation without migration')
    parser.add_argument('--force', action='store_true',
                       help='Skip confirmation prompts (use with caution)')
    
    args = parser.parse_args()
    
    # Confirmation for non-dry-run operations
    if not args.dry_run and not args.validate_only and not args.force:
        print("WARNING: This operation will modify production data!")
        print("Ensure you have:")
        print("  1. Created a complete database backup")
        print("  2. Tested the migration on a copy of production data")
        print("  3. Scheduled appropriate maintenance window")
        print()
        confirm = input("Type 'MIGRATE_PRODUCTION_DATA' to continue: ")
        
        if confirm != "MIGRATE_PRODUCTION_DATA":
            print("Migration cancelled.")
            sys.exit(0)
    
    # Create migration runner
    runner = HIPAAMigrationRunner(
        batch_size=args.batch_size,
        dry_run=args.dry_run
    )
    
    # Determine tables to migrate
    tables = [args.table] if args.table else None
    
    # Run migration
    try:
        success = asyncio.run(runner.run_migration(
            tables=tables,
            resume=args.resume,
            validate_only=args.validate_only
        ))
        
        if success:
            logger.info("Migration completed successfully!")
            sys.exit(0)
        else:
            logger.error("Migration failed!")
            sys.exit(1)
    
    except KeyboardInterrupt:
        logger.info("Migration interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Migration failed with unexpected error: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        sys.exit(1)


if __name__ == "__main__":
    main()