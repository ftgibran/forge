# NestJS App

## Project Overview
NestJS backend with JWT authentication, Prisma ORM (PostgreSQL), and RBAC (Role-Based Access Control) with a triangle M2M relationship between Users, Roles, and Permissions. Structured as a **pnpm workspaces monorepo**.

## Tech Stack
- **Runtime:** Node.js + NestJS
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma 7 with `@prisma/adapter-pg`
- **Database:** PostgreSQL 16 (via Docker)
- **Auth:** JWT (passport-jwt) with bcrypt password hashing
- **Testing:** Vitest + unplugin-swc + supertest
- **Package Manager:** pnpm (workspaces)
- **Build:** SWC via NestJS CLI
- **Linting:** ESLint flat config + Prettier
- **Git Hooks:** Husky + lint-staged

## Monorepo Structure
```
/
├── apps/
│   └── api/                    # NestJS API application (@app/api)
│       ├── src/
│       ├── test/
│       ├── prisma/
│       └── ...config files
├── packages/                   # Shared packages (future)
├── pnpm-workspace.yaml         # Workspace definition
├── package.json                # Root: workspace scripts, husky, lint-staged
├── docker-compose.yml          # Shared infrastructure
├── .husky/pre-commit
├── .prettierrc
└── .gitignore
```

## Commands

### Root-level (workspace) commands
```bash
pnpm dev                # Start API dev server (proxies to @app/api)
pnpm build              # Build the API
pnpm test               # Run API unit tests
pnpm test:e2e           # Run API e2e tests
pnpm lint               # Lint all packages
pnpm format             # Format all TypeScript files
```

### API-specific commands (run from `apps/api/` or via filter)
```bash
pnpm --filter @app/api run build          # Compile with SWC
pnpm --filter @app/api run start:dev      # Dev server with watch mode
pnpm --filter @app/api run lint           # ESLint + auto-fix
pnpm --filter @app/api run test           # Unit tests (Vitest)
pnpm --filter @app/api run test:e2e       # E2E tests (requires running DB)
pnpm --filter @app/api run test:cov       # Unit tests with coverage
pnpm --filter @app/api run prisma:migrate # Run Prisma migrations
pnpm --filter @app/api run prisma:seed    # Seed the database
pnpm --filter @app/api run prisma:generate # Regenerate Prisma client
pnpm --filter @app/api run prisma:studio  # Open Prisma Studio
```

## Architecture

### Module Structure (apps/api/src/)
```
src/
├── auth/           # JWT auth, guards, decorators, strategies
├── users/          # User CRUD + role/permission assignment
├── roles/          # Role CRUD + permission assignment
├── permissions/    # Permission CRUD
├── prisma/         # Global PrismaModule + PrismaService
├── common/         # Shared DTOs, filters, interceptors
├── generated/      # Prisma generated client (gitignored)
├── app.module.ts   # Root module
└── main.ts         # Bootstrap with global pipes/filters/interceptors
```

### Key Patterns
- **Global JWT Guard:** All routes are protected by default. Use `@Public()` to opt out.
- **Permission Guard:** Use `@RequirePermissions('action:resource')` for fine-grained access control.
- **Triangle M2M:** Users↔Roles, Roles↔Permissions, Users↔Permissions (direct). Explicit join tables with composite PKs and `assignedAt` timestamps.
- **Password Safety:** Passwords are bcrypt-hashed. Never returned in API responses.
- **Response Wrapping:** All successful responses wrapped in `{ data: ... }` via TransformInterceptor.
- **Global Prefix:** All routes prefixed with `/api`.

### Prisma 7 Notes
- Uses `@prisma/adapter-pg` driver adapter (required in Prisma 7).
- Generated client lives in `apps/api/src/generated/prisma/` (gitignored).
- `prisma.config.ts` in `apps/api/` handles datasource URL and seed command.
- Seed runs via `tsx prisma/seed.ts`.

### Database
- Docker Compose: `docker compose up -d` starts PostgreSQL 16 Alpine on port 5432.
- Default credentials: `postgres:postgres`, database: `nestjs_app`.

### Testing
- **Unit tests:** Mock PrismaService, located alongside source files (`*.spec.ts`).
- **E2E tests:** Use real AppModule + database, located in `apps/api/test/` directory.
- **Vitest config:** `vitest.config.ts` (unit), `vitest.config.e2e.ts` (e2e with sequential file execution).
- E2E tests clean the database in `beforeAll` and set up their own fixtures.
