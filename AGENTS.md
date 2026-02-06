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

## Frontend Component Patterns

### Checkbox with vee-validate FormField

When using the `Checkbox` component with vee-validate's `FormField`, bind `componentField` directly to the checkbox:

```vue
<!-- CORRECT -->
<FormField name="myBooleanField" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
  <FormItem class="flex items-center space-x-2">
    <FormControl>
      <Checkbox v-bind="componentField" :disabled="processing" />
    </FormControl>
    <FormLabel>My checkbox label</FormLabel>
  </FormItem>
</FormField>
```

```vue
<!-- INCORRECT - Do NOT use these patterns -->
<!-- value/handleChange pattern is discouraged for checkbox fields in this codebase -->
<FormField name="myField" v-slot="{ value, handleChange }">
  <Checkbox :checked="value" @update:checked="handleChange" />
</FormField>
```

Use `v-slot="{ componentField }"` and bind directly with `v-bind="componentField"` for `Checkbox` fields.
Always include `type="checkbox"` + checked/unchecked values so submitted values remain booleans.
Avoid deprecated `Form` component usage from `@/components/ui/form`.
Use the current pattern: `useForm` + native `<form @submit.prevent="...">` + `FormField`.
For pages with multiple submit actions/sections sharing one form state, prefer separate `useForm` instances per section or submit current `values` directly for section-specific actions to avoid unrelated validation blocking submit.
If checkboxes appear not to bind despite correct template markup, verify there are no stale references to removed form instances (for example, `setSettingValues` after consolidating to one `useForm`), and use one consistent `useForm` source for the fields being rendered.
For laboratory settings updates, include `laboratoryUid` in the mutation payload when required by GraphQL input types.
