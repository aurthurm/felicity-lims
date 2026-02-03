# Repository Guidelines

## Project Structure & Module Organization

- `felicity/` contains the FastAPI backend, domain modules under `felicity/apps/`, GraphQL in `felicity/api/gql/`, and database assets in `felicity/migrations/`.
- `felicity/tests/` holds backend tests.
- `webapp/` is the Vue 3 + TypeScript frontend with `webapp/src/` for components, views, queries, and stores.
- Deployment and tooling live at the repo root: `docker-compose*.yml`, `Dockerfile.*`, `Makefile`, `requirements*.txt`, `package.json`.

## Build, Test, and Development Commands

- `make build` / `make up` / `make down` manage the Docker dev stack (`docker-compose.dev.yml`).
- `docker compose -f docker-compose.dev.yml exec felicity-api felicity-lims db upgrade` runs DB migrations in dev.
- `pnpm server:uv:watch` runs the API with reload for local dev.
- `pnpm webapp:dev` runs the Vite frontend; `pnpm webapp:dev:watch` also runs GraphQL codegen.
- `pnpm standalone:build` builds the frontend and copies assets into `felicity/templates/static`.

## Coding Style & Naming Conventions

- Python: 100% type hints and Google-style docstrings are required; use async/await for I/O.
- Naming: classes `PascalCase`, functions `snake_case`, constants `UPPER_SNAKE_CASE`, private methods prefixed with `_`.
- Formatting and linting: `bash ./felicity/scripts/format.sh` (Ruff) and `bash ./felicity/scripts/lint.sh`.
- Frontend: ESLint and Prettier via `pnpm webapp:lint` and `pnpm webapp:prettier:format`.

## Testing Guidelines

- Backend tests use `pytest` with `pytest-asyncio` for async tests.
- Run tests with `pnpm server:test` (wraps `felicity/scripts/test.sh`).
- Coverage runs are supported: `pnpm server:test --cov`.

## Commit & Pull Request Guidelines

- Commit messages follow Conventional Commits: `type(scope): subject` (e.g., `feat(sample): add lifecycle guard`).
- Keep subjects imperative, <= 50 chars, no trailing period; include a body for why.
- PRs require tests and linting to pass, a clear description, related issues, and screenshots for UI changes.
- PR titles use the same format as commit messages; merges are squash to main.

## Configuration Tips

- Copy `env.example` to `.env` and adjust for local ports, DB credentials, and service URLs.
