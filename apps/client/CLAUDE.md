# Client — Marketplace Storefront (`@app/client`)

## Overview
Next.js 15 (App Router) consumer-facing marketplace storefront. Uses Chakra UI v3 for the component library and JWT authentication against the NestJS API.

## Commands

```bash
pnpm --filter @app/client run dev        # Dev server on :4000
pnpm --filter @app/client run build      # Production build (standalone output)
pnpm --filter @app/client run start      # Production server on :4000
pnpm --filter @app/client run lint       # ESLint
```

## Code Quality
- **Always run `pnpm --filter @app/client run lint` after making changes** to verify and fix ESLint errors before considering a task complete.

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

## File Naming Conventions

### Components
- **PascalCase** — file name must match the exported component name exactly
- Examples: `UserCard.tsx`, `LoginForm.tsx`, `Navbar.tsx`

### Hooks
- **camelCase**, must start with `use`
- Examples: `useAuth.ts`, `useUser.ts`, `useDebounce.ts`

### Contexts
- **PascalCase**, suffix with `Context`
- Examples: `AuthContext.tsx`, `ThemeContext.tsx`

### Utility / Helper Functions
- **kebab-case**, descriptive action-based names
- Examples: `format-date.ts`, `parse-currency.ts`, `validate-email.ts`

### CSS Modules
- **kebab-case**, must include `.module.css`
- Examples: `user-card.module.css`, `login-form.module.css`

### Folder Structure
- Group a component and its related files (styles, tests) in a folder named after the component
  ```
  components/
    UserCard/
      UserCard.tsx
      user-card.module.css
  ```

### General Rules
- Be consistent — do not mix conventions
- Avoid generic names: `utils.ts`, `helpers.ts`, `index.ts` (unless needed for barrel exports)
- Invalid: `userCard.tsx`, `user_card.tsx`, `User-card.tsx`

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
