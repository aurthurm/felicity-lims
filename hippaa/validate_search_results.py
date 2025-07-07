#!/usr/bin/env python3
"""
Search Results Validation Script for HIPAA Migration

Validates that encrypted search functionality returns accurate results
compared to legacy plaintext search methods.
"""

import asyncio
import sys
from pathlib import Path
from typing import List, Dict, Set, Any
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session
from felicity.apps.patient.services import PatientService
from felicity.apps.analysis.services.result import AnalysisResultService


class SearchResultsValidator:
    """Validates accuracy of encrypted search results."""
    
    def __init__(self):
        self.patient_service = PatientService()
        self.result_service = AnalysisResultService()
        self.validation_errors = []
        self.validation_warnings = []
        self.test_results = []
    
    async def get_test_search_terms(self) -> List[str]:
        """Get a variety of search terms from actual data for testing."""
        
        print("Collecting test search terms from database...")
        
        try:
            async with async_session() as session:
                # Get sample first names
                name_query = """
                    SELECT DISTINCT first_name 
                    FROM patient 
                    WHERE first_name IS NOT NULL 
                    AND LENGTH(first_name) > 2
                    ORDER BY first_name 
                    LIMIT 10
                """
                result = await session.execute(name_query)
                first_names = [row[0] for row in result.fetchall()]
                
                # Get sample last names
                lastname_query = """
                    SELECT DISTINCT last_name 
                    FROM patient 
                    WHERE last_name IS NOT NULL 
                    AND LENGTH(last_name) > 2
                    ORDER BY last_name 
                    LIMIT 10
                """
                result = await session.execute(lastname_query)
                last_names = [row[0] for row in result.fetchall()]
                
                # Get sample emails (domain parts)
                email_query = """
                    SELECT DISTINCT 
                        SUBSTRING(email FROM '@(.*)$') as domain
                    FROM patient 
                    WHERE email IS NOT NULL 
                    AND email LIKE '%@%'
                    LIMIT 5
                """
                result = await session.execute(email_query)
                email_domains = [row[0] for row in result.fetchall()]
                
                # Get sample phone numbers (last 4 digits)
                phone_query = """
                    SELECT DISTINCT 
                        RIGHT(REGEXP_REPLACE(phone_mobile, '[^0-9]', '', 'g'), 4) as last_four
                    FROM patient 
                    WHERE phone_mobile IS NOT NULL 
                    AND LENGTH(REGEXP_REPLACE(phone_mobile, '[^0-9]', '', 'g')) >= 4
                    LIMIT 5
                """
                result = await session.execute(phone_query)
                phone_suffixes = [row[0] for row in result.fetchall()]
                
                # Combine all search terms
                search_terms = []
                search_terms.extend(first_names[:5])
                search_terms.extend(last_names[:5])
                search_terms.extend([f"@{domain}" for domain in email_domains])
                search_terms.extend(phone_suffixes)
                
                # Add some partial search terms
                search_terms.extend([name[:3] for name in first_names[:3]])
                search_terms.extend([name[:4] for name in last_names[:3]])
                
                print(f"  Collected {len(search_terms)} test search terms")
                return search_terms
        
        except Exception as e:
            print(f"  Error collecting search terms: {e}")
            # Return default search terms
            return ["John", "Smith", "test", "example.com", "123", "Jo", "Smi"]
    
    async def legacy_patient_search(self, search_term: str) -> Set[str]:
        """Perform legacy plaintext search and return patient UIDs."""
        
        try:
            async with async_session() as session:
                query = """
                    SELECT DISTINCT uid
                    FROM patient 
                    WHERE (first_name ILIKE :term 
                           OR last_name ILIKE :term 
                           OR email ILIKE :term 
                           OR phone_mobile ILIKE :term 
                           OR phone_home ILIKE :term)
                    AND migration_status IS NOT NULL
                """
                
                result = await session.execute(query, {"term": f"%{search_term}%"})
                return {row[0] for row in result.fetchall()}
        
        except Exception as e:
            print(f"    Legacy search error: {e}")
            return set()
    
    async def encrypted_patient_search(self, search_term: str) -> Set[str]:
        """Perform encrypted search and return patient UIDs."""
        
        try:
            # Use the encrypted search method
            results = await self.patient_service.search_by_encrypted_fields(
                first_name=search_term,
                last_name=search_term,
                email=search_term,
                phone_mobile=search_term,
                phone_home=search_term
            )
            return {patient.uid for patient in results}
        
        except Exception as e:
            print(f"    Encrypted search error: {e}")
            return set()
    
    async def high_performance_patient_search(self, search_term: str) -> Set[str]:
        """Perform high-performance search and return patient UIDs."""
        
        try:
            # Use the high-performance search method
            results = await self.patient_service.high_performance_search(
                first_name=search_term,
                last_name=search_term,
                email=search_term,
                phone_mobile=search_term,
                phone_home=search_term
            )
            return {patient.uid for patient in results}
        
        except Exception as e:
            print(f"    High-performance search error: {e}")
            return set()
    
    def compare_result_sets(self, legacy_uids: Set[str], encrypted_uids: Set[str], 
                           hp_uids: Set[str], search_term: str) -> Dict[str, Any]:
        """Compare result sets and calculate accuracy metrics."""
        
        # Calculate set differences
        legacy_only = legacy_uids - encrypted_uids - hp_uids
        encrypted_only = encrypted_uids - legacy_uids
        hp_only = hp_uids - legacy_uids
        common_all = legacy_uids & encrypted_uids & hp_uids
        
        # Calculate accuracy metrics using legacy as baseline
        if legacy_uids:
            encrypted_recall = len(legacy_uids & encrypted_uids) / len(legacy_uids) if legacy_uids else 0
            hp_recall = len(legacy_uids & hp_uids) / len(legacy_uids) if legacy_uids else 0
        else:
            encrypted_recall = 1.0 if not encrypted_uids else 0.0
            hp_recall = 1.0 if not hp_uids else 0.0
        
        if encrypted_uids:
            encrypted_precision = len(legacy_uids & encrypted_uids) / len(encrypted_uids)
        else:
            encrypted_precision = 1.0 if not legacy_uids else 0.0
        
        if hp_uids:
            hp_precision = len(legacy_uids & hp_uids) / len(hp_uids)
        else:
            hp_precision = 1.0 if not legacy_uids else 0.0
        
        return {
            "search_term": search_term,
            "counts": {
                "legacy": len(legacy_uids),
                "encrypted": len(encrypted_uids),
                "high_performance": len(hp_uids),
                "common_all": len(common_all)
            },
            "differences": {
                "legacy_only": len(legacy_only),
                "encrypted_only": len(encrypted_only),
                "hp_only": len(hp_only)
            },
            "accuracy": {
                "encrypted_recall": encrypted_recall,
                "encrypted_precision": encrypted_precision,
                "hp_recall": hp_recall,
                "hp_precision": hp_precision
            },
            "sample_differences": {
                "legacy_only": list(legacy_only)[:3],  # Sample of UIDs for debugging
                "encrypted_only": list(encrypted_only)[:3],
                "hp_only": list(hp_only)[:3]
            }
        }
    
    async def validate_patient_search_accuracy(self, search_terms: List[str]) -> bool:
        """Validate patient search accuracy across different methods."""
        
        print("Validating patient search accuracy...")
        
        all_accurate = True
        accuracy_threshold = 0.95  # 95% accuracy required
        
        for i, term in enumerate(search_terms):
            print(f"  Testing search term {i+1}/{len(search_terms)}: '{term}'")
            
            # Perform searches with all methods
            legacy_uids = await self.legacy_patient_search(term)
            encrypted_uids = await self.encrypted_patient_search(term)
            hp_uids = await self.high_performance_patient_search(term)
            
            # Compare results
            comparison = self.compare_result_sets(legacy_uids, encrypted_uids, hp_uids, term)
            self.test_results.append(comparison)
            
            # Print summary
            counts = comparison["counts"]
            accuracy = comparison["accuracy"]
            
            print(f"    Results: Legacy={counts['legacy']}, "
                  f"Encrypted={counts['encrypted']}, HP={counts['high_performance']}")
            print(f"    Encrypted accuracy: {accuracy['encrypted_recall']:.2%} recall, "
                  f"{accuracy['encrypted_precision']:.2%} precision")
            print(f"    HP accuracy: {accuracy['hp_recall']:.2%} recall, "
                  f"{accuracy['hp_precision']:.2%} precision")
            
            # Check accuracy thresholds
            if accuracy['encrypted_recall'] < accuracy_threshold:
                self.validation_errors.append(
                    f"Encrypted search recall too low for '{term}': "
                    f"{accuracy['encrypted_recall']:.2%} < {accuracy_threshold:.2%}"
                )
                all_accurate = False
                print(f"    ❌ Encrypted search recall below threshold")
            
            if accuracy['hp_recall'] < accuracy_threshold:
                self.validation_errors.append(
                    f"HP search recall too low for '{term}': "
                    f"{accuracy['hp_recall']:.2%} < {accuracy_threshold:.2%}"
                )
                all_accurate = False
                print(f"    ❌ HP search recall below threshold")
            
            if accuracy['encrypted_precision'] < accuracy_threshold:
                self.validation_warnings.append(
                    f"Encrypted search precision low for '{term}': "
                    f"{accuracy['encrypted_precision']:.2%}"
                )
                print(f"    ⚠️  Encrypted search precision below threshold")
            
            if accuracy['hp_precision'] < accuracy_threshold:
                self.validation_warnings.append(
                    f"HP search precision low for '{term}': "
                    f"{accuracy['hp_precision']:.2%}"
                )
                print(f"    ⚠️  HP search precision below threshold")
            
            # Show sample differences for debugging
            if comparison["differences"]["legacy_only"] > 0:
                print(f"    Legacy-only results: {comparison['differences']['legacy_only']} "
                      f"(sample: {comparison['sample_differences']['legacy_only']})")
            
            if comparison["differences"]["encrypted_only"] > 0:
                print(f"    Encrypted-only results: {comparison['differences']['encrypted_only']} "
                      f"(sample: {comparison['sample_differences']['encrypted_only']})")
        
        return all_accurate
    
    async def validate_analysis_result_search(self, search_terms: List[str]) -> bool:
        """Validate analysis result search accuracy."""
        
        print("\nValidating analysis result search accuracy...")
        
        # Use only medical-relevant search terms
        medical_terms = ["positive", "negative", "normal", "abnormal", "glucose", "blood"]
        test_terms = [term for term in search_terms if any(med in term.lower() for med in medical_terms)]
        
        # Add default medical terms if none found
        if not test_terms:
            test_terms = medical_terms[:3]
        
        all_accurate = True
        
        for term in test_terms[:5]:  # Limit to 5 terms
            print(f"  Testing result search: '{term}'")
            
            try:
                # Get legacy results
                async with async_session() as session:
                    legacy_query = """
                        SELECT DISTINCT uid 
                        FROM analysis_result 
                        WHERE result ILIKE :term
                    """
                    result = await session.execute(legacy_query, {"term": f"%{term}%"})
                    legacy_result_uids = {row[0] for row in result.fetchall()}
                
                # Get HIPAA-compliant results
                hipaa_results = await self.result_service.hipaa_compliant_search_by_result(term)
                hipaa_result_uids = {result.uid for result in hipaa_results}
                
                # Compare
                if legacy_result_uids:
                    recall = len(legacy_result_uids & hipaa_result_uids) / len(legacy_result_uids)
                else:
                    recall = 1.0 if not hipaa_result_uids else 0.0
                
                print(f"    Legacy: {len(legacy_result_uids)}, HIPAA: {len(hipaa_result_uids)}")
                print(f"    Recall: {recall:.2%}")
                
                if recall < 0.95:
                    self.validation_errors.append(
                        f"Result search recall too low for '{term}': {recall:.2%}"
                    )
                    all_accurate = False
                    print(f"    ❌ Recall below threshold")
                else:
                    print(f"    ✅ Accuracy acceptable")
            
            except Exception as e:
                self.validation_errors.append(f"Result search validation failed for '{term}': {e}")
                print(f"    ❌ Error: {e}")
                all_accurate = False
        
        return all_accurate
    
    def generate_summary(self):
        """Generate validation summary with statistics."""
        
        if not self.test_results:
            print("No test results available for summary")
            return
        
        # Calculate overall statistics
        total_tests = len(self.test_results)
        encrypted_recalls = [r["accuracy"]["encrypted_recall"] for r in self.test_results]
        hp_recalls = [r["accuracy"]["hp_recall"] for r in self.test_results]
        encrypted_precisions = [r["accuracy"]["encrypted_precision"] for r in self.test_results]
        hp_precisions = [r["accuracy"]["hp_precision"] for r in self.test_results]
        
        avg_encrypted_recall = sum(encrypted_recalls) / len(encrypted_recalls) if encrypted_recalls else 0
        avg_hp_recall = sum(hp_recalls) / len(hp_recalls) if hp_recalls else 0
        avg_encrypted_precision = sum(encrypted_precisions) / len(encrypted_precisions) if encrypted_precisions else 0
        avg_hp_precision = sum(hp_precisions) / len(hp_precisions) if hp_precisions else 0
        
        # Count tests meeting thresholds
        encrypted_recall_passed = sum(1 for r in encrypted_recalls if r >= 0.95)
        hp_recall_passed = sum(1 for r in hp_recalls if r >= 0.95)
        
        print(f"\n" + "=" * 60)
        print("SEARCH RESULTS VALIDATION SUMMARY")
        print("=" * 60)
        print(f"Total search terms tested: {total_tests}")
        print(f"Average encrypted search recall: {avg_encrypted_recall:.2%}")
        print(f"Average encrypted search precision: {avg_encrypted_precision:.2%}")
        print(f"Average HP search recall: {avg_hp_recall:.2%}")
        print(f"Average HP search precision: {avg_hp_precision:.2%}")
        print(f"Encrypted searches meeting 95% recall threshold: {encrypted_recall_passed}/{total_tests}")
        print(f"HP searches meeting 95% recall threshold: {hp_recall_passed}/{total_tests}")
    
    async def run_validation(self) -> bool:
        """Run complete search results validation."""
        
        print("HIPAA Search Results Validation")
        print("=" * 50)
        
        # Get test search terms
        search_terms = await self.get_test_search_terms()
        
        # Validate patient search accuracy
        patient_accuracy = await self.validate_patient_search_accuracy(search_terms)
        
        # Validate analysis result search accuracy
        result_accuracy = await self.validate_analysis_result_search(search_terms)
        
        # Generate summary
        self.generate_summary()
        
        # Print final results
        print(f"\n" + "=" * 50)
        print("VALIDATION RESULTS")
        print("=" * 50)
        
        all_passed = patient_accuracy and result_accuracy
        
        print(f"Patient search accuracy: {'✅ PASSED' if patient_accuracy else '❌ FAILED'}")
        print(f"Result search accuracy: {'✅ PASSED' if result_accuracy else '❌ FAILED'}")
        
        if self.validation_errors:
            print(f"\n❌ ERRORS ({len(self.validation_errors)}):")
            for error in self.validation_errors:
                print(f"  • {error}")
        
        if self.validation_warnings:
            print(f"\n⚠️  WARNINGS ({len(self.validation_warnings)}):")
            for warning in self.validation_warnings:
                print(f"  • {warning}")
        
        if all_passed:
            print(f"\n✅ ALL SEARCH VALIDATION TESTS PASSED")
        else:
            print(f"\n❌ SOME SEARCH VALIDATION TESTS FAILED")
        
        return all_passed


async def main():
    """Main entry point for search results validation."""
    
    validator = SearchResultsValidator()
    success = await validator.run_validation()
    
    return success


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)