#!/usr/bin/env python3
"""
Search Results Comparison Script for HIPAA Migration

Compares search results between encrypted and plaintext search methods
to ensure encrypted search accuracy and completeness.
"""

import asyncio
import argparse
import sys
from pathlib import Path
from typing import List, Dict, Set, Any, Optional
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session
from felicity.apps.patient.services import PatientService


class SearchResultsComparator:
    """Compares search results between different search methods."""
    
    def __init__(self):
        self.patient_service = PatientService()
        self.comparison_results = []
        self.summary_stats = {
            "total_comparisons": 0,
            "exact_matches": 0,
            "acceptable_matches": 0,
            "poor_matches": 0,
            "failed_comparisons": 0
        }
    
    async def get_test_search_terms(self, limit: int = 10) -> List[str]:
        """Get search terms from actual data for testing."""
        
        print(f"Collecting {limit} test search terms...")
        
        try:
            async with async_session() as session:
                
                # Get common first names
                first_name_query = """
                    SELECT first_name, COUNT(*) as frequency
                    FROM patient 
                    WHERE first_name IS NOT NULL 
                    AND LENGTH(first_name) > 2
                    GROUP BY first_name
                    ORDER BY frequency DESC
                    LIMIT :limit
                """
                result = await session.execute(first_name_query, {"limit": limit // 2})
                first_names = [row[0] for row in result.fetchall()]
                
                # Get common last names
                last_name_query = """
                    SELECT last_name, COUNT(*) as frequency
                    FROM patient 
                    WHERE last_name IS NOT NULL 
                    AND LENGTH(last_name) > 2
                    GROUP BY last_name
                    ORDER BY frequency DESC
                    LIMIT :limit
                """
                result = await session.execute(last_name_query, {"limit": limit // 2})
                last_names = [row[0] for row in result.fetchall()]
                
                # Combine and add some partial terms
                search_terms = first_names + last_names
                
                # Add partial search terms (first 3 characters)
                partial_terms = [name[:3] for name in first_names[:3] if len(name) >= 3]
                search_terms.extend(partial_terms)
                
                # Add some email domain searches
                email_query = """
                    SELECT DISTINCT SUBSTRING(email FROM '@(.*)$') as domain
                    FROM patient 
                    WHERE email IS NOT NULL 
                    AND email LIKE '%@%'
                    LIMIT 3
                """
                result = await session.execute(email_query)
                domains = [f"@{row[0]}" for row in result.fetchall()]
                search_terms.extend(domains)
                
                print(f"  Collected {len(search_terms)} search terms")
                return search_terms[:limit]
        
        except Exception as e:
            print(f"  Error collecting search terms: {e}")
            # Return default terms
            return ["John", "Smith", "test", "example", "123"]
    
    async def plaintext_search(self, search_term: str) -> Set[str]:
        """Perform plaintext search directly on database."""
        
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
                """
                
                result = await session.execute(query, {"term": f"%{search_term}%"})
                return {row[0] for row in result.fetchall()}
        
        except Exception as e:
            print(f"    Plaintext search error for '{search_term}': {e}")
            return set()
    
    async def encrypted_search(self, search_term: str) -> Set[str]:
        """Perform encrypted field search."""
        
        try:
            results = await self.patient_service.search_by_encrypted_fields(
                first_name=search_term,
                last_name=search_term,
                email=search_term,
                phone_mobile=search_term,
                phone_home=search_term
            )
            return {patient.uid for patient in results}
        
        except Exception as e:
            print(f"    Encrypted search error for '{search_term}': {e}")
            return set()
    
    async def high_performance_search(self, search_term: str) -> Set[str]:
        """Perform high-performance search using indices."""
        
        try:
            results = await self.patient_service.high_performance_search(
                first_name=search_term,
                last_name=search_term,
                email=search_term,
                phone_mobile=search_term,
                phone_home=search_term
            )
            return {patient.uid for patient in results}
        
        except Exception as e:
            print(f"    High-performance search error for '{search_term}': {e}")
            return set()
    
    def analyze_search_comparison(self, search_term: str, plaintext_uids: Set[str], 
                                encrypted_uids: Set[str], hp_uids: Set[str]) -> Dict[str, Any]:
        """Analyze and compare search results."""
        
        # Calculate overlaps
        plaintext_encrypted_overlap = len(plaintext_uids & encrypted_uids)
        plaintext_hp_overlap = len(plaintext_uids & hp_uids)
        encrypted_hp_overlap = len(encrypted_uids & hp_uids)
        all_three_overlap = len(plaintext_uids & encrypted_uids & hp_uids)
        
        # Calculate metrics using plaintext as baseline
        if plaintext_uids:
            encrypted_recall = plaintext_encrypted_overlap / len(plaintext_uids)
            hp_recall = plaintext_hp_overlap / len(plaintext_uids)
        else:
            encrypted_recall = 1.0 if not encrypted_uids else 0.0
            hp_recall = 1.0 if not hp_uids else 0.0
        
        if encrypted_uids:
            encrypted_precision = plaintext_encrypted_overlap / len(encrypted_uids)
        else:
            encrypted_precision = 1.0 if not plaintext_uids else 0.0
        
        if hp_uids:
            hp_precision = plaintext_hp_overlap / len(hp_uids)
        else:
            hp_precision = 1.0 if not plaintext_uids else 0.0
        
        # Calculate F1 scores
        if encrypted_recall + encrypted_precision > 0:
            encrypted_f1 = 2 * (encrypted_recall * encrypted_precision) / (encrypted_recall + encrypted_precision)
        else:
            encrypted_f1 = 0.0
        
        if hp_recall + hp_precision > 0:
            hp_f1 = 2 * (hp_recall * hp_precision) / (hp_recall + hp_precision)
        else:
            hp_f1 = 0.0
        
        # Determine match quality
        match_quality = "exact"
        if encrypted_recall < 0.95 or hp_recall < 0.95:
            if encrypted_recall >= 0.85 and hp_recall >= 0.85:
                match_quality = "acceptable"
            else:
                match_quality = "poor"
        
        return {
            "search_term": search_term,
            "counts": {
                "plaintext": len(plaintext_uids),
                "encrypted": len(encrypted_uids),
                "high_performance": len(hp_uids)
            },
            "overlaps": {
                "plaintext_encrypted": plaintext_encrypted_overlap,
                "plaintext_hp": plaintext_hp_overlap,
                "encrypted_hp": encrypted_hp_overlap,
                "all_three": all_three_overlap
            },
            "metrics": {
                "encrypted_recall": encrypted_recall,
                "encrypted_precision": encrypted_precision,
                "encrypted_f1": encrypted_f1,
                "hp_recall": hp_recall,
                "hp_precision": hp_precision,
                "hp_f1": hp_f1
            },
            "differences": {
                "plaintext_only": list(plaintext_uids - encrypted_uids - hp_uids)[:3],
                "encrypted_only": list(encrypted_uids - plaintext_uids)[:3],
                "hp_only": list(hp_uids - plaintext_uids)[:3]
            },
            "match_quality": match_quality
        }
    
    async def compare_search_methods(self, search_terms: List[str]) -> bool:
        """Compare all search methods for given terms."""
        
        print("Comparing search methods...")
        print("=" * 50)
        
        all_acceptable = True
        
        for i, term in enumerate(search_terms):
            print(f"\nTesting {i+1}/{len(search_terms)}: '{term}'")
            
            try:
                # Perform searches with all methods
                plaintext_uids = await self.plaintext_search(term)
                encrypted_uids = await self.encrypted_search(term)
                hp_uids = await self.high_performance_search(term)
                
                # Analyze comparison
                comparison = self.analyze_search_comparison(term, plaintext_uids, encrypted_uids, hp_uids)
                self.comparison_results.append(comparison)
                
                # Print results
                counts = comparison["counts"]
                metrics = comparison["metrics"]
                quality = comparison["match_quality"]
                
                print(f"  Results: Plaintext={counts['plaintext']}, "
                      f"Encrypted={counts['encrypted']}, HP={counts['high_performance']}")
                print(f"  Encrypted: {metrics['encrypted_recall']:.2%} recall, "
                      f"{metrics['encrypted_precision']:.2%} precision, F1={metrics['encrypted_f1']:.2f}")
                print(f"  HP: {metrics['hp_recall']:.2%} recall, "
                      f"{metrics['hp_precision']:.2%} precision, F1={metrics['hp_f1']:.2f}")
                
                # Quality assessment
                quality_symbol = {
                    "exact": "✅",
                    "acceptable": "⚠️",
                    "poor": "❌"
                }.get(quality, "❓")
                
                print(f"  Match quality: {quality_symbol} {quality.upper()}")
                
                # Update summary stats
                self.summary_stats["total_comparisons"] += 1
                if quality == "exact":
                    self.summary_stats["exact_matches"] += 1
                elif quality == "acceptable":
                    self.summary_stats["acceptable_matches"] += 1
                    all_acceptable = all_acceptable and True  # Still acceptable
                else:
                    self.summary_stats["poor_matches"] += 1
                    all_acceptable = False
                
                # Show sample differences for debugging
                if comparison["differences"]["plaintext_only"]:
                    print(f"    Plaintext-only results: {len(plaintext_uids - encrypted_uids - hp_uids)} "
                          f"(sample: {comparison['differences']['plaintext_only']})")
                
                if comparison["differences"]["encrypted_only"]:
                    print(f"    Encrypted-only results: {len(encrypted_uids - plaintext_uids)} "
                          f"(sample: {comparison['differences']['encrypted_only']})")
                
                if comparison["differences"]["hp_only"]:
                    print(f"    HP-only results: {len(hp_uids - plaintext_uids)} "
                          f"(sample: {comparison['differences']['hp_only']})")
            
            except Exception as e:
                print(f"  ❌ Comparison failed: {e}")
                self.summary_stats["failed_comparisons"] += 1
                all_acceptable = False
        
        return all_acceptable
    
    def generate_summary_report(self):
        """Generate summary report of all comparisons."""
        
        if not self.comparison_results:
            print("No comparison data available")
            return
        
        print(f"\n" + "=" * 60)
        print("SEARCH COMPARISON SUMMARY REPORT")
        print("=" * 60)
        
        # Overall statistics
        stats = self.summary_stats
        total = stats["total_comparisons"]
        
        print(f"Total comparisons: {total}")
        print(f"Exact matches: {stats['exact_matches']} ({stats['exact_matches']/total*100:.1f}%)")
        print(f"Acceptable matches: {stats['acceptable_matches']} ({stats['acceptable_matches']/total*100:.1f}%)")
        print(f"Poor matches: {stats['poor_matches']} ({stats['poor_matches']/total*100:.1f}%)")
        print(f"Failed comparisons: {stats['failed_comparisons']} ({stats['failed_comparisons']/total*100:.1f}%)")
        
        # Calculate average metrics
        encrypted_recalls = [r["metrics"]["encrypted_recall"] for r in self.comparison_results]
        hp_recalls = [r["metrics"]["hp_recall"] for r in self.comparison_results]
        encrypted_precisions = [r["metrics"]["encrypted_precision"] for r in self.comparison_results]
        hp_precisions = [r["metrics"]["hp_precision"] for r in self.comparison_results]
        
        if encrypted_recalls:
            avg_encrypted_recall = sum(encrypted_recalls) / len(encrypted_recalls)
            avg_hp_recall = sum(hp_recalls) / len(hp_recalls)
            avg_encrypted_precision = sum(encrypted_precisions) / len(encrypted_precisions)
            avg_hp_precision = sum(hp_precisions) / len(hp_precisions)
            
            print(f"\nAverage Metrics:")
            print(f"Encrypted search - Recall: {avg_encrypted_recall:.2%}, Precision: {avg_encrypted_precision:.2%}")
            print(f"HP search - Recall: {avg_hp_recall:.2%}, Precision: {avg_hp_precision:.2%}")
        
        # Detailed results for poor matches
        poor_matches = [r for r in self.comparison_results if r["match_quality"] == "poor"]
        if poor_matches:
            print(f"\nPoor Matches Details:")
            for match in poor_matches[:5]:  # Show first 5
                term = match["search_term"]
                recall = match["metrics"]["encrypted_recall"]
                print(f"  '{term}': {recall:.2%} recall")
        
        # Overall assessment
        success_rate = (stats["exact_matches"] + stats["acceptable_matches"]) / total
        print(f"\nOverall Success Rate: {success_rate:.2%}")
        
        if success_rate >= 0.95:
            print(f"🎉 Excellent search accuracy!")
        elif success_rate >= 0.85:
            print(f"✅ Good search accuracy")
        elif success_rate >= 0.70:
            print(f"⚠️  Marginal search accuracy - review needed")
        else:
            print(f"❌ Poor search accuracy - requires attention")
    
    async def run_comparison(self, search_terms: Optional[List[str]] = None, 
                           max_terms: int = 15) -> bool:
        """Run complete search comparison."""
        
        print("HIPAA Search Results Comparison")
        print("=" * 50)
        
        # Get search terms if not provided
        if not search_terms:
            search_terms = await self.get_test_search_terms(max_terms)
        
        if not search_terms:
            print("❌ No search terms available for comparison")
            return False
        
        # Run comparisons
        comparison_success = await self.compare_search_methods(search_terms)
        
        # Generate summary
        self.generate_summary_report()
        
        # Final assessment
        success_rate = ((self.summary_stats["exact_matches"] + self.summary_stats["acceptable_matches"]) / 
                       max(self.summary_stats["total_comparisons"], 1))
        
        return comparison_success and success_rate >= 0.85


async def main():
    """Main entry point for search comparison."""
    
    parser = argparse.ArgumentParser(description='Compare HIPAA search results')
    parser.add_argument('--search-terms', type=str, nargs='*',
                       help='Specific search terms to test')
    parser.add_argument('--max-terms', type=int, default=15,
                       help='Maximum number of search terms to test')
    
    args = parser.parse_args()
    
    try:
        comparator = SearchResultsComparator()
        success = await comparator.run_comparison(args.search_terms, args.max_terms)
        
        if success:
            print(f"\n✅ Search comparison completed successfully!")
        else:
            print(f"\n❌ Search comparison indicates accuracy issues!")
        
        return success
        
    except Exception as e:
        print(f"❌ Search comparison failed: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)