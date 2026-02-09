# App Sandbox — pnpm Monorepo

## Project Overview
Full-stack application with a NestJS API backend, Next.js admin dashboard, and shared utility packages. Managed as a **pnpm workspaces monorepo**.

## Monorepo Structure
```
/
├── apps/
│   ├── api/            # NestJS API backend (@app/api)
│   └── admin/          # Next.js 15 admin dashboard (@app/admin)
├── packages/
│   └── utils/          # Shared utilities (@app/utils)
├── pnpm-workspace.yaml
├── docker-compose.yml  # PostgreSQL + shared infrastructure
├── .husky/pre-commit
├── .prettierrc
└── .gitignore
```

## Commands

### Root-level
```bash
pnpm dev              # Start API + admin dev servers concurrently
pnpm dev:api          # Start API dev server only
pnpm dev:admin        # Start admin dev server only
pnpm build            # Build the API
pnpm build:admin      # Build the admin app
pnpm test             # Run API unit tests
pnpm test:e2e         # Run API e2e tests
pnpm lint             # Lint all packages
pnpm format           # Format all TypeScript files with Prettier
```

### Per-workspace (via filter)
```bash
pnpm --filter @app/api run <script>
pnpm --filter @app/admin run <script>
pnpm --filter @app/utils run <script>
```

## Infrastructure
- **Docker Compose:** `docker compose up -d` starts PostgreSQL 16 Alpine on port 5432.
- **Default DB credentials:** `postgres:postgres`, database: `nestjs_app`.

## Tooling
- **Package Manager:** pnpm (workspaces)
- **Git Hooks:** Husky + lint-staged (pre-commit runs ESLint + Prettier per workspace)
- **Prettier:** singleQuote, jsxSingleQuote, no semicolons
- **Linting:** Each app has its own ESLint flat config

## Key Conventions
- Each app has its own `CLAUDE.md` with app-specific guidance — refer to those for details.
- Shared types and utilities go in `packages/utils`.
- All API responses are wrapped in `{ data: ... }`.