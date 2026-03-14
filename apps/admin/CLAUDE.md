# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Next.js 15 (App Router) admin dashboard for managing users, roles, permissions, and e-commerce entities (vendors, products, categories, orders, reviews). Uses Chakra UI v3 for the component library and JWT authentication against the NestJS API.

## Commands

```bash
pnpm --filter @app/admin run dev        # Dev server on :3000
pnpm --filter @app/admin run build      # Production build (standalone output)
pnpm --filter @app/admin run start      # Production server on :3000
pnpm --filter @app/admin run lint       # ESLint
```

## Architecture

### Route Groups
- `(auth)/` — Unauthenticated pages (login, register). Centered layout.
- `(dashboard)/` — Protected pages. Auth guard in layout redirects to `/login` if unauthenticated. Provides sidebar + header shell.

### Authentication Flow
1. Login/register calls API, receives JWT `accessToken` + user object
2. Token stored in `localStorage`, injected via `Authorization: Bearer` header
3. `AuthProvider` (React Context in `lib/auth-context.tsx`) checks token on mount via `/auth/me`
4. Dashboard layout reads `useAuth()` — redirects to `/login` if no user after loading
5. API client (`lib/api-client.ts`) auto-handles 401 by clearing token and redirecting

### API Client (`lib/api-client.ts`)
- Base URL from `NEXT_PUBLIC_API_URL` env var (default: `http://localhost:8080/api`)
- Auto-unwraps `{ data: ... }` response wrapper from the API
- Typed methods: `get<T>`, `post<T>`, `patch<T>`, `del<T>`
- Modular endpoint files in `lib/api/` (one per entity)

### Page Pattern (CRUD)
Every dashboard page follows the same pattern:
1. Page component (`'use client'`) manages state: items list, pagination, selected item, dialog open flags
2. Fetches data with `useCallback` + `useEffect`, passes pagination params
3. Renders `<DataTable>` with column definitions and action buttons
4. Opens dialog components for create/edit/delete/relationship management
5. Dialog components manage their own form state, call API on submit, show toast, invoke `onSaved` callback to refresh parent

### Component Organization
- `components/ui/` — Chakra UI v3 auto-generated snippets (do not edit manually)
- `components/` — Shared layout components: `header`, `sidebar`, `page-header`, `data-table`, `table-skeleton`, `stat-card`, `confirm-dialog`
- `components/{entity}/` — Entity-specific form and relationship dialogs

### Shared Package
- `@app/utils` provides `formatDate`, `formatPermission`, and pagination types
- Must be listed in `next.config.ts` `transpilePackages`

## Key Conventions

- All pages are client-rendered (`'use client'`) — no SSR/RSC data fetching
- Chakra UI v3 API: `DialogRoot`/`DialogContent` with `open`/`onOpenChange` props (not v2 `isOpen`/`onClose`)
- Icons from `react-icons/lu` (Lucide icon set)
- Prettier: singleQuote, jsxSingleQuote, no semicolons
- ESLint has relaxed rules for `src/components/ui/**/*.tsx` (auto-generated code)

## Internationalization (i18n)

- **Library:** `next-intl` (cookie-based locale, no URL routing)
- **Locales:** `en` (default), `pt-BR`
- **Message files:** `messages/en.json`, `messages/pt-BR.json` — organized by namespace (camelCase keys, 2 levels max)
- **Server config:** `src/i18n/request.ts` — reads `NEXT_LOCALE` cookie to select locale
- **Provider:** `NextIntlClientProvider` wraps the app in `src/app/layout.tsx`
- **Usage in components:** `useTranslations('namespace')` hook — e.g. `const t = useTranslations('users')`
- **Locale switcher:** `components/locale-switcher.tsx` — globe icon in header and auth layout, sets cookie + refreshes

### i18n Conventions
- **All user-facing strings must be in locale files** — never hardcode UI text in components
- **Namespace per entity:** `common`, `nav`, `auth`, `notFound`, `dashboard`, `users`, `roles`, `permissions`, `vendors`, `categories`, `products`, `orders`, `reviews`, `profile`, `localeSwitcher`
- **Shared labels** (Cancel, Create, Update, Delete, Name, Email, etc.) live in `common` namespace
- **Interpolation:** ICU syntax — `"deleteConfirm": "Are you sure you want to delete \"{name}\"?"`
- When adding new pages/features, add translations to both `en.json` and `pt-BR.json`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:8080/api` |

## Types

All entity interfaces are in `src/types/index.ts`. Key entities: User, Role, Permission, Vendor, Category, Product (with 3D print specs), ProductVariant, ProductImage, Order, OrderItem, Review.