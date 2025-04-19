# filename: replace_tailwind_classes.py
import os
import re
import sys

# --- Configuration ---

# !!! IMPORTANT: Set this to the root directory of your project !!!
# Example: PROJECT_ROOT = '/path/to/your/beak-insights-felicity-lims'
PROJECT_ROOT = './webapp'  # <--- CHANGE THIS PATH

# File extensions to process (based on your tailwind.config.js content array)
FILE_EXTENSIONS = ('.html', '.js', '.jsx', '.ts', '.tsx', '.vue')

# --- Class Replacement Mapping ---
# Maps hardcoded class patterns (using regex) to theme classes.
# Uses \b for word boundaries to match whole classes.
# Handles prefixes like hover:, focus:, dark:, etc.
# NOTE: Ambiguous classes (like text-white, bg-white) are OMITTED
# and require manual replacement based on context.

REPLACEMENTS = {
    # Backgrounds
    r'\b(dark:)?bg-gray-100\b': r'\1bg-secondary',
    r'\b(dark:hover:|dark:focus:|dark:active:)?bg-gray-100\b': r'\1bg-secondary',  # Handle states
    r'\b(dark:)?bg-gray-200\b': r'\1bg-muted',
    r'\b(dark:hover:|dark:focus:|dark:active:)?bg-gray-200\b': r'\1bg-muted',  # Handle states

    # Primary (Light: sky-800, Dark: blue-500)
    r'\b(dark:)?bg-sky-800\b': r'bg-primary',  # Light base
    r'\b(hover:|focus:|active:)?bg-sky-800\b': r'\1bg-primary',  # Light states
    r'\bdark:bg-blue-500\b': r'dark:bg-primary',  # Dark base
    r'\b(dark:hover:|dark:focus:|dark:active:)bg-blue-500\b': r'\1bg-primary',  # Dark states

    # Accent (Light: blue-500, Dark: sky-800)
    r'\b(dark:)?bg-blue-500\b': r'bg-accent',  # Light base
    r'\b(hover:|focus:|active:)?bg-blue-500\b': r'\1bg-accent',  # Light states
    r'\bdark:bg-sky-800\b': r'dark:bg-accent',  # Dark base
    r'\b(dark:hover:|dark:focus:|dark:active:)bg-sky-800\b': r'\1bg-accent',  # Dark states

    # Destructive (Light: red-500, Dark: red-600 approx)
    r'\b(dark:)?bg-red-500\b': r'\1bg-destructive',
    r'\b(dark:hover:|dark:focus:|dark:active:)?bg-red-500\b': r'\1bg-destructive',
    r'\bdark:bg-red-600\b': r'dark:bg-destructive',  # Approximate dark mapping
    r'\b(dark:hover:|dark:focus:|dark:active:)bg-red-600\b': r'\1bg-destructive',

    # Success (green-600 for both)
    r'\b(dark:)?bg-green-600\b': r'\1bg-success',
    r'\b(dark:hover:|dark:focus:|dark:active:)?bg-green-600\b': r'\1bg-success',

    # Text
    r'\b(dark:)?text-gray-500\b': r'\1text-muted-foreground',
    r'\b(dark:hover:|dark:focus:|dark:active:)?text-gray-500\b': r'\1text-muted-foreground',
    r'\bdark:text-gray-400\b': r'dark:text-muted-foreground',  # dark: gray-400 -> muted-foreground
    r'\b(dark:hover:|dark:focus:|dark:active:)text-gray-400\b': r'dark:text-muted-foreground',

    # Primary Text (Light: sky-800, Dark: blue-500)
    r'\b(dark:)?text-sky-800\b': r'text-primary',  # Light base
    r'\b(hover:|focus:|active:)?text-sky-800\b': r'\1text-primary',  # Light states
    r'\bdark:text-blue-500\b': r'dark:text-primary',  # Dark base
    r'\b(dark:hover:|dark:focus:|dark:active:)text-blue-500\b': r'\1text-primary',  # Dark states

    # Borders
    r'\b(dark:)?border-gray-300\b': r'\1border-border',
    r'\bdark:border-gray-700\b': r'dark:border-border',  # dark: gray-700 -> border

    # Primary Borders (Light: sky-800, Dark: blue-500)
    r'\b(dark:)?border-sky-800\b': r'border-primary',  # Light base
    r'\b(hover:|focus:|active:)?border-sky-800\b': r'\1border-primary',  # Light states
    r'\bdark:border-blue-500\b': r'dark:border-primary',  # Dark base
    r'\b(dark:hover:|dark:focus:|dark:active:)border-blue-500\b': r'\1border-primary',  # Dark states

    # Rings (Light: sky-800/primary, Dark: blue-500/primary/ring)
    r'\b(focus:|focus-visible:|dark:focus:|dark:focus-visible:)?ring-sky-800\b': r'\1ring-ring',
    r'\b(focus:|focus-visible:|dark:focus:|dark:focus-visible:)?ring-blue-500\b': r'\1ring-ring',
    # Maps dark blue-500 to ring var

    # Ring Offset (Light: white, Dark: gray-950 approx)
    r'\bring-offset-white\b': r'ring-offset-background',
    r'\bdark:ring-offset-gray-950\b': r'dark:ring-offset-background',  # dark: gray-950 -> background

    # Border Radius (Only if standardizing ALL to 'lg' defined in theme)
    # Uncomment below ONLY if you want to force rounded-sm/md to the theme's 'lg' radius
    # r'\brounded-sm\b': 'rounded-lg',
    # r'\brounded-md\b': 'rounded-lg',
}


# --- Helper Function ---
def replace_classes_in_file(file_path, replacements):
    """Reads a file, performs replacements, and writes back if changed."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:  # Added errors='ignore' for robustness
            content = f.read()
    except Exception as e:
        print(f"Error reading file {file_path}: {e}", file=sys.stderr)
        return False

    original_content = content
    modified = False

    for find_pattern, replace_with in replacements.items():
        # Use re.sub for regex replacement
        # Using a lambda function to handle group preservation more robustly
        def replacer(match):
            # The replacement string `replace_with` might contain backreferences like \1
            # We need to expand these based on the match object
            return match.expand(replace_with)

        try:
            new_content, num_subs = re.subn(find_pattern, replacer, content)
            if num_subs > 0:
                modified = True
                content = new_content
        except re.error as e:
            print(f"Regex error with pattern '{find_pattern}' in file {file_path}: {e}", file=sys.stderr)
            # Skip this pattern for this file if regex is invalid
            continue

    if modified:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Modified: {file_path}")
            return True
        except Exception as e:
            print(f"Error writing file {file_path}: {e}", file=sys.stderr)
            # Attempt to restore original content on write error (basic rollback)
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(original_content)
                print(f"Restored original content for: {file_path}", file=sys.stderr)
            except Exception as restore_e:
                print(f"Failed to restore original content for {file_path}: {restore_e}", file=sys.stderr)
            return False
    else:
        # print(f"No changes needed: {file_path}")
        return False


# --- Main Execution ---
if __name__ == "__main__":
    if PROJECT_ROOT == './beak-insights-felicity-lims' or not os.path.isdir(PROJECT_ROOT):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", file=sys.stderr)
        print("!!! ERROR: Please update the 'PROJECT_ROOT' variable in the script", file=sys.stderr)
        print("!!!        to the correct path of your project directory.   !!!", file=sys.stderr)
        print(f"!!!        Current value is placeholder: '{PROJECT_ROOT}'", file=sys.stderr)
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", file=sys.stderr)
        sys.exit(1)

    print(f"Starting Tailwind class replacement in: {os.path.abspath(PROJECT_ROOT)}")
    print(f"Targeting file extensions: {FILE_EXTENSIONS}")
    print("---")
    print("IMPORTANT: Backup your project before proceeding.")
    print("           Review all changes carefully after the script runs.")
    print("           Ambiguous classes (e.g., text-white, bg-white) require manual review.")

    # Optional confirmation step (uncomment to use)
    # try:
    #     input("Press Enter to continue or Ctrl+C to cancel...")
    # except KeyboardInterrupt:
    #     print("\nOperation cancelled by user.")
    #     sys.exit(0)

    modified_count = 0
    processed_count = 0
    skipped_dirs = ['node_modules', '.git', '.vscode', 'dist', 'build', '__pycache__']

    for root, dirs, files in os.walk(PROJECT_ROOT, topdown=True):
        # Modify dirs in-place to skip specified directories
        dirs[:] = [d for d in dirs if d not in skipped_dirs and not d.startswith('.')]

        for filename in files:
            if filename.endswith(FILE_EXTENSIONS):
                file_path = os.path.join(root, filename)
                processed_count += 1
                if replace_classes_in_file(file_path, REPLACEMENTS):
                    modified_count += 1

    print("---")
    print("Replacement process finished.")
    print(f"Processed {processed_count} files.")
    print(f"Modified {modified_count} files.")
    print("Please review the changes (e.g., using 'git diff').")
    print("Remember to manually replace context-dependent classes like 'text-white', 'bg-white', etc.")
