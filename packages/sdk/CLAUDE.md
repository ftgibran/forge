# SDK Package — `@app/sdk`

## Purpose
React SDK providing hooks and utilities for client-side interaction with the NestJS API. Built on React Query, it eliminates boilerplate for API calls while maintaining full type safety.

## Structure
```
src/
├── client/
│   ├── api-client.ts      # Fetch-based HTTP client
│   └── context.tsx        # React context + useApiClient() hook
├── hooks/
│   ├── cart/              # 5 hooks
│   ├── categories/        # 6 hooks
│   ├── orders/            # 5 hooks
│   ├── permissions/       # 5 hooks
│   ├── products/          # 13 hooks (CRUD + variants + images)
│   ├── reviews/           # 4 hooks
│   ├── roles/             # 7 hooks
│   ├── users/             # 9 hooks (CRUD + role/permission assignment)
│   └── vendors/           # 10 hooks
├── keys/
│   └── index.ts           # React Query query key factory
├── provider/
│   └── SdkProvider.tsx    # Root provider (QueryClient + ApiClientContext)
├── types/
│   └── index.ts           # TypeScript interfaces
└── index.ts               # Barrel export
```

## Key Conventions

### Adding a new hook
- **Query (read):** use `useQuery` from React Query; accept optional `options` param of type `UseQueryOptions`.
- **Mutation (write):** use `useMutation`; invalidate relevant query keys via `queryClient.invalidateQueries` on `onSuccess`.
- Register query keys in `src/keys/index.ts` following the existing hierarchical structure.
- Export from the domain's `index.ts` and re-export from `src/index.ts`.

### Adding a new domain
1. Create `src/hooks/<domain>/` with individual hook files and an `index.ts` barrel.
2. Add query keys to `src/keys/index.ts`.
3. Add TypeScript types to `src/types/index.ts`.
4. Export everything from `src/index.ts`.

### API client
- `ApiClient` unwraps `{ data: T }` API responses automatically.
- Auth token is injected via the `getToken()` callback passed to `SdkProvider`.
- Errors are thrown as `ApiError` (has `.status` and `.message`).

### Types
All domain models live in `src/types/index.ts`: `User`, `Role`, `Permission`, `Vendor`, `Category`, `Product`, `Order`, `Review`, `Cart`, `PaginatedList<T>`, etc.

## Peer Dependencies
- `react` >=18
- `@tanstack/react-query` >=5

## Usage (consumer side)
```tsx
<SdkProvider baseUrl='/api' getToken={() => token}>
  <App />
</SdkProvider>
```
