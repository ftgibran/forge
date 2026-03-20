import type { ProductQueryParams } from '../types'

export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (page: number, limit: number) =>
      ['users', 'list', page, limit] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  roles: {
    all: ['roles'] as const,
    list: (page: number, limit: number) =>
      ['roles', 'list', page, limit] as const,
    detail: (id: string) => ['roles', 'detail', id] as const,
  },
  permissions: {
    all: ['permissions'] as const,
    list: (page: number, limit: number) =>
      ['permissions', 'list', page, limit] as const,
    detail: (id: string) => ['permissions', 'detail', id] as const,
  },
  vendors: {
    all: ['vendors'] as const,
    list: (page: number, limit: number, status?: string) =>
      ['vendors', 'list', page, limit, status] as const,
    detail: (id: string) => ['vendors', 'detail', id] as const,
    bySlug: (slug: string) => ['vendors', 'slug', slug] as const,
    me: ['vendors', 'me'] as const,
    applications: {
      all: ['vendor-applications'] as const,
      list: (page: number, limit: number) =>
        ['vendor-applications', 'list', page, limit] as const,
    },
  },
  categories: {
    all: ['categories'] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
    bySlug: (slug: string) => ['categories', 'slug', slug] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params: ProductQueryParams) => ['products', 'list', params] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    bySlug: (slug: string) => ['products', 'slug', slug] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (page: number, limit: number) =>
      ['orders', 'list', page, limit] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    my: {
      all: ['orders', 'my'] as const,
      list: (page: number, limit: number) =>
        ['orders', 'my', 'list', page, limit] as const,
    },
  },
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string, page: number, limit: number) =>
      ['reviews', 'product', productId, page, limit] as const,
    detail: (id: string) => ['reviews', 'detail', id] as const,
  },
  cart: {
    root: ['cart'] as const,
  },
} as const
