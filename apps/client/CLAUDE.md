# Client — Marketplace Storefront (`@app/client`)

## Overview
Next.js 15 (App Router) consumer-facing marketplace storefront. Uses Chakra UI v3 for the component library and JWT authentication against the NestJS API.

## Commands

```bash
pnpm --filter @app/client run dev        # Dev server on :3001
pnpm --filter @app/client run build      # Production build (standalone output)
pnpm --filter @app/client run start      # Production server on :3001
pnpm --filter @app/client run lint       # ESLint
```

## Architecture

### Route Groups
- `(auth)/` — Unauthenticated pages (login, register). Centered layout.
- `(store)/` — Public storefront. Navbar + Footer shell. Auth only required for cart/checkout/orders/profile.

### Authentication Flow
Same pattern as admin: JWT in localStorage, `AuthProvider` context, API client auto-handles 401.

### API Client (`lib/api-client.ts`)
- Same as admin: base URL from `NEXT_PUBLIC_API_URL`, auto-unwraps `{ data: ... }`
- Modular endpoint files in `lib/api/`

### Key Conventions
- All pages are client-rendered (`'use client'`)
- Chakra UI v3 API
- Icons from `react-icons/lu` (Lucide icon set)
- Prettier: singleQuote, jsxSingleQuote, no semicolons

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:8080/api` |
