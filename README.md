# Forge

A full-stack monorepo with a NestJS API, a Next.js admin dashboard, and a Next.js marketplace storefront. Managed with **pnpm workspaces**.

## Apps & Packages

| Package | Description | Port |
|---|---|---|
| `@app/api` | NestJS backend — JWT auth, Prisma ORM, RBAC, Swagger | `8080` |
| `@app/admin` | Next.js 15 admin dashboard — users, roles, permissions, e-commerce | `3000` |
| `@app/client` | Next.js 15 marketplace storefront | `4000` |
| `@app/utils` | Shared utilities (formatting, pagination types) | — |

## Tech Stack

- **API:** NestJS 11, Prisma 7, PostgreSQL 16, JWT (passport-jwt), Vitest
- **Admin / Client:** Next.js 15 (App Router), React 19, Chakra UI v3, next-intl
- **Tooling:** pnpm workspaces, Husky + lint-staged, ESLint, Prettier, Docker

## Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [pnpm](https://pnpm.io) ≥ 9
- [Docker](https://www.docker.com) (for the PostgreSQL database)

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp apps/api/.env.example apps/api/.env

# 3. Start everything (DB + migrations + all dev servers)
pnpm dev
```

`pnpm dev` will:
1. Start PostgreSQL via Docker Compose
2. Run Prisma migrations
3. Seed the database (first run only)
4. Start all three dev servers concurrently

## Commands

### Root-level

```bash
pnpm dev              # Start all dev servers (API + admin + client)
pnpm dev:api          # Start API only
pnpm dev:admin        # Start admin only
pnpm dev:client       # Start client only
pnpm build            # Build all apps
pnpm build:api        # Build API only
pnpm build:admin      # Build admin only
pnpm build:client     # Build client only
pnpm test             # Run API unit tests
pnpm test:e2e         # Run API e2e tests (requires running DB)
pnpm lint             # Lint all packages
pnpm format           # Format all TypeScript files with Prettier
```

### Per-workspace

```bash
pnpm --filter @app/api run <script>
pnpm --filter @app/admin run <script>
pnpm --filter @app/client run <script>
```

### Database (API)

```bash
pnpm --filter @app/api run prisma:migrate   # Run migrations (dev)
pnpm --filter @app/api run prisma:seed      # Seed the database
pnpm --filter @app/api run prisma:generate  # Regenerate Prisma client
pnpm --filter @app/api run prisma:studio    # Open Prisma Studio
```

## Infrastructure

PostgreSQL runs in Docker. Start it independently with:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Default credentials: `postgres:postgres`, database: `nestjs_app`, port `5432`.

## API

- **Base URL:** `http://localhost:8080/api`
- **Swagger docs:** `http://localhost:8080/api/docs`
- All responses are wrapped in `{ data: ... }`
- All routes are JWT-protected by default; use `@Public()` to opt out

### Auth flow

1. `POST /api/auth/login` → returns `accessToken`
2. Pass token as `Authorization: Bearer <token>` on subsequent requests

## Admin Dashboard

- **URL:** `http://localhost:3000`
- Manages users, roles, permissions, vendors, categories, products, orders, and reviews
- Supports English and Portuguese (pt-BR) — toggle via the globe icon in the header

## Marketplace Client

- **URL:** `http://localhost:4000`
- Consumer-facing storefront
- Authentication required for cart, checkout, orders, and profile pages

## Environment Variables

### `apps/api/.env`

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/nestjs_app` |
| `JWT_SECRET` | Secret for signing JWT tokens | — |

### `apps/admin/.env.local` / `apps/client/.env.local`

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:8080/api` |

## Project Structure

```
/
├── apps/
│   ├── api/            # NestJS API (@app/api)
│   ├── admin/          # Admin dashboard (@app/admin)
│   └── client/         # Marketplace storefront (@app/client)
├── packages/
│   └── utils/          # Shared utilities (@app/utils)
├── scripts/
│   ├── dev.sh          # Dev startup script
│   └── build.sh        # Build script
├── docker-compose.dev.yml
├── pnpm-workspace.yaml
└── package.json
```

## Code Quality

- **Pre-commit:** Husky runs lint-staged — ESLint + Prettier on staged files per workspace
- **Prettier config:** singleQuote, jsxSingleQuote, no semicolons
- **Linting:** Each app has its own ESLint flat config
