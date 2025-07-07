#!/usr/bin/env python3
"""
Performance Comparison Script for HIPAA Migration

Compares performance metrics before and after HIPAA migration to ensure
performance targets are met and identify any regressions.
"""

import argparse
import json
import sys
import statistics
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime


class PerformanceComparator:
    """Compares performance metrics before and after HIPAA migration."""
    
    def __init__(self):
        self.comparison_results = {
            "timestamp": datetime.now().isoformat(),
            "baseline_metrics": {},
            "current_metrics": {},
            "comparisons": {},
            "performance_assessment": {}
        }
    
    def load_metrics_file(self, file_path: str) -> Dict[str, Any]:
        """Load metrics from JSON file."""
        
        try:
            with open(file_path, 'r') as f:
                metrics = json.load(f)
            return metrics
        except FileNotFoundError:
            print(f"❌ Metrics file not found: {file_path}")
            return {}
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in metrics file {file_path}: {e}")
            return {}
        except Exception as e:
            print(f"❌ Error loading metrics file {file_path}: {e}")
            return {}
    
    def extract_search_metrics(self, metrics: Dict[str, Any]) -> Dict[str, float]:
        """Extract search performance metrics from benchmark data."""
        
        search_metrics = {
            "avg_response_time": 0.0,
            "min_response_time": 0.0,
            "max_response_time": 0.0,
            "median_response_time": 0.0,
            "total_searches": 0,
            "successful_searches": 0,
            "failed_searches": 0
        }
        
        # Handle different metric file formats
        if "encrypted_search" in metrics:
            # Benchmark results format
            all_times = []
            total_searches = len(metrics["encrypted_search"])
            successful_searches = 0
            
            for search_result in metrics["encrypted_search"]:
                if "high_performance_search" in search_result:
                    hp_stats = search_result["high_performance_search"]["stats"]
                    if hp_stats["avg"] != float('inf'):
                        all_times.append(hp_stats["avg"])
                        successful_searches += 1
            
            if all_times:
                search_metrics.update({
                    "avg_response_time": statistics.mean(all_times),
                    "min_response_time": min(all_times),
                    "max_response_time": max(all_times),
                    "median_response_time": statistics.median(all_times),
                    "total_searches": total_searches,
                    "successful_searches": successful_searches,
                    "failed_searches": total_searches - successful_searches
                })
        
        elif "search_performance" in metrics:
            # Direct performance metrics format
            perf = metrics["search_performance"]
            search_metrics.update({
                "avg_response_time": perf.get("avg_response_time", 0.0),
                "min_response_time": perf.get("min_response_time", 0.0),
                "max_response_time": perf.get("max_response_time", 0.0),
                "median_response_time": perf.get("median_response_time", 0.0),
                "total_searches": perf.get("total_searches", 0),
                "successful_searches": perf.get("successful_searches", 0),
                "failed_searches": perf.get("failed_searches", 0)
            })
        
        elif "summary" in metrics and "overall_performance" in metrics["summary"]:
            # Summary format
            overall = metrics["summary"]["overall_performance"]
            search_metrics.update({
                "avg_response_time": overall.get("high_performance_avg", 0.0),
                "total_searches": metrics["summary"].get("total_search_terms", 0)
            })
        
        return search_metrics
    
    def calculate_performance_ratio(self, baseline: float, current: float) -> Dict[str, Any]:
        """Calculate performance ratio and assessment."""
        
        if baseline == 0 or baseline == float('inf'):
            return {
                "ratio": float('inf') if current > 0 else 1.0,
                "percentage_change": 0.0,
                "assessment": "Cannot compare - invalid baseline"
            }
        
        ratio = current / baseline
        percentage_change = ((current - baseline) / baseline) * 100
        
        # Determine assessment
        if ratio <= 1.0:
            assessment = "IMPROVED"
        elif ratio <= 1.5:
            assessment = "ACCEPTABLE"
        elif ratio <= 2.0:
            assessment = "MARGINAL"
        else:
            assessment = "DEGRADED"
        
        return {
            "ratio": ratio,
            "percentage_change": percentage_change,
            "assessment": assessment
        }
    
    def compare_search_performance(self, baseline_metrics: Dict[str, float], 
                                  current_metrics: Dict[str, float]) -> Dict[str, Any]:
        """Compare search performance metrics."""
        
        comparisons = {}
        
        # Compare response times
        for metric in ["avg_response_time", "min_response_time", "max_response_time", "median_response_time"]:
            baseline_value = baseline_metrics.get(metric, 0.0)
            current_value = current_metrics.get(metric, 0.0)
            
            comparisons[metric] = {
                "baseline": baseline_value,
                "current": current_value,
                **self.calculate_performance_ratio(baseline_value, current_value)
            }
        
        # Compare success rates
        baseline_success_rate = 0.0
        current_success_rate = 0.0
        
        if baseline_metrics.get("total_searches", 0) > 0:
            baseline_success_rate = (baseline_metrics.get("successful_searches", 0) / 
                                   baseline_metrics["total_searches"]) * 100
        
        if current_metrics.get("total_searches", 0) > 0:
            current_success_rate = (current_metrics.get("successful_searches", 0) / 
                                  current_metrics["total_searches"]) * 100
        
        comparisons["success_rate"] = {
            "baseline": baseline_success_rate,
            "current": current_success_rate,
            "percentage_change": current_success_rate - baseline_success_rate,
            "assessment": "IMPROVED" if current_success_rate >= baseline_success_rate else "DEGRADED"
        }
        
        return comparisons
    
    def assess_overall_performance(self, comparisons: Dict[str, Any]) -> Dict[str, Any]:
        """Assess overall performance based on comparisons."""
        
        # Key metrics for overall assessment
        key_metrics = ["avg_response_time", "success_rate"]
        assessments = []
        
        for metric in key_metrics:
            if metric in comparisons:
                assessment = comparisons[metric].get("assessment", "UNKNOWN")
                assessments.append(assessment)
        
        # Determine overall assessment
        if all(a in ["IMPROVED", "ACCEPTABLE"] for a in assessments):
            overall_assessment = "PASSED"
        elif any(a == "DEGRADED" for a in assessments):
            overall_assessment = "FAILED"
        else:
            overall_assessment = "MARGINAL"
        
        # Calculate performance score (0-100)
        score = 100
        
        # Penalize based on response time ratio
        avg_response_ratio = comparisons.get("avg_response_time", {}).get("ratio", 1.0)
        if avg_response_ratio > 2.0:
            score -= 40
        elif avg_response_ratio > 1.5:
            score -= 20
        elif avg_response_ratio > 1.0:
            score -= 10
        
        # Penalize based on success rate
        success_rate_change = comparisons.get("success_rate", {}).get("percentage_change", 0.0)
        if success_rate_change < -10:
            score -= 30
        elif success_rate_change < -5:
            score -= 15
        
        # Bonus for improvements
        if avg_response_ratio < 1.0:
            score += 10
        if success_rate_change > 5:
            score += 10
        
        score = max(0, min(100, score))  # Clamp to 0-100
        
        return {
            "overall_assessment": overall_assessment,
            "performance_score": score,
            "key_findings": self.generate_key_findings(comparisons)
        }
    
    def generate_key_findings(self, comparisons: Dict[str, Any]) -> List[str]:
        """Generate key findings from performance comparison."""
        
        findings = []
        
        # Response time findings
        avg_ratio = comparisons.get("avg_response_time", {}).get("ratio", 1.0)
        if avg_ratio <= 0.8:
            findings.append(f"Search performance improved significantly ({avg_ratio:.1f}x faster)")
        elif avg_ratio >= 2.0:
            findings.append(f"Search performance degraded significantly ({avg_ratio:.1f}x slower)")
        elif avg_ratio >= 1.5:
            findings.append(f"Search performance degraded moderately ({avg_ratio:.1f}x slower)")
        
        # Success rate findings
        success_change = comparisons.get("success_rate", {}).get("percentage_change", 0.0)
        if success_change >= 5:
            findings.append(f"Search reliability improved (+{success_change:.1f}% success rate)")
        elif success_change <= -5:
            findings.append(f"Search reliability degraded ({success_change:.1f}% success rate)")
        
        # Consistency findings
        min_ratio = comparisons.get("min_response_time", {}).get("ratio", 1.0)
        max_ratio = comparisons.get("max_response_time", {}).get("ratio", 1.0)
        
        if max_ratio / min_ratio > 3.0:
            findings.append("Search performance consistency may be an issue")
        
        # Target compliance
        if avg_ratio <= 2.0:
            findings.append("Performance target met (≤ 2x baseline)")
        else:
            findings.append("Performance target missed (> 2x baseline)")
        
        return findings
    
    def print_comparison_report(self):
        """Print detailed comparison report."""
        
        print("HIPAA Migration Performance Comparison Report")
        print("=" * 60)
        
        # Print baseline vs current metrics
        print("\nBaseline vs Current Metrics:")
        print("-" * 40)
        
        baseline_search = self.comparison_results["baseline_metrics"]
        current_search = self.comparison_results["current_metrics"]
        
        print(f"{'Metric':<25} {'Baseline':<12} {'Current':<12} {'Change':<10}")
        print("-" * 60)
        
        for metric in ["avg_response_time", "min_response_time", "max_response_time", "median_response_time"]:
            baseline_val = baseline_search.get(metric, 0.0)
            current_val = current_search.get(metric, 0.0)
            
            if baseline_val > 0:
                change = f"{((current_val - baseline_val) / baseline_val) * 100:+.1f}%"
            else:
                change = "N/A"
            
            print(f"{metric:<25} {baseline_val:<12.2f} {current_val:<12.2f} {change:<10}")
        
        # Print detailed comparisons
        print("\nDetailed Performance Analysis:")
        print("-" * 40)
        
        comparisons = self.comparison_results["comparisons"]
        
        for metric, comparison in comparisons.items():
            print(f"\n{metric.replace('_', ' ').title()}:")
            print(f"  Baseline: {comparison['baseline']:.2f}")
            print(f"  Current: {comparison['current']:.2f}")
            
            if "ratio" in comparison:
                print(f"  Ratio: {comparison['ratio']:.2f}x")
                print(f"  Change: {comparison['percentage_change']:+.1f}%")
            
            assessment = comparison.get('assessment', 'UNKNOWN')
            status_symbol = {
                "IMPROVED": "✅",
                "ACCEPTABLE": "✅", 
                "MARGINAL": "⚠️",
                "DEGRADED": "❌"
            }.get(assessment, "❓")
            
            print(f"  Assessment: {status_symbol} {assessment}")
        
        # Print overall assessment
        print(f"\n" + "=" * 60)
        print("OVERALL PERFORMANCE ASSESSMENT")
        print("=" * 60)
        
        assessment = self.comparison_results["performance_assessment"]
        overall = assessment["overall_assessment"]
        score = assessment["performance_score"]
        
        status_symbol = {
            "PASSED": "✅",
            "MARGINAL": "⚠️", 
            "FAILED": "❌"
        }.get(overall, "❓")
        
        print(f"Result: {status_symbol} {overall}")
        print(f"Performance Score: {score}/100")
        
        print(f"\nKey Findings:")
        for finding in assessment["key_findings"]:
            print(f"  • {finding}")
    
    def save_comparison_results(self, output_file: str):
        """Save comparison results to JSON file."""
        
        try:
            with open(output_file, 'w') as f:
                json.dump(self.comparison_results, f, indent=2)
            print(f"\nComparison results saved to: {output_file}")
        except Exception as e:
            print(f"❌ Error saving comparison results: {e}")
    
    def compare_metrics(self, baseline_file: str, current_file: str, output_file: str = None) -> bool:
        """Compare metrics from baseline and current files."""
        
        print(f"Loading baseline metrics from: {baseline_file}")
        baseline_data = self.load_metrics_file(baseline_file)
        
        print(f"Loading current metrics from: {current_file}")
        current_data = self.load_metrics_file(current_file)
        
        if not baseline_data or not current_data:
            print("❌ Failed to load metrics files")
            return False
        
        # Extract search metrics
        baseline_search = self.extract_search_metrics(baseline_data)
        current_search = self.extract_search_metrics(current_data)
        
        print(f"Extracted baseline search metrics: {len(baseline_search)} metrics")
        print(f"Extracted current search metrics: {len(current_search)} metrics")
        
        # Store in results
        self.comparison_results["baseline_metrics"] = baseline_search
        self.comparison_results["current_metrics"] = current_search
        
        # Compare performance
        comparisons = self.compare_search_performance(baseline_search, current_search)
        self.comparison_results["comparisons"] = comparisons
        
        # Assess overall performance
        assessment = self.assess_overall_performance(comparisons)
        self.comparison_results["performance_assessment"] = assessment
        
        # Print report
        self.print_comparison_report()
        
        # Save results if output file specified
        if output_file:
            self.save_comparison_results(output_file)
        
        # Return success based on overall assessment
        return assessment["overall_assessment"] in ["PASSED", "MARGINAL"]


def main():
    """Main entry point for performance comparison."""
    
    parser = argparse.ArgumentParser(description='Compare HIPAA migration performance metrics')
    parser.add_argument('--baseline', type=str, required=True,
                       help='Baseline performance metrics file (JSON)')
    parser.add_argument('--current', type=str, required=True,
                       help='Current performance metrics file (JSON)')
    parser.add_argument('--output', type=str, default='performance_comparison.json',
                       help='Output file for comparison results')
    
    args = parser.parse_args()
    
    # Validate input files exist
    if not Path(args.baseline).exists():
        print(f"❌ Baseline file not found: {args.baseline}")
        return False
    
    if not Path(args.current).exists():
        print(f"❌ Current file not found: {args.current}")
        return False
    
    try:
        comparator = PerformanceComparator()
        success = comparator.compare_metrics(args.baseline, args.current, args.output)
        
        if success:
            print(f"\n✅ Performance comparison completed successfully!")
        else:
            print(f"\n❌ Performance comparison indicates issues!")
        
        return success
        
    except Exception as e:
        print(f"❌ Performance comparison failed: {e}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)