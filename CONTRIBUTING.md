# Contributing to Felicity LIMS

Thank you for your interest in contributing to Felicity LIMS! This document provides guidance on how to contribute effectively to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Workflow](#workflow)
5. [Coding Standards](#coding-standards)
6. [Commit Messages](#commit-messages)
7. [Pull Requests](#pull-requests)
8. [Issues](#issues)
9. [Semantic Versioning](#semantic-versioning)
10. [Testing](#testing)
11. [Documentation](#documentation)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and considerate in all interactions.

- **Be respectful**: Treat all contributors with respect and courtesy
- **Be inclusive**: Welcome contributors from all backgrounds and experience levels
- **Be professional**: Maintain a professional tone in all communications
- **Report issues**: Report inappropriate behavior to [aurthurmusendame@gmail.com](mailto:aurthurmusendame@gmail.com)

---

## Getting Started

### Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **Git**: Latest version
- **Docker**: (optional, but recommended for development)
- **GitHub Account**: For forking and submitting PRs

### Fork the Repository

1. Visit [Felicity LIMS Repository](https://github.com/beak-insights/felicity-lims)
2. Click the **Fork** button in the top-right corner
3. This creates a copy of the repository under your GitHub account

```bash
# Clone your fork locally
git clone https://github.com/YOUR_USERNAME/felicity-lims.git
cd felicity-lims

# Add upstream remote to keep in sync
git remote add upstream https://github.com/beak-insights/felicity-lims.git

# Verify remotes
git remote -v
# Output should show:
# origin    https://github.com/YOUR_USERNAME/felicity-lims.git (fetch)
# origin    https://github.com/YOUR_USERNAME/felicity-lims.git (push)
# upstream  https://github.com/beak-insights/felicity-lims.git (fetch)
# upstream  https://github.com/beak-insights/felicity-lims.git (push)
```

---

## Development Setup

### 1. Clone and Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/felicity-lims.git
cd felicity-lims

# Create virtual environment
conda create -n felicity python=3.11
conda activate felicity

# Install dependencies
pip install -r requirements.txt
pnpm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp env.example .env

# Edit .env with your settings
nano .env
```

### 3. Start Development Services

**Option A: Docker Compose (Recommended)**
```bash
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml exec felicity-api felicity-lims db upgrade
```

**Option B: Local Development**
```bash
# Terminal 1: Backend API
pnpm server:uv:watch

# Terminal 2: Frontend
pnpm webapp:dev

# Terminal 3: Database migrations (as needed)
pnpm db:upgrade
```

---

## Workflow

### 1. Create a Feature Branch

Always create a new branch for your work. Never commit directly to `main`.

```bash
# Sync with upstream first
git fetch upstream
git rebase upstream/main

# Create feature branch
# Format: feature/description, bugfix/description, docs/description
git checkout -b feature/my-feature-description

# Example branches:
# feature/add-patient-search
# bugfix/fix-worksheet-validation
# docs/update-api-documentation
# refactor/simplify-instrument-connection
```

### 2. Make Your Changes

```bash
# Edit files in your feature branch
# Commit frequently with clear messages (see Commit Messages section)

git add .
git commit -m "type: description of changes"
```

### 3. Keep Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream/main (preferred over merge)
git rebase upstream/main

# If conflicts occur, resolve them:
# 1. Edit conflicted files
# 2. Mark as resolved: git add <file>
# 3. Continue rebase: git rebase --continue
```

### 4. Push to Your Fork

```bash
# Push your feature branch
git push origin feature/my-feature-description

# Note: Use --force-with-lease if you've rebased
git push origin feature/my-feature-description --force-with-lease
```

### 5. Create Pull Request

- Go to your fork on GitHub
- Click **Compare & pull request** button
- Follow the PR template (see Pull Requests section)
- Ensure all checks pass

---

## Coding Standards

### Python Code

#### Type Hints (100% Required)

Every function must have complete type hints:

```python
# ✅ Good
async def process_sample(
    sample_id: str,
    analysis_types: list[str]
) -> dict[str, Any]:
    """Process a sample with given analysis types."""
    pass

# ❌ Bad - Missing type hints
async def process_sample(sample_id, analysis_types):
    """Process a sample with given analysis types."""
    pass
```

#### Docstrings (100% Required)

Use Google-style docstrings:

```python
def calculate_total(items: list[float], tax_rate: float = 0.1) -> float:
    """
    Calculate total with tax for given items.

    Args:
        items: List of item prices
        tax_rate: Tax rate as decimal (default: 0.1 = 10%)

    Returns:
        Total amount including tax

    Raises:
        ValueError: If any item price is negative
    """
    if any(price < 0 for price in items):
        raise ValueError("Item prices must be non-negative")
    
    subtotal = sum(items)
    return subtotal * (1 + tax_rate)
```

#### Async/Await Patterns

Always use async for I/O operations:

```python
# ✅ Good - Async I/O
async def fetch_patient(patient_id: str) -> Patient:
    """Fetch patient from database."""
    return await PatientService().get(uid=patient_id)

# ✅ Good - Create task for background work
async def process_sample(sample: Sample) -> None:
    """Process sample asynchronously."""
    asyncio.create_task(self._background_process(sample))

# ❌ Bad - Blocking I/O in async function
async def fetch_patient(patient_id: str) -> Patient:
    """Fetch patient from database."""
    return PatientService().get_sync(uid=patient_id)  # WRONG
```

#### Naming Conventions

- **Classes**: PascalCase (`SocketLink`, `SampleService`)
- **Functions/Methods**: snake_case (`process_data`, `get_links`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_MESSAGE_SIZE`, `TIMEOUT_SECONDS`)
- **Private methods**: Leading underscore (`_internal_method`)

### Frontend Code (Vue 3 + TypeScript)

```typescript
// ✅ Good - Full type safety
interface SampleProps {
  sampleId: string;
  status: 'pending' | 'processing' | 'completed';
  onStatusChange: (status: string) => void;
}

const SampleCard: FC<SampleProps> = ({
  sampleId,
  status,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await updateSampleStatus(sampleId);
      onStatusChange('updated');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

### Code Quality Tools

```bash
# Linting (Python - Ruff)
bash ./felicity/scripts/lint.sh

# Formatting (Python - Ruff)
bash ./felicity/scripts/format.sh

# Linting (Frontend - ESLint)
pnpm webapp:lint

# Formatting (Frontend - Prettier)
pnpm webapp:prettier:format
```

---

## Commit Messages

### Format

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only
- **style**: Code style changes (formatting, quotes, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Test additions or changes
- **chore**: Build process, dependencies, etc.

### Scope (Optional)

- **iol**: IOL Analyzer module
- **patient**: Patient management
- **sample**: Sample management
- **analysis**: Analysis module
- **worksheet**: Worksheet management
- **api**: GraphQL/REST API
- **frontend**: Vue.js frontend
- **db**: Database/migrations
- **docker**: Docker configuration

### Subject

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Max 50 characters

### Body

- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Reference issues: `Fixes #123` or `Relates to #456`

### Examples

```
feat(iol): add ASTM protocol handler

Implement ASTM E1381 protocol support with:
- Frame sequence validation
- Checksum verification
- ENQ/ACK handshake
- Message assembly

Fixes #123

---

fix(worksheet): prevent duplicate sample entries

Check for existing sample entry before adding new row.
Prevent users from accidentally adding the same sample twice
to a worksheet.

Fixes #456

---

docs: update README with quick start guide

Add 5-minute Docker setup guide and access points documentation.
Improve onboarding experience for new developers.

---

refactor(sample): simplify lifecycle management

Extract common logic into separate methods to reduce code duplication.
No functional changes, improves maintainability.
```

---

## Pull Requests

### Before Creating a PR

1. **Run Tests**
   ```bash
   pnpm server:test
   pnpm webapp:lint
   ```

2. **Check Code Quality**
   ```bash
   bash ./felicity/scripts/lint.sh
   bash ./felicity/scripts/format.sh
   ```

3. **Update Documentation**
   - Update README if needed
   - Add docstrings
   - Update CHANGELOG if applicable

4. **Sync with Main**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Related Issues
Fixes #123
Relates to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Screenshot/video attached (if UI change)

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings generated
- [ ] Commits have clear messages
- [ ] Changes rebased on latest main

## Screenshots/Videos (if applicable)
Attach screenshots or videos demonstrating the change
```

### PR Title Format

Use the same format as commit messages:

```
feat(iol): add ASTM protocol handler
fix(worksheet): prevent duplicate entries
docs: update API documentation
refactor(sample): simplify lifecycle management
```

### PR Review Process

1. **Automated Checks**
   - Tests must pass
   - Linting must pass
   - Code coverage maintained

2. **Code Review**
   - At least 1 approval required
   - Maintainers will review changes
   - Feedback will be provided

3. **Merge**
   - PRs are squashed and merged to main
   - Clean commit history maintained
   - Branch deleted after merge

---

## Issues

### Creating Good Issues

#### Bug Reports

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 22.04]
- Python Version: 3.11
- Browser: [if frontend bug]

## Screenshots
Attach screenshots if applicable

## Additional Context
Any additional information
```

#### Feature Requests

```markdown
## Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Benefits
Why is this important?

## Alternative Solutions
Other approaches considered

## Additional Context
Related issues, references, etc.
```

### Issue Labels

Maintainers use labels to organize issues:

- **bug**: Something isn't working
- **feature**: New functionality
- **enhancement**: Improvement to existing feature
- **documentation**: Docs improvements needed
- **question**: Further information needed
- **good first issue**: Good for newcomers
- **help wanted**: Extra attention needed
- **blocked**: Waiting for something
- **priority-high**: Important, urgent
- **priority-low**: Nice to have

---

## Semantic Versioning

Felicity LIMS follows [Semantic Versioning 2.0.0](https://semver.org/).

### Version Format

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]

Example: 4.1.2-beta.1+build.123
```

### Version Increments

- **MAJOR** (e.g., 4.0.0 → 5.0.0): Breaking changes
  - API changes
  - Database schema changes
  - Removed features
  - Major refactoring

- **MINOR** (e.g., 4.1.0 → 4.2.0): New features (backward compatible)
  - New protocol support
  - New modules
  - New API endpoints
  - Performance improvements

- **PATCH** (e.g., 4.1.2 → 4.1.3): Bug fixes (backward compatible)
  - Bug fixes
  - Security patches
  - Documentation updates
  - Minor improvements

### Pre-release Versions

- `4.1.0-alpha.1`: Alpha release
- `4.1.0-beta.1`: Beta release
- `4.1.0-rc.1`: Release candidate

### Version Bump Strategy

When creating a release:

```bash
# Create release branch
git checkout -b release/v4.1.0

# Update version in files
# - setup.py
# - package.json
# - CHANGELOG.md
# - README.md (if mentioning version)

# Commit version bump
git commit -m "chore: bump version to 4.1.0"

# Tag release
git tag -a v4.1.0 -m "Release version 4.1.0"

# Push to main repo (maintainers only)
git push upstream main
git push upstream v4.1.0
```

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm server:test

# Run specific test file
pnpm server:test felicity/tests/unit/apps/patient/test_services.py

# Run with coverage
pnpm server:test --cov

# Run only unit tests
bash ./felicity/scripts/test.sh unit

# Run only integration tests
bash ./felicity/scripts/test.sh integration
```

### Writing Tests

#### Unit Tests

```python
import pytest
from felicity.apps.patient.services import PatientService

@pytest.mark.asyncio
async def test_get_patient_by_uid():
    """Test retrieving a patient by UID."""
    service = PatientService()
    patient = await service.get(uid="test-uid")
    
    assert patient is not None
    assert patient.uid == "test-uid"

@pytest.mark.asyncio
async def test_create_patient_with_valid_data():
    """Test creating a patient with valid data."""
    service = PatientService()
    patient_data = {
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1990-01-01"
    }
    
    patient = await service.create(patient_data)
    
    assert patient.first_name == "John"
    assert patient.last_name == "Doe"
```

#### Integration Tests

```python
@pytest.mark.asyncio
async def test_patient_workflow():
    """Test complete patient workflow."""
    # Create patient
    patient = await PatientService().create({...})
    
    # Create sample
    sample = await SampleService().create({
        "patient_uid": patient.uid,
        ...
    })
    
    # Verify relationship
    assert sample.patient_uid == patient.uid
```

### Test Coverage Requirements

- **Minimum**: 70% overall coverage
- **Target**: 80%+ coverage
- **New code**: 100% coverage required

---

## Documentation

### Code Documentation

All public APIs must have docstrings:

```python
class SampleService(BaseService):
    """Service for managing laboratory samples.
    
    Handles sample lifecycle including creation, analysis,
    results, and storage management.
    """
    
    async def create(self, sample_in: SampleCreate) -> Sample:
        """Create a new sample.
        
        Args:
            sample_in: Sample creation data
            
        Returns:
            Created sample instance
            
        Raises:
            ValueError: If sample data is invalid
            DuplicateError: If sample already exists
        """
```

### Documentation Files

- **README.md**: Project overview, quick start, technology stack
- **CLAUDE.md**: Architecture and development guidance
- **CONTRIBUTING.md**: (this file) Contribution guidelines
- **CHANGELOG.md**: Release notes and changes
- **docs/**: Additional documentation (if exists)

### Updating Documentation

When making changes:

1. Update docstrings in code
2. Update README if adding features
3. Update CHANGELOG with your changes
4. Add examples if it's a new feature

### CHANGELOG Format

```markdown
## [4.1.0] - 2025-10-27

### Added
- New IOL Analyzer ASTM protocol handler (#123)
- Async-first base class for all links

### Fixed
- Fixed APScheduler nested event loop issue (#456)
- Fixed worksheet validation bug

### Changed
- Refactored sample lifecycle management
- Improved database query performance

### Deprecated
- Old synchronous SocketLink (use SocketLink instead)

### Removed
- Serial port support (Phase 1 cleanup)

### Security
- Added message size limit (10 MB)
- Implemented message timeout (60 seconds)
```

---

## Review Checklist

Before submitting your PR, verify:

### Code Quality
- [ ] All type hints present
- [ ] All docstrings present
- [ ] Code follows style guide
- [ ] No hardcoded values
- [ ] No debug prints or logs
- [ ] Proper error handling

### Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests passing
- [ ] Coverage maintained/improved

### Documentation
- [ ] Docstrings updated
- [ ] README updated (if needed)
- [ ] CHANGELOG updated
- [ ] Comments added for complex logic

### Async/Await (Backend)
- [ ] All I/O operations are async
- [ ] No blocking calls in async code
- [ ] Proper error handling in async code
- [ ] No nested asyncio.run() calls

### Database (If applicable)
- [ ] Migration created
- [ ] ORM models updated
- [ ] Tenant context preserved
- [ ] Data isolation maintained

### Security (If applicable)
- [ ] No hardcoded credentials
- [ ] HIPAA compliance maintained
- [ ] Multi-tenant isolation verified
- [ ] Input validation implemented

---

## Getting Help

### Questions?

- **GitHub Discussions**: [Ask a question](https://github.com/beak-insights/felicity-lims/discussions)
- **Issues**: [Create an issue](https://github.com/beak-insights/felicity-lims/issues)
- **Email**: [aurthurmusendame@gmail.com](mailto:aurthurmusendame@gmail.com)

### Resources

- **README**: [Project overview](README.md)
- **CLAUDE.md**: [Architecture guide](CLAUDE.md)
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/
- **Vue 3 Docs**: https://vuejs.org/

---

## Recognition

Contributors will be recognized in:

- **CHANGELOG.md**: All changes with contributor names
- **GitHub**: Automatic recognition in PR discussions
- **README.md**: Major contributors (at maintainer discretion)

---

## License

By contributing to Felicity LIMS, you agree that your contributions will be licensed under the MIT License.

---

## Changelog

### Contributing Guidelines Version History

- **v1.0** (2025-10-27): Initial comprehensive contributing guidelines

---

Thank you for contributing to Felicity LIMS! 🎉
