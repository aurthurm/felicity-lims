#!/usr/bin/env python3
"""
Search Performance Benchmark Script for HIPAA Migration

Benchmarks search performance before and after HIPAA migration to ensure
performance targets are met and search accuracy is maintained.
"""

import asyncio
import argparse
import time
import json
import statistics
import sys
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session
from felicity.apps.patient.services import PatientService
from felicity.apps.analysis.services.result import AnalysisResultService


class SearchBenchmark:
    """Benchmark search performance for HIPAA migration validation."""
    
    def __init__(self):
        self.patient_service = PatientService()
        self.result_service = AnalysisResultService()
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "encrypted_search": [],
            "legacy_search": [],
            "high_performance_search": [],
            "summary": {}
        }
    
    async def benchmark_patient_search(self, search_terms: List[str], iterations: int = 10):
        """Benchmark different patient search methods."""
        
        print(f"Benchmarking patient search with {len(search_terms)} terms...")
        
        for i, term in enumerate(search_terms):
            print(f"\nTesting search term {i+1}/{len(search_terms)}: '{term}'")
            
            # Test encrypted search (if available)
            encrypted_times = []
            encrypted_results_count = 0
            
            for iteration in range(iterations):
                try:
                    start_time = time.time()
                    results = await self.patient_service.search_by_encrypted_fields(
                        first_name=term,
                        last_name=term,
                        email=term,
                        phone_mobile=term
                    )
                    end_time = time.time()
                    
                    duration = (end_time - start_time) * 1000  # Convert to milliseconds
                    encrypted_times.append(duration)
                    
                    if iteration == 0:  # Count results only once
                        encrypted_results_count = len(results)
                        
                except Exception as e:
                    print(f"  ⚠️  Encrypted search failed: {e}")
                    encrypted_times.append(float('inf'))
            
            # Test high-performance search (if available)
            hp_times = []
            hp_results_count = 0
            
            for iteration in range(iterations):
                try:
                    start_time = time.time()
                    results = await self.patient_service.high_performance_search(
                        first_name=term,
                        last_name=term,
                        email=term,
                        phone_mobile=term
                    )
                    end_time = time.time()
                    
                    duration = (end_time - start_time) * 1000
                    hp_times.append(duration)
                    
                    if iteration == 0:
                        hp_results_count = len(results)
                        
                except Exception as e:
                    print(f"  ⚠️  High-performance search failed: {e}")
                    hp_times.append(float('inf'))
            
            # Test legacy search (direct SQL)
            legacy_times = []
            legacy_results_count = 0
            
            for iteration in range(iterations):
                try:
                    async with async_session() as session:
                        start_time = time.time()
                        
                        # Simple LIKE query for comparison
                        query = """
                            SELECT uid, first_name, last_name, email, phone_mobile
                            FROM patient 
                            WHERE first_name ILIKE :term 
                               OR last_name ILIKE :term 
                               OR email ILIKE :term 
                               OR phone_mobile ILIKE :term
                            LIMIT 100
                        """
                        
                        result = await session.execute(query, {"term": f"%{term}%"})
                        results = result.fetchall()
                        
                        end_time = time.time()
                        
                        duration = (end_time - start_time) * 1000
                        legacy_times.append(duration)
                        
                        if iteration == 0:
                            legacy_results_count = len(results)
                            
                except Exception as e:
                    print(f"  ⚠️  Legacy search failed: {e}")
                    legacy_times.append(float('inf'))
            
            # Calculate statistics
            def calculate_stats(times: List[float]) -> Dict[str, float]:
                valid_times = [t for t in times if t != float('inf')]
                if not valid_times:
                    return {"avg": float('inf'), "min": float('inf'), "max": float('inf'), "median": float('inf')}
                
                return {
                    "avg": statistics.mean(valid_times),
                    "min": min(valid_times),
                    "max": max(valid_times),
                    "median": statistics.median(valid_times)
                }
            
            encrypted_stats = calculate_stats(encrypted_times)
            hp_stats = calculate_stats(hp_times)
            legacy_stats = calculate_stats(legacy_times)
            
            # Store results
            benchmark_result = {
                "search_term": term,
                "iterations": iterations,
                "encrypted_search": {
                    "stats": encrypted_stats,
                    "results_count": encrypted_results_count,
                    "times": encrypted_times[:5]  # Store first 5 for reference
                },
                "high_performance_search": {
                    "stats": hp_stats,
                    "results_count": hp_results_count,
                    "times": hp_times[:5]
                },
                "legacy_search": {
                    "stats": legacy_stats,
                    "results_count": legacy_results_count,
                    "times": legacy_times[:5]
                }
            }
            
            self.results["encrypted_search"].append(benchmark_result)
            
            # Print results
            print(f"  Results found:")
            print(f"    Encrypted: {encrypted_results_count}")
            print(f"    High-performance: {hp_results_count}")
            print(f"    Legacy: {legacy_results_count}")
            
            print(f"  Average response time (ms):")
            print(f"    Encrypted: {encrypted_stats['avg']:.2f}")
            print(f"    High-performance: {hp_stats['avg']:.2f}")
            print(f"    Legacy: {legacy_stats['avg']:.2f}")
            
            # Performance ratio
            if legacy_stats['avg'] != float('inf') and hp_stats['avg'] != float('inf'):
                ratio = hp_stats['avg'] / legacy_stats['avg']
                print(f"  High-performance vs Legacy ratio: {ratio:.2f}x")
                
                if ratio <= 2.0:
                    print(f"    ✅ Performance target met (≤ 2x)")
                else:
                    print(f"    ❌ Performance target missed (> 2x)")
    
    async def benchmark_result_search(self, search_terms: List[str], iterations: int = 10):
        """Benchmark analysis result search performance."""
        
        print(f"\nBenchmarking analysis result search...")
        
        for term in search_terms[:3]:  # Limit to first 3 terms for results
            print(f"\nTesting result search: '{term}'")
            
            # Test HIPAA compliant search
            hipaa_times = []
            hipaa_results_count = 0
            
            for iteration in range(iterations):
                try:
                    start_time = time.time()
                    results = await self.result_service.hipaa_compliant_search_by_result(term)
                    end_time = time.time()
                    
                    duration = (end_time - start_time) * 1000
                    hipaa_times.append(duration)
                    
                    if iteration == 0:
                        hipaa_results_count = len(results)
                        
                except Exception as e:
                    print(f"  ⚠️  HIPAA search failed: {e}")
                    hipaa_times.append(float('inf'))
            
            # Calculate stats
            hipaa_stats = {
                "avg": statistics.mean([t for t in hipaa_times if t != float('inf')]) if any(t != float('inf') for t in hipaa_times) else float('inf'),
                "results_count": hipaa_results_count
            }
            
            print(f"  Results found: {hipaa_stats['results_count']}")
            print(f"  Average response time: {hipaa_stats['avg']:.2f} ms")
    
    def generate_summary(self):
        """Generate benchmark summary."""
        
        if not self.results["encrypted_search"]:
            print("No benchmark data available for summary")
            return
        
        # Calculate overall statistics
        all_encrypted_times = []
        all_hp_times = []
        all_legacy_times = []
        
        for result in self.results["encrypted_search"]:
            if result["encrypted_search"]["stats"]["avg"] != float('inf'):
                all_encrypted_times.append(result["encrypted_search"]["stats"]["avg"])
            if result["high_performance_search"]["stats"]["avg"] != float('inf'):
                all_hp_times.append(result["high_performance_search"]["stats"]["avg"])
            if result["legacy_search"]["stats"]["avg"] != float('inf'):
                all_legacy_times.append(result["legacy_search"]["stats"]["avg"])
        
        summary = {
            "total_search_terms": len(self.results["encrypted_search"]),
            "overall_performance": {}
        }
        
        if all_encrypted_times:
            summary["overall_performance"]["encrypted_avg"] = statistics.mean(all_encrypted_times)
        if all_hp_times:
            summary["overall_performance"]["high_performance_avg"] = statistics.mean(all_hp_times)
        if all_legacy_times:
            summary["overall_performance"]["legacy_avg"] = statistics.mean(all_legacy_times)
        
        # Performance targets
        if all_hp_times and all_legacy_times:
            avg_ratio = statistics.mean(all_hp_times) / statistics.mean(all_legacy_times)
            summary["performance_ratio"] = avg_ratio
            summary["performance_target_met"] = avg_ratio <= 2.0
        
        self.results["summary"] = summary
        
        print(f"\n" + "=" * 60)
        print("BENCHMARK SUMMARY")
        print("=" * 60)
        print(f"Search terms tested: {summary['total_search_terms']}")
        
        if "encrypted_avg" in summary["overall_performance"]:
            print(f"Average encrypted search time: {summary['overall_performance']['encrypted_avg']:.2f} ms")
        if "high_performance_avg" in summary["overall_performance"]:
            print(f"Average high-performance search time: {summary['overall_performance']['high_performance_avg']:.2f} ms")
        if "legacy_avg" in summary["overall_performance"]:
            print(f"Average legacy search time: {summary['overall_performance']['legacy_avg']:.2f} ms")
        
        if "performance_ratio" in summary:
            print(f"Performance ratio (HP/Legacy): {summary['performance_ratio']:.2f}x")
            if summary["performance_target_met"]:
                print("✅ Performance target met (≤ 2x legacy performance)")
            else:
                print("❌ Performance target missed (> 2x legacy performance)")
    
    def save_results(self, filename: str):
        """Save benchmark results to JSON file."""
        
        with open(filename, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\nBenchmark results saved to: {filename}")


async def main():
    parser = argparse.ArgumentParser(description='Benchmark HIPAA migration search performance')
    parser.add_argument('--iterations', type=int, default=10, help='Number of iterations per test')
    parser.add_argument('--search-terms', type=str, default='John,Smith,test@example.com', 
                       help='Comma-separated search terms')
    parser.add_argument('--output', type=str, default='benchmark_results.json',
                       help='Output file for results')
    
    args = parser.parse_args()
    
    search_terms = [term.strip() for term in args.search_terms.split(',')]
    
    print("HIPAA Migration Search Performance Benchmark")
    print("=" * 60)
    print(f"Search terms: {search_terms}")
    print(f"Iterations per test: {args.iterations}")
    print(f"Output file: {args.output}")
    
    benchmark = SearchBenchmark()
    
    try:
        await benchmark.benchmark_patient_search(search_terms, args.iterations)
        await benchmark.benchmark_result_search(search_terms, args.iterations)
        
        benchmark.generate_summary()
        benchmark.save_results(args.output)
        
        # Return success if performance targets are met
        if benchmark.results["summary"].get("performance_target_met", False):
            print("\n✅ All performance benchmarks passed!")
            return True
        else:
            print("\n❌ Some performance benchmarks failed!")
            return False
            
    except Exception as e:
        print(f"\n❌ Benchmark failed with error: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)