#!/usr/bin/env python3
"""
Script to upgrade Python packages in requirements.txt to their latest versions.
"""

import re
import subprocess
import sys
from pathlib import Path


def parse_requirement(line):
    """Parse a requirement line to extract package name and version."""
    line = line.strip()

    # Skip empty lines and comments
    if not line or line.startswith('#'):
        return None, None, line

    # Handle different requirement formats
    # package==1.0.0
    # package>=1.0.0
    # package~=1.0.0
    # package
    match = re.match(r'^([a-zA-Z0-9\-_\.]+)([>=<~!]+)?(.+)?', line)

    if match:
        package_name = match.group(1)
        operator = match.group(2) or ''
        version = match.group(3) or ''
        return package_name, f"{operator}{version}".strip(), line

    return None, None, line


def get_latest_version(package_name):
    """Get the latest version of a package from PyPI."""
    try:
        result = subprocess.run(
            ['pip', 'index', 'versions', package_name],
            capture_output=True,
            text=True,
            timeout=10
        )

        # Parse output to find available versions
        output = result.stdout

        # Look for "Available versions:" line
        for line in output.split('\n'):
            if 'Available versions:' in line:
                versions = line.split('Available versions:')[1].strip()
                # Get the first version (latest)
                latest = versions.split(',')[0].strip()
                return latest

        # Alternative: use pip show (if package is installed)
        # Or try using requests to PyPI API
        return None

    except Exception as e:
        print(f"Warning: Could not fetch latest version for {package_name}: {e}", file=sys.stderr)
        return None


def get_latest_version_from_pypi_api(package_name):
    """Get latest version using PyPI JSON API as fallback."""
    try:
        import json
        import urllib.request

        url = f"https://pypi.org/pypi/{package_name}/json"
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
            return data['info']['version']
    except Exception as e:
        print(f"Warning: Could not fetch from PyPI API for {package_name}: {e}", file=sys.stderr)
        return None


def upgrade_requirements(input_file='requirements.txt', output_file=None, dry_run=False):
    """
    Upgrade all packages in requirements.txt to their latest versions.

    Args:
        input_file: Path to input requirements.txt
        output_file: Path to output file (if None, overwrites input_file)
        dry_run: If True, only show what would be changed without writing
    """
    input_path = Path(input_file)

    if not input_path.exists():
        print(f"Error: {input_file} not found!")
        return False

    if output_file is None:
        output_file = input_file

    output_path = Path(output_file)

    print(f"Reading requirements from: {input_path}")
    print("-" * 60)

    with open(input_path, 'r') as f:
        lines = f.readlines()

    updated_lines = []
    changes = []

    for line in lines:
        package_name, old_version, original_line = parse_requirement(line)

        if package_name:
            print(f"Checking {package_name}...", end=' ')

            # Try pip index first
            latest_version = get_latest_version(package_name)

            # Fallback to PyPI API
            if not latest_version:
                latest_version = get_latest_version_from_pypi_api(package_name)

            if latest_version:
                new_line = f"{package_name}=={latest_version}\n"
                updated_lines.append(new_line)

                if old_version != f"=={latest_version}":
                    print(f"✓ {old_version or '(unpinned)'} → {latest_version}")
                    changes.append((package_name, old_version or 'unpinned', latest_version))
                else:
                    print(f"✓ Already at {latest_version}")
            else:
                print("✗ Could not determine latest version, keeping original")
                updated_lines.append(original_line if original_line.endswith('\n') else original_line + '\n')
        else:
            # Keep comments and empty lines as-is
            updated_lines.append(original_line if original_line.endswith('\n') else original_line + '\n')

    print("-" * 60)

    if changes:
        print(f"\nSummary: {len(changes)} package(s) will be upgraded:")
        for pkg, old, new in changes:
            print(f"  • {pkg}: {old} → {new}")
    else:
        print("\nNo packages need upgrading - all are at latest versions!")

    if not dry_run:
        with open(output_path, 'w') as f:
            f.writelines(updated_lines)
        print(f"\n✓ Updated requirements written to: {output_path}")
        print("\nTo install the updated requirements, run:")
        print(f"  pip install -r {output_path}")
    else:
        print("\n(Dry run - no files were modified)")
        print("\nUpdated requirements.txt preview:")
        print("=" * 60)
        print(''.join(updated_lines))
        print("=" * 60)

    return True


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='Upgrade Python packages in requirements.txt to their latest versions'
    )
    parser.add_argument(
        'input_file',
        nargs='?',
        default='requirements.txt',
        help='Path to input requirements.txt (default: requirements.txt)'
    )
    parser.add_argument(
        '-o', '--output',
        help='Path to output file (default: overwrite input file)'
    )
    parser.add_argument(
        '-d', '--dry-run',
        action='store_true',
        help='Show what would be changed without modifying files'
    )

    args = parser.parse_args()

    success = upgrade_requirements(
        input_file=args.input_file,
        output_file=args.output,
        dry_run=args.dry_run
    )

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
